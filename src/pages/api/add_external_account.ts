import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import UseCase from "src/types/use_cases";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import StripeAccount from "src/utils/stripe-account";
import stripeClient from "src/utils/stripe-loader";

const TEST_GB_ACCOUNT_NUMBER = "00012345";
const TEST_GB_SORT_CODE = "108800";

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

const addExternalBankAccount = async (
  stripeAccount: StripeAccount,
  currency: string,
) => {
  const { platform } = stripeAccount;
  const stripe = stripeClient(platform);
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
  const { country, currency, useCase, stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  let token;
  // If the user has a Treasury Financial Account (as is enabled for embedded
  // finance platforms), then use that as a payout[0] destination. Otherwise,
  // add a (fake) external bank account, which in a real livemode deployment
  // would be provided by the user. When the user requests a payout from their
  // balance, the funds will be sent to whatever account is set here.
  //
  // [0] https://stripe.com/docs/payouts
  if (useCase == UseCase.EmbeddedFinance) {
    token = await addExternalFinancialAccount(stripeAccount, country, currency);
  } else {
    token = await addExternalBankAccount(stripeAccount, currency);
  }

  await stripe.accounts.createExternalAccount(accountId, {
    external_account: token.id,
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
