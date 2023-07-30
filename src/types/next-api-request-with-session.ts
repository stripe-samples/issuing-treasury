import { NextApiRequest } from "next";

import JwtPayload from "src/types/jwt-payload";

interface NextApiRequestWithSession extends NextApiRequest {
  session: JwtPayload;
}

export default NextApiRequestWithSession;
