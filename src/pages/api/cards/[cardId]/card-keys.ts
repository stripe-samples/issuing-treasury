import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { apiResponse } from "src/types/api-response";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const validationSchema = Yup.object().shape({
  cardId: Yup.string().required("Card ID is required"),
  nonce: Yup.string().required("nonce is required"),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST":
        return await createCardKey(req, res);
      default:
        return res.status(400).json({ error: "Bad Request" });
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

const createCardKey = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const accountId = session.accountId;

  const cardId = req.query.cardId?.toString() || "";
  const nonce = req.body.nonce;

  try {
    await validationSchema.validate({ cardId, nonce }, { abortEarly: false });
  } catch (error) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: (error as Error).message },
      }),
    );
  }

  const apiVersion = "2022-08-01";
  const stripe = stripeClient();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {
      // @ts-expect-error Fix the defect upstream in Issuing Elements causing `nonce` to not be accepted
      nonce: nonce,
      issuing_card: cardId,
    },
    {
      stripeAccount: accountId,
      apiVersion: apiVersion,
    },
  );

  res.status(200).json(apiResponse({ success: true, data: ephemeralKey }));
};

export default handler;
