import { NextApiResponse } from "next";

import withAuth from "../../middleware/auth-middleware";
import NextApiRequestWithSession from "../../types/next-api-request-with-session";
import stripe from "../../utils/stripe-loader";

const handler = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const { session } = req;
    const StripeAccountId = session.accountId;

    // Get financial accounts for the Connected Account
    const financialAccounts = await stripe.treasury.financialAccounts.list(
      { expand: ["data.financial_addresses.aba.account_number"] },
      { stripeAccount: StripeAccountId },
    );
    const financialAccount = financialAccounts.data[0];

    const receivedCredit =
      await stripe.testHelpers.treasury.receivedCredits.create(
        {
          amount: 50000,
          currency: "usd",
          financial_account: financialAccount.id,
          network: "ach",
        },
        { stripeAccount: StripeAccountId },
      );
    return res.json({ receivedCredit: receivedCredit.id });
  } catch (err) {
    return res.status(401).json({
      urlCreated: false,
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      error: err.message,
    });
  }
};

export default withAuth(handler);
