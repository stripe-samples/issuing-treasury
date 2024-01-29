import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import StripeAccount from "src/utils/stripe-account";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: addExternalAccount,
  });

const addExternalFinancialAccount = async (
  stripeAccount: StripeAccount,
  country: string,
  currency: string,
) => {
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  const financialAccounts = await stripe.treasury.financialAccounts.list(
    { expand: ["data.financial_addresses.aba.account_number"] },
    { stripeAccount: accountId },
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

const addExternalAccount = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { country, currency, stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  const token = await addExternalFinancialAccount(
    stripeAccount,
    country,
    currency,
  );

  await stripe.accounts.createExternalAccount(accountId, {
    external_account: token.id,
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
