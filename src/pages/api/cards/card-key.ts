import { NextApiRequest, NextApiResponse } from "next";

import { getSessionForServerSide } from "src/utils/session-helpers";
import stripe from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  const session = await getSessionForServerSide(req, res);

  const accountId = session.accountId;
  const cardId = req.body.cardId;
  const nonce = req.body.nonce;
  const apiVersion = "2022-08-01";

  try {
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {
        // @ts-expect-error Investigate why nonce is not part of this API anymore once the card details page is revamped
        nonce: nonce,
        issuing_card: cardId,
      },
      {
        stripeAccount: accountId,
        apiVersion: apiVersion,
      },
    );

    // Check if we have a result
    if (ephemeralKey) {
      res.status(200).send({ ephemeralKey });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export default handler;
