interface JwtPayload {
  accountId: string;
  requiresOnboarding: boolean;
  userEmail: string;
  userId: string;
}

export default JwtPayload;
