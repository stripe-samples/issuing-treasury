const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatUSD(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatDateTime(secondsSinceEpoch: any) {
  const d = new Date(secondsSinceEpoch * 1000);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    seconds: "2-digit",
    timeZoneName: "short",
  };
  // @ts-expect-error TS(2769): No overload matches this call.
  return d.toLocaleDateString("en-US", options);
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
