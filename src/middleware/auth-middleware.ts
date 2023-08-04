import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { Session } from "next-auth/core/types";
import { getServerSession } from "next-auth/next";

import { authOptions } from "src/pages/api/auth/[...nextauth]";

// Used to protect getServerSideProps functions that don't require onboarding yet such as the /onboard endpoint
export const withAuth =
  (
    handler: (
      context: GetServerSidePropsContext,
      session: Session,
    ) => Promise<GetServerSidePropsResult<any>>,
  ) =>
  async (context: GetServerSidePropsContext) => {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions,
    );

    if (session == null) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    if (session.accountId == undefined) {
      throw new Error(
        "Pre-onboarding auth check: Stripe account ID is missing in the session",
      );
    }

    if (session.requiresOnboarding == undefined) {
      throw new Error(
        "Pre-onboarding auth check: requiresOnboarding field is missing in the session",
      );
    }

    return handler(context, session);
  };

// Used to protect getServerSideProps functions that do require having been onboarded
export const withAuthRequiringOnboarded =
  (
    handler: (
      context: GetServerSidePropsContext,
      session: Session,
    ) => Promise<GetServerSidePropsResult<any>>,
  ) =>
  async (context: GetServerSidePropsContext) => {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions,
    );

    if (session == null) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    if (session.requiresOnboarding === true) {
      return {
        redirect: {
          destination: "/onboard",
          permanent: false,
        },
      };
    }

    return handler(context, session);
  };
