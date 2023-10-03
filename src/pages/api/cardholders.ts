import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createCardholder,
    PUT: updateCardholder,
  });

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  address1: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State / Province is required"),
  postalCode: Yup.string().required("ZIP / Postal code is required"),
  country: Yup.string().required("Country is required"),
  accept: Yup.boolean()
    .required("The terms of service and privacy policy must be accepted.")
    .oneOf([true], "The terms of service and privacy policy must be accepted."),
});

const createCardholder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;

  const {
    firstName,
    lastName,
    email,
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

  const ip =
    req.headers["x-real-ip"]?.toString() || req.connection.remoteAddress;
  const stripe = stripeClient();
  await stripe.issuing.cardholders.create(
    {
      type: "individual",
      name: firstName + " " + lastName,
      email: email,
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
      stripeAccount: StripeAccountId,
    },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

const updateCardholder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;

  const ip =
    req.headers["x-real-ip"]?.toString() || req.connection.remoteAddress;
  const stripe = stripeClient();
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
      stripeAccount: StripeAccountId,
    },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
