import { NextApiResponse } from "next";

import withAuth from "../../middleware/api/auth-middleware";
import NextApiRequestWithSession from "../../types/next-api-request-with-session";
import stripe from "../../utils/stripe-loader";

const handler = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const { session } = req;
    const StripeAccountId = session.accountId;

    const financialAccounts = await stripe.treasury.financialAccounts.list(
      { expand: ["data.financial_addresses.aba.account_number"] },
      {
        stripeAccount: StripeAccountId,
      },
    );

    const financialAccount = financialAccounts.data[0];

    await stripe.accounts.createExternalAccount(StripeAccountId, {
      // @ts-expect-error TS(2345): Argument of type '{ object: string; country: string; currency: string; account_number: any; routing_number: any; }' is not assignable to parameter of type 'BankAccountCreateParams'.
      external_account: {
        object: "bank_account",
        country: "US",
        currency: "usd",
        account_number:
          // @ts-expect-error TS(2339): Property 'aba' does not exist on type 'FinancialAccount'.
          financialAccount.financial_addresses[0].aba.account_number,
        routing_number:
          // @ts-expect-error TS(2339): Property 'aba' does not exist on type 'FinancialAccount'.
          financialAccount.financial_addresses[0].aba.routing_number,
      },
    });

    return res.json({ externalAcctAdded: true });
  } catch (err) {
    return res
      .status(401)
      .json({ urlCreated: false, error: (err as Error).message });
  }
};

export default withAuth(handler);
