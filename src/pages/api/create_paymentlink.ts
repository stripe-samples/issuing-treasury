import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createPaymentLink,
  });

const createPaymentLink = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount, currency } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  const prices = await stripe.prices.list(
    {
      limit: 1,
      active: true,
      type: "one_time",
    },
    {
      stripeAccount: accountId,
    },
  );

  const price =
    prices.data.length < 1
      ? await stripe.prices.create(
          {
            unit_amount: 1000,
            currency: currency,
            product_data: {
              name: "Some Product",
            },
          },
          {
            stripeAccount: accountId,
          },
        )
      : prices.data[0];

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
      stripeAccount: accountId,
    },
  );

  return res
    .status(200)
    .json(
      apiResponse({ success: true, data: { paymentLink: paymentLink.url } }),
    );
};

export default handler;
