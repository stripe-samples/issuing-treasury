import { parse, serialize } from "cookie";
import { NextApiResponse } from "next";

import withAuth from "src/middleware/api/auth-middleware";
import NextApiRequestWithSession from "src/types/next-api-request-with-session";

type NextApiResponseWithCookieArray<T = Record<string, unknown>> =
  NextApiResponse<T> & {
    cookieArray?: string[];
  };

const handler = async (
  req: NextApiRequestWithSession,
  res: NextApiResponseWithCookieArray,
) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  // Delete up all cookies
  if ("cookie" in req.headers && req.headers.cookie?.length) {
    const cookie: Record<string, string> = parse(req.headers.cookie);

    res.cookieArray = [];
    const options = { path: "/", httpOnly: true, maxAge: 0 };
    Object.keys(cookie).forEach(function (cookieEntry) {
      if (res.cookieArray) {
        res.cookieArray.push(serialize(cookieEntry, "", options));
      }
    });

    if (res.cookieArray) {
      res.setHeader("Set-Cookie", res.cookieArray);
    }
  }

  return res.status(200).json({ isAuthenticated: false });
};

export default withAuth(handler);
