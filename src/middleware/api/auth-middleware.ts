import { parse } from "cookie";
import { decode } from "jsonwebtoken";
import { NextApiResponse } from "next";

import JwtPayload from "src/types/jwt-payload";
import NextApiRequestWithSession from "src/types/next-api-request-with-session";

const withAuth = (
  handler: (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
  ) => Promise<void>,
) => {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const { app_auth } = parse(req.headers.cookie || "");
    const rawSession = decode(app_auth);

    if (typeof rawSession === "string") {
      return res.status(400).json({ error: "Bad Request" });
    }

    req.session = rawSession as JwtPayload;

    await handler(req, res);
  };
};

export default withAuth;
