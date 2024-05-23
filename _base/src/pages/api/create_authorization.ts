import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import FinancialProduct from "src/types/financial-product";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import {
  getBalance,
  // @if financialProduct==embedded-finance
  getFinancialAccountDetails,
  // @endif
} from "src/utils/stripe-helpers";
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
  const {
    stripeAccount,
    currency,
    // @begin-exclude-from-subapps
    financialProduct,
    // @end-exclude-from-subapps
  } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  // A user must have sufficient funds in order to authorize a transaction
  // on an Issuing card. For Embedded Finance users, these funds will be
  // stored in a Treasury Financial Account, whereas other users who do not
  // use Treasury will maintain an Issuing Balance. Here, we determine where
  // to check for funds, which should illustrate where money comes from to
  // fund Issuing transactions.
  const balance = await (async () => {
    // @begin-exclude-from-subapps
    if (financialProduct == FinancialProduct.EmbeddedFinance) {
      // @end-exclude-from-subapps
      // @if financialProduct==embedded-finance
      const responseFaDetails = await getFinancialAccountDetails(stripeAccount);
      const financialAccount = responseFaDetails.financialaccount;
      return financialAccount.balance.cash.usd;
      // @endif
      // @begin-exclude-from-subapps
    } else {
      // @end-exclude-from-subapps
      // @if financialProduct==expense-management
      const responseBalance = await getBalance(stripeAccount);
      return responseBalance.balance.issuing?.available[0].amount || 0;
      // @endif
      // @begin-exclude-from-subapps
    }
    // @end-exclude-from-subapps
  })();

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
    { stripeAccount: accountId },
  );

  await stripe.testHelpers.issuing.authorizations.capture(authorization.id, {
    stripeAccount: accountId,
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
