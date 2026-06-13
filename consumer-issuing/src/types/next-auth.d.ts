// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

import { SupportedCountry } from "src/utils/account-management-helpers";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    email: string;
    accountId: string;
    requiresOnboarding: boolean;
    businessName: string;
    country: SupportedCountry;
    currency: string;
    stripeAccount: StripeAccount;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    accountId: string;
    requiresOnboarding: boolean;
    businessName: string;
    country: SupportedCountry;
    currency: string;
  }
}
