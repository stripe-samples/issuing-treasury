// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    username: string;
    email: string;
    accountId: string;
    requiresOnboarding: boolean;
    businessName: string;
  }

  interface User extends DefaultUser {
    username: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    accountId: string;
    username: string;
    requiresOnboarding: boolean;
    businessName: string;
  }
}
