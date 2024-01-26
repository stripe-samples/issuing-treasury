enum Platform {
  US,
  UK,
  EU,
}

const getPlatform = (country: string): Platform => {
  if (country == "US") {
    return Platform.US;
  } else if (country == "GB") {
    return Platform.UK;
  } else {
    return Platform.EU;
  }
};

const keyPresent = (key: string | undefined): boolean =>
  !!key && key.length > 0;

const enabledPlatforms = () => {
  const usEnabled =
    (keyPresent(process.env.STRIPE_SECRET_KEY_US) &&
      keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US)) ||
    (keyPresent(process.env.STRIPE_SECRET_KEY) &&
      keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));

  const ukEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_UK) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_UK);

  const euEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_EU) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_EU);

  return {
    [Platform.US]: usEnabled,
    [Platform.UK]: ukEnabled,
    [Platform.EU]: euEnabled,
  };
};

export { Platform, getPlatform, enabledPlatforms };
