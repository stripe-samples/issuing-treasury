import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { apiResponse } from "src/types/api-response";
import UseCase from "src/types/use_cases";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";
import validationSchemas from "src/utils/validation_schemas";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createCard,
  });

const createCard = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { useCase, currency, stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  let financialAccount = null;
  if (useCase == UseCase.EmbeddedFinance) {
    const financialAccounts = await stripe.treasury.financialAccounts.list({
      stripeAccount: accountId,
    });

    financialAccount = financialAccounts.data[0];
  }

  const { cardholderid, card_type } = req.body;
  const cardholder = await stripe.issuing.cardholders.retrieve(cardholderid, {
    stripeAccount: accountId,
  });

  try {
    const billingAddress = cardholder.billing.address;
    await validationSchemas.card.validate(
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

  let cardOptions: Partial<Stripe.Issuing.CardCreateParams> = {
    cardholder: cardholderid,
    currency: currency,
  };

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

    cardOptions = {
      ...cardOptions,
      shipping: {
        name: cardholder.name,
        service: "standard",
        type: "individual",
        address: shippingAddress,
      },
      type: "physical",
      status: "inactive",
    };

    if (financialAccount) {
      cardOptions = {
        ...cardOptions,
        financial_account: financialAccount.id,
      };
    }
  } else {
    cardOptions = {
      ...cardOptions,
      type: "virtual",
      status: "active",
    };

    if (financialAccount) {
      cardOptions = {
        ...cardOptions,
        financial_account: financialAccount.id,
      };
    }
  }

  await stripe.issuing.cards.create(
    cardOptions as Stripe.Issuing.CardCreateParams,
    {
      stripeAccount: accountId,
    },
  );

  res.redirect("/cards");
};

export default handler;
