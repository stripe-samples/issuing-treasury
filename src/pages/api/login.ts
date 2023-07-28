import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { authenticateUser } from "../../utils/authentication";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string().max(255).required("Password is required"),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Bad Request" });
  }

  const {
    body: { email, password },
  } = req;

  try {
    await validationSchema.validate({ email, password }, { abortEarly: false });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }

  const authenticationResult = await authenticateUser(email);

  if (!authenticationResult) {
    return res.status(401).json({
      isAuthenticated: false,
      error: "Wrong email or password",
    });
  }

  res.setHeader(
    "Set-Cookie",
    serialize("app_auth", authenticationResult.cookie, {
      path: "/",
      httpOnly: true,
    }),
  );

  return res.json({
    isAuthenticated: true,
    requiresOnboarding: authenticationResult.requiresOnboarding,
    businessName: authenticationResult.businessName,
    accountId: authenticationResult.accountId,
    userEmail: authenticationResult.userEmail,
    userId: authenticationResult.userId,
  });
};

export default handler;
