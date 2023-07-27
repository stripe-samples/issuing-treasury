import { parse, serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(404).end();
  }
  // Delete up all cookies
  if ("cookie" in req.headers) {
    // @ts-expect-error Remove after deployment succeeds
    const cookie = parse(req.headers.cookie);
    // @ts-expect-error Remove after deployment succeeds
    res.cookieArray = [];
    const options = { path: "/", httpOnly: true, maxAge: 0 };
    Object.keys(cookie).forEach(function (cookie_element) {
      // @ts-expect-error Remove after deployment succeeds
      res.cookieArray.push(serialize(cookie_element, "", options));
    });
    // @ts-expect-error Remove after deployment succeeds
    res.setHeader("Set-Cookie", res.cookieArray);
  }

  return res.status(200).json({ isAuthenticated: false });
};

export default handler;
