import bcrypt from "bcrypt";

import { hasOutstandingRequirements } from "./onboarding-helpers";

import { prisma } from "src/db";

export const authenticateUser = async (email: string, password: string) => {
  const userToAuthenticate = await prisma.user.findFirst({
    where: { email },
  });

  const passwordMatch = await bcrypt.compare(
    password,
    userToAuthenticate?.password || "",
  );

  if (userToAuthenticate && passwordMatch) {
    const user = await prisma.user.update({
      where: { id: userToAuthenticate.id },
      data: { lastLoginAt: new Date() },
    });

    const requiresOnboarding = await hasOutstandingRequirements(user.accountId);

    return {
      id: user.id.toString(),
      email: user.email,
      accountId: user.accountId,
      requiresOnboarding: requiresOnboarding,
      country: user.country,
      useCase: user.useCase,
    };
  }

  return null;
};
