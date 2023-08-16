import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripe from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST":
        return await simulateReceivedCredit(req, res);
      default:
        return res
          .status(400)
          .json(
            apiResponse({ success: false, error: { message: "Bad Request" } }),
          );
    }
  } catch (error) {
    return res.status(500).json(
      apiResponse({
        success: false,
        error: {
          message: (error as Error).message,
          details: (error as Error).stack,
        },
      }),
    );
  }
};

const simulateReceivedCredit = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;

  // Get financial accounts for the Connected Account
  const financialAccounts = await stripe.treasury.financialAccounts.list(
    { expand: ["data.financial_addresses.aba.account_number"] },
    { stripeAccount: StripeAccountId },
  );
  const financialAccount = financialAccounts.data[0];

  await stripe.testHelpers.treasury.receivedCredits.create(
    {
      amount: 50000,
      currency: "usd",
      financial_account: financialAccount.id,
      network: "ach",
    },
    { stripeAccount: StripeAccountId },
  );

  return res.json(apiResponse({ success: true }));
};

export default handler;
