import { Stripe } from "stripe";

import { PlatformStripeAccount } from "src/utils/account-management-helpers";
import { getStripeSecretKey } from "src/utils/stripe-authentication";

const API_VERSION = "2023-10-16";
const APP_INFO_NAME = "Stripe Issuing & Treasury Starter Application";

const stripeClient = (platform: PlatformStripeAccount) => {
  const stripeSecretKey = getStripeSecretKey(platform);

  if (!stripeSecretKey) {
    throw new Error(
      "Cannot instantiate Stripe client. STRIPE_SECRET_KEY needs to be set in environment variables.",
    );
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: API_VERSION,
    typescript: true,
    appInfo: { name: APP_INFO_NAME },
  });
};

export default stripeClient;
