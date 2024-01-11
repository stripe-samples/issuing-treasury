import { Platform } from "./platform";

const getStripeSecretKey = (platform: Platform): string | null => {
  let key;

  switch (platform) {
    case Platform.US:
      key = process.env.STRIPE_SECRET_KEY_US;
      break;
    case Platform.UK:
      key = process.env.STRIPE_SECRET_KEY_UK;
      break;
    case Platform.EU:
      key = process.env.STRIPE_SECRET_KEY_EU;
      break;
  }

  return key || null;
};

const getStripePublishableKey = (platform: Platform): string | null => {
  let key;

  switch (platform) {
    case Platform.US:
      key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US;
      break;
    case Platform.UK:
      key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_UK;
      break;
    case Platform.EU:
      key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_EU;
      break;
  }

  return key || null;
};

export { getStripeSecretKey, getStripePublishableKey };
