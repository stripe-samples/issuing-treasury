import bcrypt from "bcrypt";

import { hasOutstandingRequirements } from "./onboarding-helpers";
import stripe from "./stripe-loader";

import { prisma } from "src/db";

export const authenticateUser = async (username: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { username },
  });

  const passwordMatch = await bcrypt.compare(password, user?.password || "");

  if (user && passwordMatch) {
    const account = await stripe.accounts.retrieve(user.accountId);
    const businessName = account.business_profile?.name;

    const requiresOnboarding = await hasOutstandingRequirements(user.accountId);

    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      accountId: user.accountId,
      businessName: businessName,
      requiresOnboarding: requiresOnboarding,
    };
  }

  return null;
};
