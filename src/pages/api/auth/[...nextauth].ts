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
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        return await authenticateUser(
          credentials.username,
          credentials.password,
        );
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

      if (user?.username) {
        return { ...token, ...user };
      }

      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (token.username == undefined) {
        throw new Error("Session callback: username is missing in the token");
      }

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

      session.username = token.username;
      session.email = token.email;
      session.accountId = token.accountId;
      session.businessName = token.businessName;
      session.requiresOnboarding = token.requiresOnboarding;

      return session;
    },
  },
};

export default NextAuth(authOptions);
