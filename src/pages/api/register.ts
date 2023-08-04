import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import stripe from "src/utils/stripe-loader";

const prisma = new PrismaClient();

const validationSchema = Yup.object().shape({
  name: Yup.string().max(255).required("Business name is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string().max(255).required("Password is required"),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  const {
    body: { name, email, password },
  } = req;

  try {
    await validationSchema.validate(
      { name, email, password },
      { abortEarly: false },
    );
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }

  // Check if user exists
  const user = await prisma.user.findFirst({ where: { email } });
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
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
      treasury: { requested: true },
      card_issuing: { requested: true },
    },
  });

  // Create the user
  const hashedPassword = await bcrypt.hash(password, 8);
  const newUser = await prisma.user.create({
    data: {
      email,
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

  return res.json({ id: newUser.id, email: newUser.email });
};

export default handler;
