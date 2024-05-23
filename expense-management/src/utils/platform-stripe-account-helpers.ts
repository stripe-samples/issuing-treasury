enum SupportedCountry {
  AT = "AT",
  BE = "BE",
  CY = "CY",
  DE = "DE",
  EE = "EE",
  ES = "ES",
  FI = "FI",
  FR = "FR",
  GB = "GB",
  GR = "GR",
  HR = "HR",
  IE = "IE",
  IT = "IT",
  LT = "LT",
  LU = "LU",
  LV = "LV",
  MT = "MT",
  NL = "NL",
  PT = "PT",
  SI = "SI",
  SK = "SK",
}

enum PlatformStripeAccount {
  UK = "UK",
  EU = "EU",
}

const countryToPlatformStripeAccountMap: Record<
  SupportedCountry,
  PlatformStripeAccount
> = {
  [SupportedCountry.AT]: PlatformStripeAccount.EU,
  [SupportedCountry.BE]: PlatformStripeAccount.EU,
  [SupportedCountry.CY]: PlatformStripeAccount.EU,
  [SupportedCountry.DE]: PlatformStripeAccount.EU,
  [SupportedCountry.EE]: PlatformStripeAccount.EU,
  [SupportedCountry.ES]: PlatformStripeAccount.EU,
  [SupportedCountry.FI]: PlatformStripeAccount.EU,
  [SupportedCountry.FR]: PlatformStripeAccount.EU,
  [SupportedCountry.GB]: PlatformStripeAccount.UK,
  [SupportedCountry.GR]: PlatformStripeAccount.EU,
  [SupportedCountry.HR]: PlatformStripeAccount.EU,
  [SupportedCountry.IE]: PlatformStripeAccount.EU,
  [SupportedCountry.IT]: PlatformStripeAccount.EU,
  [SupportedCountry.LT]: PlatformStripeAccount.EU,
  [SupportedCountry.LU]: PlatformStripeAccount.EU,
  [SupportedCountry.LV]: PlatformStripeAccount.EU,
  [SupportedCountry.MT]: PlatformStripeAccount.EU,
  [SupportedCountry.NL]: PlatformStripeAccount.EU,
  [SupportedCountry.PT]: PlatformStripeAccount.EU,
  [SupportedCountry.SI]: PlatformStripeAccount.EU,
  [SupportedCountry.SK]: PlatformStripeAccount.EU,
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
  const ukEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_UK) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_UK);

  const euEnabled =
    keyPresent(process.env.STRIPE_SECRET_KEY_EU) &&
    keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_EU);

  return {
    [PlatformStripeAccount.UK]: ukEnabled,
    [PlatformStripeAccount.EU]: euEnabled,
  };
};

export {
  PlatformStripeAccount,
  getPlatformStripeAccountForCountry,
  enabledPlatforms,
};
