import { format, fromUnixTime } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatUSD(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatDateTime(secondsSinceEpoch: number) {
  return format(fromUnixTime(secondsSinceEpoch), "MMM dd, yyyy");
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
