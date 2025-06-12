enum Platform {
  UK,
  EU,
  US,
}

const getPlatform = (country: string): Platform => {
  switch (country) {
    case "GB":
      return Platform.UK;
    case "EU":
      return Platform.EU;
    case "US":
      return Platform.US;
    default:
      throw new Error(`Unsupported country ${country}`);
  }
};

const keyPresent = (key: string | undefined): boolean =>
  !!key && key.length > 0 && key != "none";

const enabledPlatforms = () => {
  const ukEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_UK) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_UK);

  const euEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_EU) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_EU);

  const usEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_US) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US);

  return {
    [Platform.UK]: ukEnabled,
    [Platform.EU]: euEnabled,
    [Platform.US]: usEnabled,
  };
};

export { Platform, getPlatform, enabledPlatforms };
