import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";
import { getFinancialAccountDetails } from "src/utils/stripe_helpers";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: simulateAuthorization,
  });

const simulateAuthorization = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  const responseFaDetails = await getFinancialAccountDetails(stripeAccount);
  const financialAccount = responseFaDetails.financialaccount;
  const balance = financialAccount.balance.cash.usd;

  if (balance < 1000) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: {
          message: "Insufficient funds to create a test purchase.",
        },
      }),
    );
  }

  const authorization = await stripe.testHelpers.issuing.authorizations.create(
    {
      amount: 1000,
      currency: "usd",
      card: req.body.cardId,
    },
    { stripeAccount: accountId },
  );

  await stripe.testHelpers.issuing.authorizations.capture(authorization.id, {
    stripeAccount: accountId,
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
