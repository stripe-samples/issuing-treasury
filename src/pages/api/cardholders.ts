import { parsePhoneNumber } from "libphonenumber-js";
import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";
import validationSchemas from "src/utils/validation_schemas";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createCardholder,
    PUT: updateCardholder,
  });

const createCardholder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { country: userCountry, stripeAccount } = session;
  const { accountId, platform } = stripeAccount;

  let validationSchema;
  if (userCountry == "US") {
    validationSchema = validationSchemas.cardholder.default;
  } else {
    validationSchema = validationSchemas.cardholder.withSCA;
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address1,
    city,
    state,
    postalCode,
    country,
    accept,
  } = req.body;

  try {
    await validationSchema.validate(
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        address1,
        city,
        state,
        postalCode,
        country,
        accept,
      },
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

  let formattedPhoneNumber = phoneNumber;
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber, country);
  if (parsedPhoneNumber) {
    // remove any extension faker may have generated
    parsedPhoneNumber.setExt("");
    formattedPhoneNumber = parsedPhoneNumber.formatInternational();
  }

  const ip =
    req.headers["x-real-ip"]?.toString() || req.connection.remoteAddress;
  const stripe = stripeClient(platform);
  await stripe.issuing.cardholders.create(
    {
      type: "individual",
      name: firstName + " " + lastName,
      email: email,
      phone_number: formattedPhoneNumber.replaceAll(" ", ""),
      individual: {
        first_name: firstName,
        last_name: lastName,
        card_issuing: {
          user_terms_acceptance: {
            date: Date.now(),
            ip: ip,
          },
        },
      },
      billing: {
        address: {
          city: city,
          line1: address1,
          state: state,
          postal_code: postalCode,
          country: country,
        },
      },
    },
    {
      stripeAccount: accountId,
    },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

const updateCardholder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;

  const ip =
    req.headers["x-real-ip"]?.toString() || req.connection.remoteAddress;
  const stripe = stripeClient(platform);
  await stripe.issuing.cardholders.update(
    req.body.cardholderId,
    {
      individual: {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        card_issuing: {
          user_terms_acceptance: {
            date: Date.now(),
            ip: ip,
          },
        },
      },
    },
    {
      stripeAccount: accountId,
    },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
