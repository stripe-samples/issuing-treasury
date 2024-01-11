import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createPayout,
  });

const createPayout = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { currency, stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  const balance = await stripe.balance.retrieve({
    stripeAccount: accountId,
  });
  const availableBalance = balance.available[0].amount;

  const validationSchema = Yup.object({
    availableBalance: Yup.number()
      .required("Available balance is required")
      .moreThan(
        0,
        "Available balance must be greater than $0.00 in order to do a payout",
      ),
  });

  try {
    await validationSchema.validate(
      {
        availableBalance,
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

  await stripe.payouts.create(
    {
      amount: availableBalance,
      currency: currency,
    },
    { stripeAccount: accountId },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
