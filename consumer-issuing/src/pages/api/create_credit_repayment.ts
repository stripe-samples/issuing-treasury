import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import { getStripeSecretKey } from "src/utils/stripe-authentication";
import stripeClient from "src/utils/stripe-loader";
import { v4 as uuidv4 } from 'uuid';

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createCreditRepayment,
  });

const createCreditRepayment = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  try {
    const { amount, currency = "usd", payment_type = "user_instructed", payment_method_id, customer_id } = req.body;

    let requestBody: URLSearchParams;

    if (payment_type === "api_instructed") {
      // Validate required parameters for API-instructed payments
      if (!payment_method_id || !customer_id) {
        throw new Error("payment_method_id and customer_id are required for API-instructed payments");
      }

      requestBody = new URLSearchParams({
        account: accountId,
        customer: customer_id,
        "instructed_by[type]": "credit_repayments_api",
        "instructed_by[credit_repayments_api][payment_method]": payment_method_id,
        "amount[value]": amount.toString(),
        "amount[currency]": currency,
        credit_statement_descriptor: "API Payment received",
      });
    } else {
      // User-instructed payment (existing functionality)
      requestBody = new URLSearchParams({
        account: accountId,
        "instructed_by[type]": "user",
        "instructed_by[user][payment_method_type]": "paper_check",
        "instructed_by[user][payment_reference]": uuidv4(),
        "amount[value]": amount.toString(),
        "amount[currency]": currency,
        credit_statement_descriptor: "User Payment received",
      });
    }

    // Make a direct API call to the credit repayments endpoint
    const response = await fetch("https://api.stripe.com/v1/issuing/credit_repayments", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getStripeSecretKey(platform)}`,
        "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
      },
      body: requestBody,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to create credit repayment");
    }

    return res.status(200).json(apiResponse({ success: true, data }));
  } catch (error) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error occurred",
        },
      }),
    );
  }
};

export default handler;
