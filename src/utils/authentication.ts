import stripe from "src/utils/stripe-loader";

export const authenticateUser = async (email: string, password: string) => {
  const { data: users } = await stripe.customers.list({ email });
  const user = users[0];

  if (user && user.metadata.accountId) {
    // Check if there are missing requirements
    const account = await stripe.accounts.retrieve(user.metadata.accountId);

    const currently_due = account.requirements?.currently_due || null;

    let requiresOnboarding = false;

    if (currently_due && currently_due.length > 1) {
      requiresOnboarding = true;
    }

    return {
      id: user.id,
      email: user.email,
      accountId: user.metadata.accountId,
      businessName: user.name || "",
      requiresOnboarding: requiresOnboarding,
    };
  }

  return null;
};
