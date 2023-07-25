import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

import { authenticateUser } from "../../utils/authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      body: { email, password },
    } = req;

    if (!email) {
      return res.status(500).json({ error: "Email shouldn't be empty!" });
    }

    if (!password) {
      return res.status(500).json({ error: "Password shouldn't be empty!" });
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({
        isAuthenticated: false,
        error: "Wrong email or password",
      });
    }
    res.setHeader(
      "Set-Cookie",
      serialize("app_auth", user.cookie, { path: "/", httpOnly: true }),
    );

    return res.json({
      isAuthenticated: true,
      requiresOnboarding: user.requiresOnboarding,
    });
  }
};

export default handler;
