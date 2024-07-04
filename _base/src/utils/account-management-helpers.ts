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
  UK = "GB",
  // @endif
  // @if financialProduct==embedded-finance
  US = "US",
  // @endif
}

export enum Currency {
  USD = "usd",
  GBP = "gbp",
  EUR = "eur",
}

export enum PlatformStripeAccount {
  // @if financialProduct==embedded-finance
  US,
  // @endif
  // @if financialProduct==expense-management
  UK,
  EU,
  // @endif
}

export interface StripeAccount {
  accountId: string;
  platform: PlatformStripeAccount;
}

type CountryConfig = {
  code: string;
  name: string;
  currency: Currency;
  platform: PlatformStripeAccount;
  locale: string;
};

export const CountryConfigMap: Record<SupportedCountry, CountryConfig> = {
  // @if financialProduct==expense-management
  [SupportedCountry.AT]: {
    code: "AT",
    name: "Austria",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "de-AT",
  },
  [SupportedCountry.BE]: {
    code: "BE",
    name: "Belgium",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "fr-BE",
  },
  [SupportedCountry.CY]: {
    code: "CY",
    name: "Cyprus",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "el-CY",
  },
  [SupportedCountry.DE]: {
    code: "DE",
    name: "Germany",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "de-DE",
  },
  [SupportedCountry.EE]: {
    code: "EE",
    name: "Estonia",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "et-EE",
  },
  [SupportedCountry.ES]: {
    code: "ES",
    name: "Spain",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "es-ES",
  },
  [SupportedCountry.FI]: {
    code: "FI",
    name: "Finland",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "fi-FI",
  },
  [SupportedCountry.FR]: {
    code: "FR",
    name: "France",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "fr-FR",
  },
  [SupportedCountry.GR]: {
    code: "GR",
    name: "Greece",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "el-GR",
  },
  [SupportedCountry.HR]: {
    code: "HR",
    name: "Croatia",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "hr-HR",
  },
  [SupportedCountry.IE]: {
    code: "IE",
    name: "Ireland",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "en-IE",
  },
  [SupportedCountry.IT]: {
    code: "IT",
    name: "Italy",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "it-IT",
  },
  [SupportedCountry.LT]: {
    code: "LT",
    name: "Lithuania",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "lt-LT",
  },
  [SupportedCountry.LU]: {
    code: "LU",
    name: "Luxembourg",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "lb-LU",
  },
  [SupportedCountry.LV]: {
    code: "LV",
    name: "Latvia",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "lv-LV",
  },
  [SupportedCountry.MT]: {
    code: "MT",
    name: "Malta",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "mt-MT",
  },
  [SupportedCountry.NL]: {
    code: "NL",
    name: "Netherlands",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "nl-NL",
  },
  [SupportedCountry.PT]: {
    code: "PT",
    name: "Portugal",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "pt-PT",
  },
  [SupportedCountry.SI]: {
    code: "SI",
    name: "Slovenia",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "sl-SI",
  },
  [SupportedCountry.SK]: {
    code: "SK",
    name: "Slovakia",
    currency: Currency.EUR,
    platform: PlatformStripeAccount.EU,
    locale: "sk-SK",
  },
  [SupportedCountry.UK]: {
    code: "GB",
    name: "United Kingdom",
    currency: Currency.GBP,
    platform: PlatformStripeAccount.UK,
    locale: "en-GB",
  },
  // @endif
  // @if financialProduct==embedded-finance
  [SupportedCountry.US]: {
    code: "US",
    name: "United States",
    currency: Currency.USD,
    platform: PlatformStripeAccount.US,
    locale: "en-US",
  },
  // @endif
};

export const isSupportedCountry = (
  country: unknown,
): country is SupportedCountry => {
  return Object.values(SupportedCountry).includes(country as SupportedCountry);
};

export const getPlatformStripeAccountForCountry = (
  country: SupportedCountry,
): PlatformStripeAccount => {
  return CountryConfigMap[country].platform;
};

export const getSupportedCountryConfigsInRegion = (
  country: SupportedCountry,
): CountryConfig[] => {
  const platform = getPlatformStripeAccountForCountry(country);
  const countryConfigs = Object.values(CountryConfigMap).filter(
    (config) => config.platform === platform,
  );
  return countryConfigs;
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
