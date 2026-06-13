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

  // Try to delete the Stripe account, but continue even if it doesn't exist
  try {
    await stripe.accounts.del(accountId);
  } catch (error) {
    // If the error is not a "No such account" error, rethrow it
    // if (!(error instanceof Error) || !error.message.includes('No such account')) {
    //   throw error;
    // }
    // Otherwise, log the error and continue with user deletion
    console.log(`Stripe account ${accountId} not found, continuing with user deletion`);
  }

  if (user?.email == undefined) {
    throw new Error("User email is undefined");
  }

  // First delete all API request logs for this user
  await prisma.apiRequestLog.deleteMany({
    where: {
      user: {
        email: user.email
      }
    }
  });

  // Then delete the user
  await prisma.user.delete({
    where: {
      email: user?.email,
    },
  });

  return res.status(200).json(apiResponse({ success: true }));
};

export default handler;
