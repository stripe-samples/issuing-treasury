import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import JwtPayload from "src/types/jwt-payload";
import { getSessionFromCookie } from "src/utils/cookie-helpers";

export const withAuth =
  (
    handler: (
      context: GetServerSidePropsContext,
      session: JwtPayload,
    ) => Promise<GetServerSidePropsResult<any>>,
  ) =>
  async (context: GetServerSidePropsContext) => {
    const session = getSessionFromCookie(context);

    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    return handler(context, session);
  };

export const withAuthRequiringOnboarded =
  (
    handler: (
      context: GetServerSidePropsContext,
      session: JwtPayload,
    ) => Promise<GetServerSidePropsResult<any>>,
  ) =>
  async (context: GetServerSidePropsContext) => {
    const session = getSessionFromCookie(context);

    if (!session) {
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
