const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatUSD(amount: any) {
  return formatter.format(amount);
}

export function formatDateTime(secondsSinceEpoch: any) {
  var d = new Date(secondsSinceEpoch * 1000);
  var options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    seconds: '2-digit',
    timeZoneName: 'short',
  };
  // @ts-expect-error TS(2769): No overload matches this call.
  return d.toLocaleDateString('en-US', options);
}

export function capitalize(string: any) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}