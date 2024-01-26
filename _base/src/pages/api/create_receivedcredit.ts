import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: simulateReceivedCredit,
  });

const simulateReceivedCredit = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  // Get financial accounts for the Connected Account
  const financialAccounts = await stripe.treasury.financialAccounts.list(
    { expand: ["data.financial_addresses.aba.account_number"] },
    { stripeAccount: accountId },
  );
  const financialAccount = financialAccounts.data[0];

  await stripe.testHelpers.treasury.receivedCredits.create(
    {
      amount: 50000,
      currency: "usd",
      financial_account: financialAccount.id,
      network: "ach",
    },
    { stripeAccount: accountId },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
