import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getStripeSecretKey } from "src/utils/stripe-authentication";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { logApiRequest } from "src/utils/api-logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { stripeAccount } = session;
    const { accountId, platform } = stripeAccount;

    // Get the current credit statement from the credit_statements API
    const statementResponse = await fetch(
      `https://api.stripe.com/v1/issuing/credit_statements/current`,
      {
        method: "GET",
        headers: {
          "Stripe-Account": accountId,
          Authorization: `Bearer ${getStripeSecretKey(platform)}`,
          "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
        }
      }
    );

    const statementData = await statementResponse.json();

    // Log the API request
    await logApiRequest(
      session.email,
      "https://api.stripe.com/v1/issuing/credit_statements/current",
      "GET",
      null,
      statementData
    );

    if (!statementResponse.ok) {
      return res.status(statementResponse.status).json({
        message: statementData.error?.message || "Failed to fetch current credit statement"
      });
    }

    res.status(200).json({ statement: statementData });
  } catch (error) {
    console.error("Error fetching current credit statement:", error);
    res.status(500).json({ message: "Error fetching current credit statement" });
  }
} 