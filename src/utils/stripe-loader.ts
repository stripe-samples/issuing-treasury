import { Stripe } from "stripe";

const API_VERSION = "2023-08-16";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe Secret Key is not set in environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: API_VERSION,
});

export default stripe;
