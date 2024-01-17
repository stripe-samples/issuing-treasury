import NextAuth, { User } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { Session } from "next-auth/core/types";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { authenticateUser } from "src/utils/authentication";
import { hasOutstandingRequirements } from "src/utils/onboarding-helpers";
import { getPlatform } from "src/utils/platform";
import stripeClient from "src/utils/stripe-loader";

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
      const stripeAccount = {
        accountId: token.accountId,
        platform: getPlatform(token.country),
      };

      if (token.requiresOnboarding != undefined) {
        token.requiresOnboarding =
          token.requiresOnboarding &&
          (await hasOutstandingRequirements(stripeAccount));
      }

      if (user?.email) {
        return { ...token, ...user };
      }

      // If accountId is undefined, that means we're most likely not authenticated yet
      if (token.accountId != undefined && token.businessName == undefined) {
        const platform = getPlatform(token.country);
        const stripe = stripeClient(platform);
        const account = await stripe.accounts.retrieve(token.accountId);
        const businessName = account.business_profile?.name;
        const country = account.country;
        const currency = account.default_currency;

        if (businessName != undefined) {
          token.businessName = businessName;
        }

        if (country != undefined) {
          token.country = country;
        }

        if (currency != undefined) {
          token.currency = currency;
        }
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

      if (token.country == undefined) {
        throw new Error("Session callback: country is missing in the token");
      }

      if (token.currency == undefined) {
        throw new Error("Session callback: currency is missing in the token");
      }

      const stripeAccount = {
        accountId: token.accountId,
        platform: getPlatform(token.country),
      };

      session.email = token.email;
      session.stripeAccount = stripeAccount;
      session.requiresOnboarding = token.requiresOnboarding;
      session.businessName = token.businessName;
      session.country = token.country;
      session.useCase = token.useCase;
      session.currency = token.currency;

      return session;
    },
  },
};

export default NextAuth(authOptions);
