import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";
import {
  getBalance,
  getFinancialAccountDetails,
} from "src/utils/stripe_helpers";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: simulateAuthorization,
  });

const simulateAuthorization = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { accountId: StripeAccountId, currency, useCase } = session;
  const stripe = stripeClient();

  let balance;
  if (useCase == "embedded_finance") {
    const responseFaDetails = await getFinancialAccountDetails(StripeAccountId);
    const financialAccount = responseFaDetails.financialaccount;
    balance = financialAccount.balance.cash.usd;
  } else {
    const responseBalance = await getBalance(StripeAccountId);
    balance = responseBalance.balance.issuing?.available[0].amount || 0;
  }

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
      currency: currency,
      card: req.body.cardId,
    },
    { stripeAccount: StripeAccountId },
  );

  await stripe.testHelpers.issuing.authorizations.capture(authorization.id, {
    stripeAccount: StripeAccountId,
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
