import { NextApiRequest, NextApiResponse } from "next";

import { getSessionForServerSide } from "src/utils/session-helpers";
import stripe from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const session = await getSessionForServerSide(req, res);
    const StripeAccountId = session.accountId;

    const balance = await stripe.balance.retrieve({
      stripeAccount: StripeAccountId,
    });

    await stripe.payouts.create(
      {
        amount: balance.available[0].amount,
        currency: "usd",
      },
      { stripeAccount: StripeAccountId },
    );

    return res.json({ success: true });
  } catch (err) {
    return res
      .status(401)
      .json({ urlCreated: false, error: (err as Error).message });
  }
};

export default handler;
