import { format, fromUnixTime } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatUSD(amount: number) {
  return currencyFormatter.format(amount);
}

const currency = process.env.NEXT_PUBLIC_CURRENCY;
var locale;

switch(currency) { 
  case "GBP": { 
    locale = "en-GB";
     break; 
  } 
  case "EUR": { 
    locale = "en-EU";
     break; 
  } 
  default: { 
    locale = "en-US";
     break; 
  } 
};

const newCurrencyFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: currency,
  minimumFractionDigits: 2,
});

export function currencyFormat(amount: number) {
  return newCurrencyFormatter.format(amount);
}


export function formatDateTime(secondsSinceEpoch: number) {
  return format(fromUnixTime(secondsSinceEpoch), "MMM dd, yyyy");
}

export function formatDateAndTime(secondsSinceEpoch: number) {
  return format(fromUnixTime(secondsSinceEpoch), "MMM dd, yyyy 'at' h:mm a");
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function titleize(str: string) {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|-)\w/g, (match) => match.toUpperCase());
}
