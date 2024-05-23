import { PlatformStripeAccount } from "./account-management-helpers";

const getStripeSecretKey = (platform: PlatformStripeAccount): string | null => {
  let key;

  switch (platform) {
    // @if financialProduct==embedded-finance
    case PlatformStripeAccount.US:
      key = process.env.STRIPE_SECRET_KEY_US || process.env.STRIPE_SECRET_KEY;
      break;
    // @endif
    // @if financialProduct==expense-management
    case PlatformStripeAccount.UK:
      key = process.env.STRIPE_SECRET_KEY_UK;
      break;
    case PlatformStripeAccount.EU:
      key = process.env.STRIPE_SECRET_KEY_EU;
      break;
    // @endif
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
    // @if financialProduct==embedded-finance
    case PlatformStripeAccount.US:
      key =
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US ||
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      break;
    // @endif
    // @if financialProduct==expense-management
    case PlatformStripeAccount.UK:
      key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_UK;
      break;
    case PlatformStripeAccount.EU:
      key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_EU;
      break;
    // @endif
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return key || null;
};

export { getStripeSecretKey, getStripePublishableKey };
