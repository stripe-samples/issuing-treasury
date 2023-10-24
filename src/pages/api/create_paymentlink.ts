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
  const StripeAccountId = session.accountId;
  const stripe = stripeClient();

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

  const price =
    prices.data.length < 1
      ? await stripe.prices.create(
          {
            unit_amount: 1000,
            currency: process.env.NEXT_PUBLIC_CURRENCY as string,
            product_data: {
              name: "Some Product",
            },
           
          },
          {
            stripeAccount: StripeAccountId,
          },
        )
      : prices.data[0];


  const paymentLinks = await stripe.paymentLinks.list(
    { limit: 1 }, 
    { stripeAccount: StripeAccountId }
  );
  
  const paymentLink = 
    paymentLinks.data.length < 1
      ? await stripe.paymentLinks.create(
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
      )
    : paymentLinks.data[0];

  return res
    .status(200)
    .json(
      apiResponse({ success: true, data: { paymentLink: paymentLink.url } }),
    );
};

export default handler;
