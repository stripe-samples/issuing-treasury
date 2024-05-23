export enum SupportedCountry {
  // @if financialProduct==expense-management
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
  // @endif
  // @if financialProduct==embedded-finance
  US = "US",
  // @endif
}

export enum PlatformStripeAccount {
  // @if financialProduct==embedded-finance
  US = "US",
  // @endif
  // @if financialProduct==expense-management
  UK = "UK",
  EU = "EU",
  // @endif
}

export interface StripeAccount {
  accountId: string;
  platform: PlatformStripeAccount;
}

type CountryConfig = {
  name: string;
  currency: string;
  platform: PlatformStripeAccount;
};

export const countryDataMap: Record<SupportedCountry, CountryConfig> = {
  // @if financialProduct==expense-management
  [SupportedCountry.AT]: {
    name: "Austria",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.BE]: {
    name: "Belgium",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.CY]: {
    name: "Cyprus",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.DE]: {
    name: "Germany",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.EE]: {
    name: "Estonia",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.ES]: {
    name: "Spain",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.FI]: {
    name: "Finland",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.FR]: {
    name: "France",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.GB]: {
    name: "United Kingdom",
    currency: "GBP",
    platform: PlatformStripeAccount.UK,
  },
  [SupportedCountry.GR]: {
    name: "Greece",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.HR]: {
    name: "Croatia",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.IE]: {
    name: "Ireland",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.IT]: {
    name: "Italy",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.LT]: {
    name: "Lithuania",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.LU]: {
    name: "Luxembourg",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.LV]: {
    name: "Latvia",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.MT]: {
    name: "Malta",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.NL]: {
    name: "Netherlands",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.PT]: {
    name: "Portugal",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.SI]: {
    name: "Slovenia",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  [SupportedCountry.SK]: {
    name: "Slovakia",
    currency: "EUR",
    platform: PlatformStripeAccount.EU,
  },
  // @endif
  // @if financialProduct==embedded-finance
  [SupportedCountry.US]: {
    name: "United States",
    currency: "USD",
    platform: PlatformStripeAccount.US,
  },
  // @endif
};

const isSupportedCountry = (country: unknown): country is SupportedCountry => {
  return Object.values(SupportedCountry).includes(country as SupportedCountry);
};

export const getPlatformStripeAccountForCountry = (
  country: string,
): PlatformStripeAccount => {
  if (isSupportedCountry(country)) {
    return countryDataMap[country].platform;
  } else {
    throw new Error(`Invalid or unsupported country: ${country}`);
  }
};

const keyPresent = (key: string | undefined): boolean =>
  !!key && key.length > 0 && key != "none";

export const enabledPlatforms = () => {
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
    [PlatformStripeAccount.US]: usEnabled,
    // @endif
    // @if financialProduct==expense-management
    [PlatformStripeAccount.UK]: ukEnabled,
    [PlatformStripeAccount.EU]: euEnabled,
    // @endif
  };
};
