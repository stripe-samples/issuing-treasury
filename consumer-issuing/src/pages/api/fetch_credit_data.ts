import { NextApiRequest, NextApiResponse } from "next";
import { getSessionForServerSide } from "src/utils/session-helpers";
import { getStripeSecretKey } from "src/utils/stripe-authentication";
import { logApiRequest } from "src/utils/api-logger";
import { apiResponse } from "src/types/api-response";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getSessionForServerSide(req, res);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email, stripeAccount } = session;
    const { accountId, platform } = stripeAccount;

    // Fetch credit policy
    const creditPolicyResponse = await fetch(
      "https://api.stripe.com/v1/issuing/credit_policy",
      {
        method: "GET",
        headers: {
          "Stripe-Account": accountId,
          Authorization: `Bearer ${getStripeSecretKey(platform)}`,
          "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1",
        },
      }
    );

    const creditPolicyData = await creditPolicyResponse.json();

    // Log credit policy request
    await logApiRequest(
      email,
      "https://api.stripe.com/v1/issuing/credit_policy",
      "GET",
      null,
      creditPolicyData
    );

    // Fetch credit underwriting records
    const underwritingResponse = await fetch(
      "https://api.stripe.com/v1/issuing/credit_underwriting_records",
      {
        method: "GET",
        headers: {
          "Stripe-Account": accountId,
          Authorization: `Bearer ${getStripeSecretKey(platform)}`,
          "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1",
        },
      }
    );

    const underwritingData = await underwritingResponse.json();

    // Log underwriting records request
    await logApiRequest(
      email,
      "https://api.stripe.com/v1/issuing/credit_underwriting_records",
      "GET",
      null,
      underwritingData
    );

    return res.status(200).json(
      apiResponse({
        success: true,
        data: {
          creditPolicy: creditPolicyData,
          underwritingRecords: underwritingData,
        },
      })
    );
  } catch (error) {
    console.error("Error fetching credit data:", error);
    return res.status(500).json(
      apiResponse({
        success: false,
        error: { message: (error as Error).message },
      })
    );
  }
};

export default handler; 