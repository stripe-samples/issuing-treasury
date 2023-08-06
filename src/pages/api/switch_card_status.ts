import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { getSessionForServerSide } from "src/utils/session-helpers";
import stripe from "src/utils/stripe-loader";

const validationSchema = Yup.object().shape({
  cardId: Yup.string().required("Card ID is required"),
  newStatus: Yup.string()
    .oneOf(["active", "inactive"])
    .required("New status to switch to is required"),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;

  const { cardId, newStatus } = req.body;
  try {
    await validationSchema.validate(
      { cardId, newStatus },
      { abortEarly: false },
    );
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }

  try {
    const result = await stripe.issuing.cards.update(
      cardId,
      { status: newStatus },
      { stripeAccount: StripeAccountId },
    );

    if (result.lastResponse.statusCode === 200) {
      return res.status(200).json({
        success: true,
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export default handler;
