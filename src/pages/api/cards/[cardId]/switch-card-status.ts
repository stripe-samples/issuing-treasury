import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { apiResponse } from "src/types/api-response";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const validationSchema = Yup.object().shape({
  cardId: Yup.string().required("Card ID is required"),
  newStatus: Yup.string()
    .oneOf(["active", "inactive"])
    .required("New status to switch to is required"),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "PUT":
        return await switchCardStatus(req, res);
      default:
        return res
          .status(400)
          .json(
            apiResponse({ success: false, error: { message: "Bad Request" } }),
          );
    }
  } catch (error) {
    return res.status(500).json(
      apiResponse({
        success: false,
        error: {
          message: (error as Error).message,
          details: (error as Error).stack,
        },
      }),
    );
  }
};

const switchCardStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;

  const cardId = req.query.cardId?.toString() || "";
  const { newStatus } = req.body;
  try {
    await validationSchema.validate(
      { cardId, newStatus },
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

  const stripe = stripeClient();
  await stripe.issuing.cards.update(
    cardId,
    { status: newStatus },
    { stripeAccount: StripeAccountId },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
