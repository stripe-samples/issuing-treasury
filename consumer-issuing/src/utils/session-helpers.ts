import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "src/pages/api/auth/[...nextauth]";

export const getSessionForServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session == null) {
    throw new Error("Session is missing in the request");
  }

  return session;
};

export const getSessionForLoginOrRegisterServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return session;
};

export const getSessionForServerSide = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, authOptions);

  if (session == null) {
    throw new Error("Session is missing in the request");
  }

  return session;
};
