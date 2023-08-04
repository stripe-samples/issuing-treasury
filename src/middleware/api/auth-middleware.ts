import { NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "src/pages/api/auth/[...nextauth]";
import NextApiRequestWithSession from "src/types/next-api-request-with-session";

// Used to protect API routes that require having been onboarded
const withAuth = (
  handler: (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
  ) => Promise<void>,
) => {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.session = session;

    await handler(req, res);
  };
};

export default withAuth;
