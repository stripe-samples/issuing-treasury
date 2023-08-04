import bcrypt from "bcrypt";

import { prisma } from "src/db";
import stripe from "src/utils/stripe-loader";

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  const passwordMatch = await bcrypt.compare(password, user?.password || "");

  if (user && passwordMatch) {
    // Check if there are missing requirements
    const account = await stripe.accounts.retrieve(user.accountId);

    const currently_due = account.requirements?.currently_due || null;

    let requiresOnboarding = false;

    if (currently_due && currently_due.length > 1) {
      requiresOnboarding = true;
    }

    return {
      id: user.id.toString(),
      email: user.email,
      accountId: user.accountId,
      businessName: "Test Business Name",
      requiresOnboarding: requiresOnboarding,
    };
  }

  return null;
};
