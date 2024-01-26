export interface ChartData {
  faTransactionsDates: string[];
  faTransactionsFundsIn: number[];
  faTransactionsFundsOut: number[];
}

export interface BalanceChartData {
  currency: string;
  balanceTransactionsDates: string[];
  balanceTransactionsFundsIn: number[];
  balanceTransactionsFundsOut: number[];
}
