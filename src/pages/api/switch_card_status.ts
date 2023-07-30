import { NextApiResponse } from "next";

import withAuth from "src/middleware/api/auth-middleware";
import NextApiRequestWithSession from "src/types/next-api-request-with-session";
import stripe from "src/utils/stripe-loader";

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

    const cardId = req.body.card_id;
    const { new_status } = req.body;
    const status = new_status == "active" ? "active" : "inactive";
    const result = await stripe.issuing.cards.update(
      cardId,
      { status: status },
      { stripeAccount: StripeAccountId },
    );
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: (err as Error).message });
  }
};

export default withAuth(handler);
