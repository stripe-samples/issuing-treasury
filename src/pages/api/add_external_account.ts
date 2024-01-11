import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import UseCase from "src/types/use_cases";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const TEST_GB_ACCOUNT_NUMBER = "00012345";
const TEST_GB_SORT_CODE = "108800";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: addExternalAccount,
  });

const addExternalFinancialAccount = async (
  StripeAccountId: string,
  country: string,
  currency: string,
) => {
  const stripe = stripeClient();

  const financialAccounts = await stripe.treasury.financialAccounts.list(
    { expand: ["data.financial_addresses.aba.account_number"] },
    {
      stripeAccount: StripeAccountId,
    },
  );

  const financialAccount = financialAccounts.data[0];
  const aba = financialAccount.financial_addresses[0]?.aba;

  if (
    aba == undefined ||
    aba.account_number == undefined ||
    aba.routing_number == undefined
  ) {
    throw new Error("Invalid or missing ABA for financial account");
  }

  const token = await stripe.tokens.create(
    {
      bank_account: {
        account_number: aba.account_number,
        routing_number: aba.routing_number,
        country: country,
        currency: currency,
      },
    },
    undefined,
  );

  return token;
};

const addExternalBankAccount = async (
  StripeAccountId: string,
  currency: string,
) => {
  const stripe = stripeClient();
  const token = await stripe.tokens.create(
    {
      bank_account: {
        account_number: TEST_GB_ACCOUNT_NUMBER,
        routing_number: TEST_GB_SORT_CODE,
        country: "GB",
        currency: currency,
      },
    },
    undefined,
  );

  return token;
};

const addExternalAccount = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { accountId: StripeAccountId, country, currency, useCase } = session;
  const stripe = stripeClient();

  let token;
  if (useCase == UseCase.EmbeddedFinance) {
    token = await addExternalFinancialAccount(
      StripeAccountId,
      country,
      currency,
    );
  } else {
    token = await addExternalBankAccount(StripeAccountId, currency);
  }

  await stripe.accounts.createExternalAccount(StripeAccountId, {
    external_account: token.id,
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
