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

    // Get credit statements from the credit_statements API
    const statementsResponse = await fetch(
      `https://api.stripe.com/v1/issuing/credit_statements`,
      {
        method: "GET",
        headers: {
          "Stripe-Account": accountId,
          Authorization: `Bearer ${getStripeSecretKey(platform)}`,
          "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
        }
      }
    );

    if (!statementsResponse.ok) {
      const errorText = await statementsResponse.text();
      console.error("Credit statements API error:", {
        status: statementsResponse.status,
        statusText: statementsResponse.statusText,
        error: errorText
      });

      // Log the failed API request
      await logApiRequest(
        session.email,
        "https://api.stripe.com/v1/issuing/credit_statements",
        "GET",
        null,
        { error: errorText, status: statementsResponse.status }
      );

      // If credit statements are not available, return empty array
      if (statementsResponse.status === 404 || statementsResponse.status === 403) {
        console.log("Credit statements not available, returning empty array");
        return res.status(200).json({ statements: [] });
      }

      throw new Error(`Failed to fetch credit statements: ${statementsResponse.status} ${statementsResponse.statusText}`);
    }

    const statementsData = await statementsResponse.json();

    // Log the successful API request
    await logApiRequest(
      session.email,
      "https://api.stripe.com/v1/issuing/credit_statements",
      "GET",
      null,
      statementsData
    );

    // Handle case where no statements are returned
    if (!statementsData.data || !Array.isArray(statementsData.data)) {
      console.log("No statements data found, returning empty array");
      return res.status(200).json({ statements: [] });
    }

    // Sort statements by credit_period_ends_at in descending order (most recent first)
    // and limit to 3 most recent, handling null values
    const sortedStatements = statementsData.data
      .sort((a: any, b: any) => {
        // Put statements with null dates at the end
        if (a.credit_period_ends_at === null && b.credit_period_ends_at === null) return 0;
        if (a.credit_period_ends_at === null) return 1;
        if (b.credit_period_ends_at === null) return -1;
        return b.credit_period_ends_at - a.credit_period_ends_at;
      })
      .slice(0, 3);

    // Map statements to include the statement_url directly
    const statementsWithUrls = sortedStatements.map((statement: any) => ({
      ...statement,
      url: statement.statement_url || null
    }));

    res.status(200).json({ statements: statementsWithUrls });
  } catch (error) {
    console.error("Error fetching credit statements:", error);
    res.status(500).json({ message: "Error fetching credit statements" });
  }
}
