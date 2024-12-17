import { getUnixTime } from "date-fns/getUnixTime";
import { parsePhoneNumber } from "libphonenumber-js";
import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";
import validationSchemas from "src/utils/validation-schemas";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createCardholder,
    PUT: updateCardholder,
  });

const createCardholder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;

  const validationSchema = (() => {
    // PSD2 requires most transactions on payment cards issued in the EU and UK
    // to be authenticated in order to proceed. This is called Strong Customer
    // Authentication[0], or SCA. Stripe typically uses 3D Secure[1] to authenticate
    // transactions, which requires a phone number to send an OTP to via SMS.
    // So phone numbers must be mandatorily collected for cardholders of cards
    // issued by EU or UK Stripe Issuing users.
    //
    // [0] https://stripe.com/docs/strong-customer-authentication
    // [1] https://stripe.com/docs/issuing/3d-secure
    return validationSchemas.cardholder.withSCA;
  })();

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

  const parsedPhoneNumber = parsePhoneNumber(phoneNumber, country);
  const formattedPhoneNumber = parsedPhoneNumber.formatInternational();

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
            date: getUnixTime(new Date()),
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
            date: getUnixTime(new Date()),
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
