import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createCard,
  });

const createCard = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: accountId,
  });

  const financialAccount = financialAccounts.data[0];
  const { cardholderid, card_type } = req.body;
  const cardholder = await stripe.issuing.cardholders.retrieve(cardholderid, {
    stripeAccount: accountId,
  });

  const validationSchema = Yup.object().shape({
    line1: Yup.string().required("Cardholder billing address is required"),
    city: Yup.string().required("Cardholder billing address city is required"),
    state: Yup.string().required(
      "Cardholder billing address state is required",
    ),
    postal_code: Yup.string().required(
      "Cardholder billing address postal code is required",
    ),
    country: Yup.string().required(
      "Cardholder billing address country is required",
    ),
  });

  try {
    const billingAddress = cardholder.billing.address;
    await validationSchema.validate(
      { ...billingAddress },
      { abortEarly: false },
    );
  } catch (error) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: (error as Error).message },
      }),
    );
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
      { stripeAccount: accountId },
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
      { stripeAccount: accountId },
    );
  }

  res.redirect("/cards");
};

export default handler;
