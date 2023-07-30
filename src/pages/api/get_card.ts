import { NextApiResponse } from "next";

import withAuth from "src/middleware/api/auth-middleware";
import NextApiRequestWithSession from "src/types/next-api-request-with-session";
import stripe from "src/utils/stripe-loader";

const handler = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  const accountId = req.body.accountId;
  const cardId = req.body.cardId;
  const nonce = req.body.nonce;
  const apiVersion = "2022-08-01";

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
    res.status(200).send(ephemeralKey);
  } else {
    res.status(500).json({ statusCode: 500, message: "Error" });
  }
};

export default withAuth(handler);
