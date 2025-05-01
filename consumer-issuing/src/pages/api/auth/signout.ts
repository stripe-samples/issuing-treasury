import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getSession({ req });
  if (session) {
    // Clear the session
    res.setHeader("Set-Cookie", "next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  }

  // Redirect to login page
  res.writeHead(302, { Location: "/auth/login" });
  res.end();
} 