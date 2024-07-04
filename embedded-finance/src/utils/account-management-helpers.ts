export enum SupportedCountry {
  US = "US",
}

export enum Currency {
  USD = "usd",
  GBP = "gbp",
  EUR = "eur",
}

export enum PlatformStripeAccount {
  US,
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
  [SupportedCountry.US]: {
    code: "US",
    name: "United States",
    currency: Currency.USD,
    platform: PlatformStripeAccount.US,
    locale: "en-US",
  },
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
  const usEnabled =
    (keyPresent(process.env.STRIPE_SECRET_KEY_US) &&
      keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US)) ||
    (keyPresent(process.env.STRIPE_SECRET_KEY) &&
      keyPresent(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));

  return {
    [PlatformStripeAccount.US]: usEnabled,
  };
};
