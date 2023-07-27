import JwtPayload from "../types/jwt-payload";

import { encode } from "./jwt_encode_decode";
import stripe from "./stripe-loader";

// We don't need the password for this method since it is only collected for demonstration purposes.
export async function authenticateUser(email: string) {
  const { data: users } = await stripe.customers.list({ email });
  const user = users[0];

  if (user && user.metadata.accountId) {
    // Check if there are missing requirements
    const account = await stripe.accounts.retrieve(user.metadata.accountId);

    const currently_due = account.requirements?.currently_due || null;

    let requiresOnboarding = false;

    if (currently_due && currently_due.length > 1) {
      requiresOnboarding = true;
    }

    const cookie: JwtPayload = {
      accountId: user.metadata.accountId,
      requiresOnboarding: requiresOnboarding,
      userEmail: email,
      userId: user.id,
    };

    return {
      cookie: encode(JSON.stringify(cookie)),
      isAuthenticated: true,
      ...cookie,
      businessName: user.name || "",
    };
  }

  return null;
}
