import { Platform } from "./platform-stripe-account-helpers";

const getStripeSecretKey = (platform: Platform): string | null => {
  let key;

  switch (platform) {
    case Platform.US:
      key = process.env.STRIPE_SECRET_KEY_US || process.env.STRIPE_SECRET_KEY;
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return key || null;
};

const getStripePublishableKey = (platform: Platform): string | null => {
  let key;

  switch (platform) {
    case Platform.US:
      key =
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US ||
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return key || null;
};

export { getStripeSecretKey, getStripePublishableKey };
