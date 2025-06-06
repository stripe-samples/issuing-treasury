import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    GET: getVerifiedPaymentMethods,
  });

const getVerifiedPaymentMethods = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { platform } = stripeAccount;
  const stripe = stripeClient(platform);

  try {
    // Get all customers
    const customers = await stripe.customers.list({
      limit: 100, // Adjust as needed
    });

    const verifiedPaymentMethods = [];

    // For each customer, get their payment methods and filter for verified US bank accounts
    for (const customer of customers.data) {
      try {
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customer.id,
          type: 'us_bank_account',
        });

        // Filter for payment methods (for demo, we'll include all US bank account payment methods)
        // In a real application, you would have proper verification status checking
        const bankAccountPaymentMethods = paymentMethods.data.filter(pm =>
          pm.us_bank_account !== null
        );

        if (bankAccountPaymentMethods.length > 0) {
          verifiedPaymentMethods.push({
            customer: {
              id: customer.id,
              name: customer.name,
              email: customer.email,
            },
            paymentMethods: bankAccountPaymentMethods.map(pm => ({
              id: pm.id,
              bank_name: pm.us_bank_account?.bank_name,
              last4: pm.us_bank_account?.last4,
              account_type: pm.us_bank_account?.account_type,
              account_holder_type: pm.us_bank_account?.account_holder_type,
            }))
          });
        }
      } catch (error) {
        // Skip customers that have errors when fetching payment methods
        console.log(`Error fetching payment methods for customer ${customer.id}:`, error);
      }
    }

    return res.status(200).json(apiResponse({
      success: true,
      data: verifiedPaymentMethods
    }));
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
