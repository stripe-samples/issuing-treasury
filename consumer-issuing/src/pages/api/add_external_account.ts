import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
import { StripeAccount } from "src/utils/account-management-helpers";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const TEST_GB_ACCOUNT_NUMBER = "00012345";
const TEST_GB_SORT_CODE = "108800";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: addExternalAccount,
  });

const addExternalBankAccount = async (
  stripeAccount: StripeAccount,
  currency: string,
) => {
  const { platform } = stripeAccount;
  const stripe = stripeClient(platform);
  const token = await stripe.tokens.create(
    {
      bank_account: {
        account_number: TEST_GB_ACCOUNT_NUMBER,
        routing_number: TEST_GB_SORT_CODE,
        country: "GB",
        currency: currency,
      },
    },
    undefined,
  );

  return token;
};

const addExternalAccount = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { currency, stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  const token = await (async () => {
    return await addExternalBankAccount(stripeAccount, currency);
  })();

  await stripe.accounts.createExternalAccount(accountId, {
    external_account: token.id,
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
