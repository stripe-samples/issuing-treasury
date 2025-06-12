import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "src/db";
import { authOptions } from "src/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email } = session;
    if (!email) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const logs = await prisma.apiRequestLog.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        created: 'desc'
      },
      take: 100 // Limit to last 100 logs
    });

    res.status(200).json({ logs });
  } catch (error) {
    console.error("Error fetching API request logs:", error);
    res.status(500).json({ message: "Error fetching API request logs" });
  }
} 