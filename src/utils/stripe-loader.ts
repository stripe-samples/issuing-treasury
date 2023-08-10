import { Stripe } from "stripe";

const API_VERSION = "2022-11-15";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe Secret Key is not set in environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: API_VERSION,
});

export default stripe;
