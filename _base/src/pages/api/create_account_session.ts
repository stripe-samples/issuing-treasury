// @if financialProduct==embedded-finance
import { NextApiRequest, NextApiResponse } from "next";

import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: createAccountSession,
  });

const createAccountSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;

  const stripe = stripeClient(platform);
  try {
    const accountSession = await stripe.accountSessions.create(
      {
        account: accountId,
        components: {
          // @ts-expect-error These types aren't up to date
          issuing_cards_list: {
            enabled: true,
            features: {
              card_management: true,
              card_spend_dispute_management: true,
              cardholder_management: true,
              spend_control_management: true,
            },
          },
          financial_account: {
            enabled: true,
            features: {
              external_account_collection: true,
              send_money: true,
              transfer_balance: true,
            },
          },
          financial_account_transactions: {
            enabled: true,
            features: {
              card_spend_dispute_management: true,
            },
          },
        },
      },
      {
        apiVersion: "2023-10-16;embedded_connect_beta=v2",
      },
    );

    res.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    res.status(500);
    res.send({ error: (error as Error).message });
  }
};

export default handler;
// @endif
