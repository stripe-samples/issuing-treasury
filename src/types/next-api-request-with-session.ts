import { NextApiRequest } from "next";

import JwtPayload from "./jwt-payload";

interface NextApiRequestWithSession extends NextApiRequest {
  session: JwtPayload;
}

export default NextApiRequestWithSession;
