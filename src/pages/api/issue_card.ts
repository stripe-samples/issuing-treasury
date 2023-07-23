import { parse } from "cookie";

import { decode } from "../../utils/jwt_encode_decode";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { app_auth } = parse(req.headers.cookie || "");
    const session = decode(app_auth);

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
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
}
