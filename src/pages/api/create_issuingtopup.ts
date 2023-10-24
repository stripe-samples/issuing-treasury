import { NextApiRequest, NextApiResponse } from "next";
// import fetch from "node-fetch";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: simulatIssuingBalanceFunding,
  });

const simulatIssuingBalanceFunding = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;
  // const stripe = stripeClient();

  //test_helpers topup issuing balance - not supported in the Node.js libary
  const data = {
    "amount": "50000", 
    "currency": process.env.NEXT_PUBLIC_CURRENCY as string,
  };

  await fetch('https://api.stripe.com/v1/test_helpers/issuing/fund_balance', {
      method: 'POST',
      headers: {
        'Stripe-Account': StripeAccountId,
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + process.env.STRIPE_SECRET_KEY,
      },
      body: new URLSearchParams(data),
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
