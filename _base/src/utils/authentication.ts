import bcrypt from "bcrypt";

import { prisma } from "src/db";
import {
  getPlatformStripeAccountForCountry,
  isSupportedCountry,
  SupportedCountry,
} from "src/utils/account-management-helpers";
import { hasOutstandingRequirements } from "src/utils/onboarding-helpers";

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

    if (!isSupportedCountry(user.country)) {
      throw new Error(`Unsupported country ${user.country}`);
    }

    const stripeAccount = {
      accountId: user.accountId,
      platform: getPlatformStripeAccountForCountry(
        user.country as unknown as SupportedCountry,
      ),
    };

    const requiresOnboarding = await hasOutstandingRequirements(stripeAccount);

    // User session context setup flow step 1:
    // This is the object that will be available as `user` in the `jwt` callback in [...nextauth].ts
    return {
      id: user.id.toString(),
      email: user.email,
      accountId: user.accountId,
      country: user.country,
      // @begin-exclude-from-subapps
      financialProduct: user.financialProduct,
      // @end-exclude-from-subapps
      requiresOnboarding: requiresOnboarding,
    };
  }

  return null;
};
