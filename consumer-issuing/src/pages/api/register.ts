import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "src/db";
import { apiResponse } from "src/types/api-response";
import {
  getPlatformStripeAccountForCountry,
  SupportedCountry,
} from "src/utils/account-management-helpers";
import { handlerMapping } from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";
import { getStripeSecretKey } from "src/utils/stripe-authentication";
import validationSchemas from "src/utils/validation-schemas";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: register,
  });

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password, country: rawCountry } = req.body;

  try {
    await validationSchemas.user.validate(
      { email, password, country: rawCountry },
      { abortEarly: false },
    );
  } catch (error) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: (error as Error).message },
      }),
    );
  }

  const country = rawCountry as SupportedCountry;

  // Check if user exists
  const user = await prisma.user.findFirst({ where: { email } });
  if (user) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: "Account already exists" },
      }),
    );
  }

  // Create a Connected Account using raw HTTP request
  const platform = getPlatformStripeAccountForCountry(country);
  const stripeSecretKey = getStripeSecretKey(platform);

  if (!stripeSecretKey) {
    return res.status(500).json(
      apiResponse({
        success: false,
        error: { message: "Stripe secret key not configured" },
      }),
    );
  }

  const accountPayload = {
    controller: {
      stripe_dashboard: {
        type: "none",
      },
      fees: {
        payer: "application",
      },
      requirement_collection: "application",
      losses: {
        payments: "application",
      },
    },
    country: country,
    email: email,
    ...(isDemoMode() && {
      business_type: "individual",
      individual: {
        id_number: "000000000",
      },
    }),
    capabilities: {
      transfers: { requested: true },
      card_payments: { requested: true },
      //card_issuing_consumer_revolving_credit_card_celtic: { requested: true },
    },
  };

  try {
    const formData = new URLSearchParams();
    
    // Add simple fields
    formData.append('country', country);
    formData.append('email', email);
    
    // Add nested objects
    formData.append('controller[stripe_dashboard][type]', 'none');
    formData.append('controller[fees][payer]', 'application');
    formData.append('controller[requirement_collection]', 'application');
    formData.append('controller[losses][payments]', 'application');
    
    // Add capabilities
    formData.append('capabilities[transfers][requested]', 'true');
    formData.append('capabilities[card_payments][requested]', 'true');
    formData.append('capabilities[card_issuing_consumer_revolving_credit_card_celtic][requested]', 'true');
    
    // Add demo mode fields if needed
    if (isDemoMode()) {
      formData.append('business_type', 'individual');
      formData.append('individual[id_number]', '000000000');
    }

    console.log('Stripe API Request:');
    console.log('URL: https://api.stripe.com/v1/accounts');
    console.log('Headers:');
    console.log(`  Content-Type: application/x-www-form-urlencoded`);
    console.log(`  Authorization: Bearer ${stripeSecretKey}`);
    console.log(`  Stripe-Version: 2024-04-10;issuing_program_beta=v2`);
    console.log('Body:');
    console.log(formData.toString());

    const response = await fetch("https://api.stripe.com/v1/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${stripeSecretKey}`,
        "Stripe-Version": "2024-04-10;issuing_program_beta=v2",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to create Stripe account");
    }

    const account = await response.json();

    // Create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        accountId: account.id,
        country: country.toString(),
      },
    });

    return res.status(200).json(apiResponse({ success: true }));
  } catch (error) {
    return res.status(500).json(
      apiResponse({
        success: false,
        error: { message: (error as Error).message },
      }),
    );
  }
};

export default handler;
