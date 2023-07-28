import { NextApiResponse } from "next";

import withAuth from "../../middleware/api/auth-middleware";
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

    const balance = await stripe.balance.retrieve({
      stripeAccount: StripeAccountId,
    });

    const payout = await stripe.payouts.create(
      {
        amount: balance.available[0].amount,
        currency: "usd",
      },
      { stripeAccount: StripeAccountId },
    );

    return res.json({ success: true });
  } catch (err) {
    return res.status(401).json({
      urlCreated: false,
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      error: err.message,
    });
  }
};

export default withAuth(handler);
