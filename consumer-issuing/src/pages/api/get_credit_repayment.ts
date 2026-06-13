import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getStripeSecretKey } from "src/utils/stripe-authentication";
import { authOptions } from "src/pages/api/auth/[...nextauth]";

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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Credit repayment ID is required" });
    }

    const response = await fetch(
      `https://api.stripe.com/v1/issuing/credit_repayments/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getStripeSecretKey(platform)}`,
          "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch credit repayment details");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching credit repayment details:", error);
    res.status(500).json({ message: "Error fetching credit repayment details" });
  }
} 