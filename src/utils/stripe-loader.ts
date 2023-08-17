import { Stripe } from "stripe";

const API_VERSION = "2023-08-16";

const stripeClient = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      "Cannot instantiate Stripe client. STRIPE_SECRET_KEY needs to be set in environment variables.",
    );
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: API_VERSION,
  });
};

export default stripeClient;
