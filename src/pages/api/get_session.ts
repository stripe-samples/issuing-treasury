import { parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

import { decode } from "../../utils/jwt_encode_decode";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const { app_auth } = parse(req.headers.cookie || "");

  if (!app_auth) {
    return res.json({ isAuthenticated: false });
  }

  return res.json({
    isAuthenticated: true,
    user: decode(app_auth),
  });
};

export default handler;
