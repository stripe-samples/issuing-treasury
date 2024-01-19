import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { prisma } from "src/db";
import { apiResponse } from "src/types/api-response";
import UseCase from "src/types/use_cases";
import { handlerMapping } from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";
import { getPlatform } from "src/utils/platform";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: register,
  });

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password, country, useCase } = req.body;

  // Embedded Finance is a full financial services stack for your users:
  // accounts[0] with Treasury to store and send funds, with cards[1] with
  // Issuing for spending.
  // This is different from the Expense Management example, where you
  // top up balances[2] to fund spend on Issuing cards.
  //
  // [0] https://stripe.com/docs/treasury/account-management/financial-accounts
  // [1] https://stripe.com/docs/issuing/how-issuing-works
  // [2] https://stripe.com/docs/issuing/adding-funds-to-your-card-program
  const useTreasury = useCase == UseCase.EmbeddedFinance;

  const getCharacterValidationError = (str: string) => {
    return `Your password must have at least 1 ${str} character`;
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string()
      .max(255)
      .required("Password is required")
      // check minimum characters
      .min(8, "Password must have at least 8 characters")
      // different error messages for different requirements
      .matches(/[0-9]/, getCharacterValidationError("digit"))
      .matches(/[a-z]/, getCharacterValidationError("lowercase"))
      .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
    country: Yup.string().max(2).required("Country is required"),
    useCase: Yup.string().when("country", {
      is: "US",
      then: (schema) =>
        schema.oneOf(
          ["embedded_finance"],
          "This use case is not yet supported in the selected country",
        ),
      otherwise: (schema) =>
        schema.oneOf(
          ["expense_management"],
          "This use case is not yet supported in the selected country",
        ),
    }),
  });

  try {
    await validationSchema.validate(
      { email, password, country, useCase },
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
  const platform = getPlatform(country);
  const stripe = stripeClient(platform);
  const account = await stripe.accounts.create({
    type: "custom",
    country: country,
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
      card_payments: { requested: true },
      transfers: { requested: true },
      // if we are creating an user an embedded finance platform, we must request
      // the `treasury` capability in order to create a FinancialAccount for them
      treasury: { requested: useTreasury ? true : false },
      card_issuing: { requested: true },
    },
  });

  // Create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      accountId: account.id,
      useCase,
      country,
    },
  });

  if (useTreasury) {
    // If this is an Embedded Finance user, create a Treasury Financial Account,
    // in which the user will store their funds
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
  }

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
