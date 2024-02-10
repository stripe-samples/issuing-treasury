enum Platform {
  US,
}

const getPlatform = (country: string): Platform => {
  switch (country) {
    case "US":
      return Platform.US;
    default:
      throw new Error(`Unsupported country ${country}`);
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
    [Platform.US]: usEnabled,
  };
};

export { Platform, getPlatform, enabledPlatforms };
