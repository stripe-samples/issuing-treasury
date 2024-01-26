import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "src/db";
import { apiResponse } from "src/types/api-response";
import { handlerMapping } from "src/utils/api-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: deleteAccount,
  });

const deleteAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { stripeAccount, user } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);

  // In the demo app, this is straight forward. In a real app, you'd want to make sure that balances are zeroed out
  // before deleting the account, etc.
  await stripe.accounts.del(accountId);

  if (user?.email == undefined) {
    throw new Error("User email is undefined");
  }
  await prisma.user.delete({
    where: {
      email: user?.email,
    },
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
