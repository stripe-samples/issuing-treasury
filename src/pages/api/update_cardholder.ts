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

    const ip =
      req.headers["x-real-ip"]?.toString() || req.connection.remoteAddress;
    const cardholder = await stripe.issuing.cardholders.update(
      req.body.cardholderId,
      {
        individual: {
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          card_issuing: {
            user_terms_acceptance: {
              date: Date.now(),
              ip: ip,
            },
          },
        },
      },
      {
        stripeAccount: StripeAccountId,
      },
    );
    return res.json({ ok: true });
  } catch (err) {
    return res.status(401).json({
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      error: err.message,
    });
  }
};

export default withAuth(handler);
