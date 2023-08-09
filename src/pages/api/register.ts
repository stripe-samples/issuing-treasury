import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { prisma } from "src/db";
import stripe from "src/utils/stripe-loader";

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};
const validationSchema = Yup.object().shape({
  username: Yup.string().max(255).required("Username is required"),
  password: Yup.string()
    .max(255)
    .required("Password is required")
    // check minimum characters
    .min(8, "Password must have at least 8 characters")
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  businessName: Yup.string().max(255).required("Business name is required"),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  const { username, password, email, businessName } = req.body;

  try {
    await validationSchema.validate(
      { username, password, email, businessName },
      { abortEarly: false },
    );
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }

  // Check if user exists
  const user = await prisma.user.findFirst({ where: { username } });
  if (user) {
    return res.status(400).json({
      error: "Account already exists.",
    });
  }

  // Create a Connected Account
  const account = await stripe.accounts.create({
    type: "custom",
    country: "US",
    email: email,
    company: {
      name: businessName,
    },
    // FOR-DEMO-ONLY: We're hardcoding the business type to individual. You should either remove this line or modify it
    // to collect the real business type from the user.
    business_type: "individual",
    // FOR-DEMO-ONLY: We're hardcoding the SSN to 000-00-0000 (Test SSN docs: https://stripe.com/docs/connect/testing#test-personal-id-numbers).
    // You should either remove this line or modify it to collect the actual SSN from the user in a real application.
    individual: {
      id_number: "000000000",
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
      treasury: { requested: true },
      card_issuing: { requested: true },
    },
  });

  // Create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
      accountId: account.id,
    },
  });

  // Create Financial Account
  await stripe.treasury.financialAccounts.create(
    {
      supported_currencies: ["usd"],
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

  return res.status(200).json({ message: "Account created successfully" });
};

export default handler;
