import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "src/db";
import { apiResponse } from "src/types/api-response";
import {
  CountryConfigMap,
  getPlatformStripeAccountForCountry,
  SupportedCountry,
} from "src/utils/account-management-helpers";
import { handlerMapping } from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";
import stripeClient from "src/utils/stripe-loader";
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

  // Create a Connected Account
  const platform = getPlatformStripeAccountForCountry(country);
  const stripe = stripeClient(platform);
  const account = await stripe.accounts.create({
    // This is the only supported configuration for Stripe Connect with Issuing. You can see more details in the docs (https://docs.stripe.com/issuing/connect).
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
    country: country.toString(),
    email: email,
    ...(isDemoMode() && {
      // FOR-DEMO-ONLY: We're hardcoding the business type to individual. You should either remove this line or modify it
      // to collect the real business type from the user.
      business_type: "individual",
      // FOR-DEMO-ONLY: We're hardcoding the SSN to 000-00-0000 (Test SSN docs: https://stripe.com/docs/connect/testing#test-personal-id-numbers).
      // You should either remove this line or modify it to collect the actual SSN from the user in a real application.
      individual: {
        id_number: "000000000",
      },
    }),
    capabilities: {
      transfers: { requested: true },
      // `card_payments` is only requested for the Test Data section to demonstrate payments and how it is a separate
      // balance from the Issuing balance or Treasury Financial Account balance. It is not required for Issuing or
      // Treasury.
      card_payments: { requested: true },
      card_issuing: { requested: true },
      // If we are creating an user an embedded finance platform, we must request
      // the `treasury` capability in order to create a FinancialAccount for them
      treasury: {
        requested: true,
      },
    },
  });

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

  // If this is an Embedded Finance user, create a Treasury Financial Account,
  // in which the user will store their funds
  await stripe.treasury.financialAccounts.create(
    {
      supported_currencies: [CountryConfigMap[country].currency],
      features: {
        card_issuing: { requested: true },
        deposit_insurance: { requested: true },
        financial_addresses: { aba: { requested: true } },
        inbound_transfers: { ach: { requested: true } },
        intra_stripe_flows: { requested: true },
        outbound_payments: {
          ach: { requested: true },
          us_domestic_wire: { requested: true },
        },
        outbound_transfers: {
          ach: { requested: true },
          us_domestic_wire: { requested: true },
        },
      },
    },
    { stripeAccount: account.id },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
