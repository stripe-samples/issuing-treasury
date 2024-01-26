import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    PATCH: switchCardStatus,
  });

const switchCardStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;

  const cardId = req.query.cardId?.toString() || "";
  const { newStatus } = req.body;

  const validationSchema = Yup.object().shape({
    newStatus: Yup.string()
      .oneOf(["active", "inactive"])
      .required("New status to switch to is required"),
  });

  try {
    await validationSchema.validate({ newStatus }, { abortEarly: false });
  } catch (error) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: (error as Error).message },
      }),
    );
  }

  const stripe = stripeClient(platform);
  await stripe.issuing.cards.update(
    cardId,
    { status: newStatus },
    { stripeAccount: accountId },
  );

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
