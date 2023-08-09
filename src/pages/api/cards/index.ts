import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { getSessionForServerSide } from "src/utils/session-helpers";
import stripe from "src/utils/stripe-loader";

const validationSchema = Yup.object().shape({
  line1: Yup.string().required("Cardholder billing address is required"),
  city: Yup.string().required("Cardholder billing address city is required"),
  state: Yup.string().required("Cardholder billing address state is required"),
  postal_code: Yup.string().required(
    "Cardholder billing address postal code is required",
  ),
  country: Yup.string().required(
    "Cardholder billing address country is required",
  ),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const session = await getSessionForServerSide(req, res);
    const StripeAccountId = session.accountId;

    const financialAccounts = await stripe.treasury.financialAccounts.list({
      stripeAccount: StripeAccountId,
    });

    const financialAccount = financialAccounts.data[0];
    const { cardholderid, card_type } = req.body;
    const cardholder = await stripe.issuing.cardholders.retrieve(cardholderid, {
      stripeAccount: StripeAccountId,
    });

    try {
      const billingAddress = cardholder.billing.address;
      await validationSchema.validate(
        { ...billingAddress },
        { abortEarly: false },
      );
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }

    if (card_type == "physical") {
      const shippingAddress = {
        line1: cardholder.billing.address.line1 || "",
        ...(cardholder.billing.address.line2 != null &&
          cardholder.billing.address.line2 !== "" && {
            line2: cardholder.billing.address.line2,
          }),
        city: cardholder.billing.address.city || "",
        state: cardholder.billing.address.state || "",
        postal_code: cardholder.billing.address.postal_code || "",
        country: cardholder.billing.address.country || "",
      };
      await stripe.issuing.cards.create(
        {
          cardholder: cardholderid,
          financial_account: financialAccount.id,
          currency: "usd",
          shipping: {
            name: cardholder.name,
            service: "standard",
            type: "individual",
            address: shippingAddress,
          },
          type: "physical",
          status: "inactive",
        },
        { stripeAccount: StripeAccountId },
      );
    } else {
      await stripe.issuing.cards.create(
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
    return res.status(500).json({ error: (err as Error).message });
  }
};

export default handler;
