import { NextApiRequest } from "next";
import { Session } from "next-auth/core/types";

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
}

export default NextApiRequestWithSession;
