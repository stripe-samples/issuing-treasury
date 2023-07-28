import { parse } from "cookie";
import { decode } from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";

import JwtPayload from "../types/jwt-payload";

export const getSessionFromCookie = (context: GetServerSidePropsContext) => {
  const { req } = context;

  if (!req || !("cookie" in req.headers)) {
    return null;
  }

  const cookie = parse(req.headers.cookie as string);
  if (!("app_auth" in cookie)) {
    return null;
  }

  const session: JwtPayload = decode(cookie.app_auth) as JwtPayload;
  if (!session.accountId) {
    throw new Error("Stripe account ID is missing in the session");
  }

  return session;
};
