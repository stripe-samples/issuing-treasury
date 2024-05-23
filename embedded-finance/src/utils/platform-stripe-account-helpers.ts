enum SupportedCountry {
  US = "US",
}

enum PlatformStripeAccount {
  US = "US",
}

const countryToPlatformStripeAccountMap: Record<
  SupportedCountry,
  PlatformStripeAccount
> = {
  [SupportedCountry.US]: PlatformStripeAccount.US,
};

const isSupportedCountry = (country: unknown): country is SupportedCountry => {
  return Object.values(SupportedCountry).includes(country as SupportedCountry);
};

const getPlatformStripeAccountForCountry = (
  country: string,
): PlatformStripeAccount => {
  if (isSupportedCountry(country)) {
    return countryToPlatformStripeAccountMap[country];
  } else {
    throw new Error(`Invalid or unsupported country: ${country}`);
  }
};

const keyPresent = (key: string | undefined): boolean =>
  !!key && key.length > 0 && key != "none";

const enabledPlatforms = () => {
  const usEnabled =
    (keyPresent(process.env.STRIPE_SECRET_KEY_US) &&
      keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US)) ||
    (keyPresent(process.env.STRIPE_SECRET_KEY) &&
      keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));

  return {
    [PlatformStripeAccount.US]: usEnabled,
  };
};

export {
  PlatformStripeAccount,
  getPlatformStripeAccountForCountry,
  enabledPlatforms,
};
