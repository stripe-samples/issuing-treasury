import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripe from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST":
        return await createCardholder(req, res);
      case "PUT":
        return await updateCardholder(req, res);
      default:
        return res.status(400).json({ error: "Bad Request" });
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

const createCardholder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;

  const ip =
    req.headers["x-real-ip"]?.toString() || req.connection.remoteAddress;
  await stripe.issuing.cardholders.create(
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

  return res.json(apiResponse({ success: true }));
};

const updateCardholder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;

  const ip =
    req.headers["x-real-ip"]?.toString() || req.connection.remoteAddress;
  await stripe.issuing.cardholders.update(
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

  return res.json(apiResponse({ success: true }));
};

export default handler;
