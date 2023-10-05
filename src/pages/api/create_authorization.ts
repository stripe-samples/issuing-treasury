import { NextApiRequest, NextApiResponse } from "next";

import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: simulateAuthorization,
  });

const simulateAuthorization = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;
  const stripe = stripeClient();

  const authorization = await stripe.testHelpers.issuing.authorizations.create(
    {
      amount: 1000,
      currency: "usd",
      card: req.body.cardId,
    },
    { stripeAccount: StripeAccountId },
  );

  await stripe.testHelpers.issuing.authorizations.capture(authorization.id, {
    stripeAccount: StripeAccountId,
  });

  return res.status(200).json({ success: true });
};

export default handler;
