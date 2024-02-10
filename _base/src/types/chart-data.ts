// @if financialProduct==embedded-finance
export interface ChartData {
  faTransactionsDates: string[];
  faTransactionsFundsIn: number[];
  faTransactionsFundsOut: number[];
}
// @endif

// @if financialProduct==expense-management
export interface BalanceChartData {
  currency: string;
  balanceTransactionsDates: string[];
  balanceTransactionsFundsIn: number[];
  balanceTransactionsFundsOut: number[];
}
// @endif
