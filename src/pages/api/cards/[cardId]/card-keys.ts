import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createCardKey,
  });

const createCardKey = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;

  const cardId = req.query.cardId?.toString() || "";
  const nonce = req.body.nonce;

  const validationSchema = Yup.object().shape({
    nonce: Yup.string().required("nonce is required"),
  });

  try {
    await validationSchema.validate({ nonce }, { abortEarly: false });
  } catch (error) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: (error as Error).message },
      }),
    );
  }

  const apiVersion = "2022-08-01";
  const stripe = stripeClient(platform);
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {
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
