import NextAuth, { User } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { Session } from "next-auth/core/types";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { authenticateUser } from "src/utils/authentication";
import { hasOutstandingRequirements } from "src/utils/onboarding-helpers";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        return await authenticateUser(credentials.email, credentials.password);
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (token.requiresOnboarding != undefined) {
        token.requiresOnboarding =
          token.requiresOnboarding &&
          (await hasOutstandingRequirements(token.accountId));
      }

      if (user?.email) {
        return { ...token, ...user };
      }

      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (token.email == undefined) {
        throw new Error("Session callback: email is missing in the token");
      }

      if (token.accountId == undefined) {
        throw new Error("Session callback: account ID is missing in the token");
      }

      if (token.requiresOnboarding == undefined) {
        throw new Error(
          "Session callback: requiresOnboarding is missing in the token",
        );
      }

      session.email = token.email;
      session.accountId = token.accountId;
      session.businessName = token.businessName;
      session.requiresOnboarding = token.requiresOnboarding;

      return session;
    },
  },
};

export default NextAuth(authOptions);
