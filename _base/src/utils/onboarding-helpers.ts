import logger from "./logger";

import { StripeAccount } from "src/utils/account-management-helpers";
import stripeClient from "src/utils/stripe-loader";

const IGNORE_REQUIREMENTS = ["external_account"];

export const hasOutstandingRequirements = async (
  stripeAccount: StripeAccount,
) => {
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);
  const account = await stripe.accounts.retrieve(accountId);

  const outstandingRequirements = account?.requirements?.currently_due?.filter(
    (requirement) => !IGNORE_REQUIREMENTS.includes(requirement),
  );

  logger.debug("Outstanding requirements check:", outstandingRequirements);

  const result = (outstandingRequirements?.length ?? 0) > 0;

  return result;
};

export async function createAccountOnboardingUrl(stripeAccount: StripeAccount) {
  if (
    process.env.CONNECT_ONBOARDING_REDIRECT_URL == undefined &&
    process.env.VERCEL_URL == undefined
  ) {
    throw new Error("CONNECT_ONBOARDING_REDIRECT_URL is not set");
  }

  const { accountId, platform } = stripeAccount;
  let connectOnboardingRedirectUrl;

  if (process.env.VERCEL_URL) {
    connectOnboardingRedirectUrl = `https://${process.env.VERCEL_URL}`;
  } else {
    connectOnboardingRedirectUrl = process.env.CONNECT_ONBOARDING_REDIRECT_URL;
  }

  const stripe = stripeClient(platform);
  const { url } = await stripe.accountLinks.create({
    type: "account_onboarding",
    account: accountId,
    refresh_url: connectOnboardingRedirectUrl + "/onboard",
    return_url: connectOnboardingRedirectUrl + "/",
  });
  return url;
}
