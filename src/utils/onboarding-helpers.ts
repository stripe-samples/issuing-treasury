import stripe from "src/utils/stripe-loader";

const IGNORE_REQUIREMENTS = ["external_account"];

export const hasOutstandingRequirements = async (accountId: string) => {
  const account = await stripe.accounts.retrieve(accountId);

  const result =
    (account?.requirements?.currently_due?.filter(
      (requirement) => !IGNORE_REQUIREMENTS.includes(requirement),
    ).length ?? 0) > 0;

  return result;
};

export async function createAccountOnboardingUrl(accountId: string) {
  if (process.env.DEMO_HOST == undefined) {
    throw new Error("DEMO_HOST is not set");
  }

  const host = process.env.DEMO_HOST;

  const { url } = await stripe.accountLinks.create({
    type: "account_onboarding",
    account: accountId,
    refresh_url: host + "/onboard",
    return_url: host + "/",
  });
  return url;
}
