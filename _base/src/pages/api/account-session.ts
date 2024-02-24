import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse } from "src/types/api-response";
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
  console.log("createAccountSession~~~~~~~~~~~~~~~~~~~~~");

  const session = await getSessionForServerSide(req, res);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  const accountSession = await stripe.accountSessions.create({
    account: accountId,
    // This should contain a list of all components used in FurEver, otherwise they will be disabled when rendering
    components: {
      account_onboarding: {
        enabled: true,
      },
    },
  });

  console.log(accountSession);
  console.log(accountSession.client_secret);

  return res.status(200).json(
    apiResponse({
      success: true,
      data: { clientSecret: accountSession.client_secret },
    }),
  );
};

export default handler;
