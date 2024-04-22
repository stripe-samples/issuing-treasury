enum Platform {
  // @if financialProduct==embedded-finance
  US,
  // @endif
  // @if financialProduct==expense-management
  UK,
  EU,
  // @endif
}

const euCountriesList = ["AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "PT", "SK", "SI", "ES"];

const getPlatform = (country: string): Platform => {

  if (euCountriesList.includes(country)) {
    country = "EU"
  };

  switch (country) {
    // @if financialProduct==embedded-finance
    case "US":
      return Platform.US;
    // @endif
    // @if financialProduct==expense-management
    case "GB":
      return Platform.UK;
    case "EU":
      return Platform.EU;
    // @endif
    default:
      throw new Error(`Unsupported country ${country}`);
  }
};

const keyPresent = (key: string | undefined): boolean =>
  !!key && key.length > 0 && key != "none";

const enabledPlatforms = () => {
  // @if financialProduct==embedded-finance
  const usEnabled =
    (keyPresent(process.env.STRIPE_SECRET_KEY_US) &&
      keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US)) ||
    (keyPresent(process.env.STRIPE_SECRET_KEY) &&
      keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
  // @endif

  // @if financialProduct==expense-management
  const ukEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_UK) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_UK);

  const euEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_EU) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_EU);
  // @endif

  return {
    // @if financialProduct==embedded-finance
    [Platform.US]: usEnabled,
    // @endif
    // @if financialProduct==expense-management
    [Platform.UK]: ukEnabled,
    [Platform.EU]: euEnabled,
    // @endif
  };
};

export { Platform, getPlatform, enabledPlatforms };
