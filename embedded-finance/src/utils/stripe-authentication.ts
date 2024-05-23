import { PlatformStripeAccount } from "./account-management-helpers";

const getStripeSecretKey = (platform: PlatformStripeAccount): string | null => {
  let key;

  switch (platform) {
    case PlatformStripeAccount.US:
      key = process.env.STRIPE_SECRET_KEY_US || process.env.STRIPE_SECRET_KEY;
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return key || null;
};

const getStripePublishableKey = (
  platform: PlatformStripeAccount,
): string | null => {
  let key;

  switch (platform) {
    case PlatformStripeAccount.US:
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
