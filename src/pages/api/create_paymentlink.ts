import { NextApiResponse } from "next";

import withAuth from "../../middleware/api/auth-middleware";
import NextApiRequestWithSession from "../../types/next-api-request-with-session";
import stripe from "../../utils/stripe-loader";

const handler = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const { session } = req;
    const StripeAccountId = session.accountId;

    const prices = await stripe.prices.list(
      {
        limit: 1,
        active: true,
        type: "one_time",
      },
      {
        stripeAccount: StripeAccountId,
      },
    );

    let price;

    if (prices.data.length < 1) {
      price = await stripe.prices.create(
        {
          unit_amount: 1000,
          currency: "usd",
          product_data: {
            name: "Unit",
          },
        },
        {
          stripeAccount: StripeAccountId,
        },
      );
    } else {
      price = prices.data[0];
    }

    const paymentLink = await stripe.paymentLinks.create(
      {
        line_items: [
          {
            price: price.id,
            quantity: 1,
            adjustable_quantity: { enabled: true },
          },
        ],
      },
      {
        stripeAccount: StripeAccountId,
      },
    );
    return res.json({ urlCreated: true, paymentLink: paymentLink.url });
  } catch (err) {
    return res
      .status(401)
      .json({ urlCreated: false, error: (err as Error).message });
  }
};

export default withAuth(handler);
