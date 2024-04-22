enum Platform {
  UK,
  EU,
}

//EU Countries (excluding UK)= AT, BE, HR, CY, EE, FI, FR, DE, GR, IE, IT, LV, LT, LU, MT, PT, SK, SI, ES, 
const euCountriesList = ['AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'PT', 'SK', 'SI', 'ES']

const getPlatform = (country: string): Platform => {

  if (euCountriesList.includes(country)) {
    country = 'EU'
  }

  switch (country) {
    case "GB":
      return Platform.UK;
    case "EU":
      return Platform.EU;
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

  return {
    [Platform.UK]: ukEnabled,
    [Platform.EU]: euEnabled,
  };
};

export { Platform, getPlatform, enabledPlatforms };
