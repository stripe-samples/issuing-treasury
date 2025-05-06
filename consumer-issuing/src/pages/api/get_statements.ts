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

    // First, get all the files
    const filesResponse = await fetch(
      `https://api.stripe.com/v1/files?purpose=issuing_receipt&limit=100&created[gt]=1746551400`,
      {
        method: "GET",
        headers: {
          "Stripe-Account": accountId,
          Authorization: `Bearer ${getStripeSecretKey(platform)}`,
          "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
        }
      }
    );

    if (!filesResponse.ok) {
      throw new Error("Failed to fetch statements");
    }

    const filesData = await filesResponse.json();
    
    // Sort files by filename (which includes date) in ascending order
    const sortedFiles = filesData.data.sort((a: any, b: any) => 
      a.filename.localeCompare(b.filename)
    );

    // Create file links for each file
    const statementsWithLinks = await Promise.all(
      sortedFiles.map(async (file: any) => {
        const linkResponse = await fetch(
          "https://api.stripe.com/v1/file_links",
          {
            method: "POST",
            headers: {
              "Stripe-Account": accountId,
              Authorization: `Bearer ${getStripeSecretKey(platform)}`,
              "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              file: file.id
            })
          }
        );

        if (!linkResponse.ok) {
          console.error(`Failed to create link for file ${file.id}`);
          return {
            ...file,
            url: null
          };
        }

        const linkData = await linkResponse.json();
        return {
          ...file,
          url: linkData.url
        };
      })
    );

    res.status(200).json({ statements: statementsWithLinks });
  } catch (error) {
    console.error("Error fetching statements:", error);
    res.status(500).json({ message: "Error fetching statements" });
  }
} 