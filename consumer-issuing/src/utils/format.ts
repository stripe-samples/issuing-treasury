import { format, fromUnixTime } from "date-fns";

import {
  CountryConfigMap,
  SupportedCountry,
} from "src/utils/account-management-helpers";

export const formatCurrencyForCountry = (
  amountInMinorUnits: number,
  country: SupportedCountry,
) => {
  const countryConfig = CountryConfigMap[country];
  const currencyFormatter = new Intl.NumberFormat(countryConfig.locale, {
    style: "currency",
    currency: countryConfig.currency.toString(),
    minimumFractionDigits: 2,
  });
  // Convert amount from minor units to major units (e.g., cents to dollars)
  return currencyFormatter.format(amountInMinorUnits / 100);
};

export const formatDateTime = (secondsSinceEpoch: number) => {
  return format(fromUnixTime(secondsSinceEpoch), "MMM dd, yyyy");
};

export const formatDateAndTime = (secondsSinceEpoch: number) => {
  return format(fromUnixTime(secondsSinceEpoch), "MMM dd, yyyy 'at' h:mm a");
};

export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const titleize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|-)\w/g, (match) => match.toUpperCase());
};
