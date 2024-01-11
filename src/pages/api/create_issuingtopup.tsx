import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import { getStripeSecretKey } from "src/utils/stripe-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: simulateIssuingBalanceFunding,
  });

const simulateIssuingBalanceFunding = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { currency, stripeAccount } = session;
  const { accountId, platform } = stripeAccount;

  const data = {
    amount: "50000",
    currency: currency as string,
  };

  //test_helpers topup issuing balance - not supported in the Node.js libary
  await fetch("https://api.stripe.com/v1/test_helpers/issuing/fund_balance", {
    method: "POST",
    headers: {
      "Stripe-Account": accountId,
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + getStripeSecretKey(platform),
    },
    body: new URLSearchParams(data),
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
