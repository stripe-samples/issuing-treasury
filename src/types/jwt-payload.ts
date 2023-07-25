interface JwtPayload {
  accountId: string;
  customerid: string;
  customerName: string;
  userEmail: string;
  isAuthenticated: boolean;
  requireNotifications: boolean;
  iat: number;
}

export default JwtPayload;
