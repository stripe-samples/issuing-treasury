import { NextApiResponse } from "next";

import withAuth from "src/middleware/api/auth-middleware";
import NextApiRequestWithSession from "src/types/next-api-request-with-session";
import stripe from "src/utils/stripe-loader";

const handler = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const { session } = req;
    const StripeAccountId = session.accountId;

    const financialAccounts = await stripe.treasury.financialAccounts.list({
      stripeAccount: StripeAccountId,
    });

    const financialAccount = financialAccounts.data[0];
    const { cardholderid, card_type } = req.body;
    const cardholder = await stripe.issuing.cardholders.retrieve(cardholderid, {
      stripeAccount: StripeAccountId,
    });

    if (card_type == "physical") {
      const card = await stripe.issuing.cards.create(
        {
          cardholder: cardholderid,
          financial_account: financialAccount.id,
          currency: "usd",
          shipping: {
            name: cardholder.name,
            service: "standard",
            type: "individual",
            // @ts-expect-error Remove after deployment succeeds
            address: cardholder.billing.address,
          },
          type: "physical",
          status: "inactive",
        },
        { stripeAccount: StripeAccountId },
      );
    } else {
      const card = await stripe.issuing.cards.create(
        {
          cardholder: cardholderid,
          financial_account: financialAccount.id,
          currency: "usd",
          type: "virtual",
          status: "active",
        },
        { stripeAccount: StripeAccountId },
      );
    }
    res.redirect("/cards");
  } catch (err) {
    return res.status(401).json({ error: (err as Error).message });
  }
};

export default withAuth(handler);
