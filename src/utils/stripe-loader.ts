import { Stripe } from "stripe";

const API_VERSION = "2023-08-16";
const APP_INFO_NAME = "Stripe Issuing & Treasury Starter Application";

const stripeClient = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

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
