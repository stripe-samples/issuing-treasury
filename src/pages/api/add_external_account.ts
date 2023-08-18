import { NextApiRequest, NextApiResponse } from "next";

import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const session = await getSessionForServerSide(req, res);
    const StripeAccountId = session.accountId;

    const stripe = stripeClient();
    const financialAccounts = await stripe.treasury.financialAccounts.list(
      { expand: ["data.financial_addresses.aba.account_number"] },
      {
        stripeAccount: StripeAccountId,
      },
    );

    const financialAccount = financialAccounts.data[0];
    const aba = financialAccount.financial_addresses[0]?.aba;

    if (
      aba == undefined ||
      aba.account_number == undefined ||
      aba.routing_number == undefined
    ) {
      throw new Error("Invalid or missing ABA for financial account");
    }

    const token = await stripe.tokens.create(
      {
        bank_account: {
          account_number: aba.account_number,
          country: "US",
          currency: "usd",
          routing_number: aba.routing_number,
        },
      },
      undefined,
    );
    await stripe.accounts.createExternalAccount(StripeAccountId, {
      external_account: token.id,
    });

    return res.json({ externalAcctAdded: true });
  } catch (err) {
    return res
      .status(401)
      .json({ urlCreated: false, error: (err as Error).message });
  }
};

export default handler;
