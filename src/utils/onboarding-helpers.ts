import stripe from "src/utils/stripe-loader";

const IGNORE_REQUIREMENTS = ["external_account"];

export const hasOutstandingRequirements = async (accountId: string) => {
  const account = await stripe.accounts.retrieve(accountId);

  return (
    (account?.requirements?.currently_due?.filter(
      (requirement) => !IGNORE_REQUIREMENTS.includes(requirement),
    ).length ?? 0) > 0
  );
};
