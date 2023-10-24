import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: addExternalAccount,
  });

const addExternalAccount = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const StripeAccountId = session.accountId;

  const stripe = stripeClient();
  // const financialAccounts = await stripe.treasury.financialAccounts.list(
  //   { expand: ["data.financial_addresses.aba.account_number"] },
  //   {
  //     stripeAccount: StripeAccountId,
  //   },
  // );

  // const financialAccount = financialAccounts.data[0];
  // const aba = financialAccount.financial_addresses[0]?.aba;

  // if (
  //   aba == undefined ||
  //   aba.account_number == undefined ||
  //   aba.routing_number == undefined
  // ) {
  //   throw new Error("Invalid or missing ABA for financial account");
  // }

  const token = await stripe.tokens.create(
    {
      bank_account: {
        routing_number: process.env.NEXT_PUBLIC_ROUTING_NUMBER as string,        
        account_number: process.env.NEXT_PUBLIC_ACCOUNT_NUMBER as string,
        country: process.env.NEXT_PUBLIC_CA_COUNTRY as string,
        currency: process.env.NEXT_PUBLIC_CURRENCY,
      },
    },
    undefined,
  );
  await stripe.accounts.createExternalAccount(StripeAccountId, {
    external_account: token.id,
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
