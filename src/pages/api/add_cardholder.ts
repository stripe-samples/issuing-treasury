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

    const ip =
      req.headers["x-real-ip"]?.toString() || req.connection.remoteAddress;
    const cardholder = await stripe.issuing.cardholders.create(
      {
        type: "individual",
        name: req.body.firstName + " " + req.body.lastName,
        email: req.body.email,
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
        billing: {
          address: {
            city: req.body.city,
            line1: req.body.address1,
            state: req.body.state,
            postal_code: req.body.postalCode,
            country: req.body.country,
          },
        },
      },
      {
        stripeAccount: StripeAccountId,
      },
    );
    return res.json({ ok: true });
  } catch (err) {
    return res.status(401).json({ error: (err as Error).message });
  }
};

export default withAuth(handler);
