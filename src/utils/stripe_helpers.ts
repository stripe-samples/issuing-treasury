import { format, addDays } from "date-fns";
import Stripe from "stripe";

import { ChartData, BalanceChartData } from "src/types/chart-data";
import stripeClient from "src/utils/stripe-loader";

export async function getFinancialAccountTransactions(StripeAccountID: string) {
  const stripe = stripeClient();
  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: StripeAccountID,
  });
  const financialAccount = financialAccounts.data[0];
  const fa_transactions = await stripe.treasury.transactions.list(
    {
      financial_account: financialAccount.id,
      limit: 10,
    },
    { stripeAccount: StripeAccountID },
  );
  return {
    fa_transactions: fa_transactions.data,
  };
}

export async function getFinancialAccountTransactionsExpanded(
  StripeAccountID: string,
) {
  const stripe = stripeClient();
  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: StripeAccountID,
  });
  const financialAccount = financialAccounts.data[0];
  const fa_transactions = await stripe.treasury.transactions.list(
    {
      financial_account: financialAccount.id,
      limit: 10,
      expand: ["data.flow_details"],
    },
    { stripeAccount: StripeAccountID },
  );
  return {
    fa_transactions: fa_transactions.data,
  };
}

export async function getFinancialAccountDetails(StripeAccountID: string) {
  const stripe = stripeClient();
  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: StripeAccountID,
  });
  const financialAccount = financialAccounts.data[0];
  return {
    financialaccount: financialAccount,
  };
}

export async function getFinancialAccountDetailsExp(StripeAccountID: string) {
  const stripe = stripeClient();
  const financialAccounts = await stripe.treasury.financialAccounts.list(
    { expand: ["data.financial_addresses.aba.account_number"] },
    {
      stripeAccount: StripeAccountID,
    },
  );
  const financialAccount = financialAccounts.data[0];
  return {
    financialaccount: financialAccount,
  };
}

type FundsFlowByDate = {
  date: string;
  fundsIn: number;
  fundsOut: number;
};

const NUMBER_OF_DAYS = 10;
const DATE_FORMAT = "MMM dd";

export async function getFinancialAccountTransactionDetails(
  stripeAccountID: string,
) {
  const stripe = stripeClient();
  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: stripeAccountID,
  });
  const financialAccount = financialAccounts.data[0];

  // Calculate the start and end date for the last 7 days
  const endDate = new Date();
  const startDate = addDays(endDate, -NUMBER_OF_DAYS + 1);

  const faTransactions = await stripe.treasury.transactions.list(
    {
      financial_account: financialAccount.id,
      created: {
        gte: Math.floor(startDate.getTime() / 1000), // Convert to seconds
        lte: Math.floor(endDate.getTime() / 1000), // Convert to seconds
      },
      limit: 1000,
    },
    { stripeAccount: stripeAccountID },
  );

  const datesArray: string[] = Array.from(
    { length: NUMBER_OF_DAYS },
    (_, index) => {
      const date = addDays(endDate, -index);
      return format(date, DATE_FORMAT);
    },
  );

  const fundsFlowByDate: { [formattedDate: string]: FundsFlowByDate } =
    datesArray.reduce(
      (dates, formattedDate) => {
        dates[formattedDate] = {
          date: formattedDate,
          fundsIn: 0,
          fundsOut: 0,
        };
        return dates;
      },
      {} as { [formattedDate: string]: FundsFlowByDate },
    );

  faTransactions.data.forEach((element: Stripe.Treasury.Transaction) => {
    const date = new Date(element.created * 1000);
    const formattedDate = format(date, DATE_FORMAT);
    const amountInDollars = Math.abs(element.amount) / 100;

    if (fundsFlowByDate.hasOwnProperty(formattedDate)) {
      if (element.amount > 0) {
        fundsFlowByDate[formattedDate].fundsIn += amountInDollars;
      } else {
        fundsFlowByDate[formattedDate].fundsOut += amountInDollars;
      }
    }
  });

  const fundsInArray: number[] = datesArray.map(
    (formattedDate) => fundsFlowByDate[formattedDate].fundsIn,
  );
  const fundsOutArray: number[] = datesArray.map(
    (formattedDate) => fundsFlowByDate[formattedDate].fundsOut,
  );

  // Reverse the arrays
  datesArray.reverse();
  fundsInArray.reverse();
  fundsOutArray.reverse();

  const faTransactionsChart: ChartData = {
    faTransactionsDates: datesArray,
    faTransactionsFundsIn: fundsInArray,
    faTransactionsFundsOut: fundsOutArray,
  };

  return {
    faFundsFlowChartData: faTransactionsChart,
  };
}

export async function getCardholders(StripeAccountID: string) {
  const stripe = stripeClient();
  const cardholders = await stripe.issuing.cardholders.list(
    { limit: 100 },
    { stripeAccount: StripeAccountID },
  );

  return {
    cardholders: cardholders,
  };
}

export async function getCards(StripeAccountID: string) {
  const stripe = stripeClient();
  const cards = await stripe.issuing.cards.list(
    { limit: 100 },
    { stripeAccount: StripeAccountID },
  );

  return {
    cards: cards,
  };
}

export async function getCardDetails(StripeAccountID: string, cardId: string) {
  const stripe = stripeClient();
  // Retrieve last 10 authorizations
  const card_authorizations = await stripe.issuing.authorizations.list(
    {
      card: cardId,
      limit: 10,
    },
    { stripeAccount: StripeAccountID },
  );

  // Calculate current spend
  let current_spend = 0;
  card_authorizations.data.forEach(function (
    authorization: Stripe.Issuing.Authorization,
  ) {
    // Validate the authorization was approved before adding it to the total spend
    if (authorization.approved == true) {
      current_spend = current_spend + authorization.amount;
    }
  });

  const card_details = await stripe.issuing.cards.retrieve(
    cardId,
    { expand: ["cardholder"] },
    {
      stripeAccount: StripeAccountID,
    },
  );

  const cardTransactions = {
    card_authorizations: [] as Stripe.Issuing.Authorization[],
    current_spend: 0,
    card_details: {} as Stripe.Issuing.Card,
  };
  cardTransactions["card_authorizations"] = card_authorizations.data;
  cardTransactions["current_spend"] = current_spend;
  cardTransactions["card_details"] = card_details;

  return cardTransactions;
}

export async function getAuthorizations(StripeAccountID: string) {
  const stripe = stripeClient();
  const authorizations = await stripe.issuing.authorizations.list(
    { limit: 10 },
    { stripeAccount: StripeAccountID },
  );

  return {
    authorizations,
  };
}

export async function getAuthorizationDetails(
  StripeAccountID: string,
  authorizationId: string,
) {
  const stripe = stripeClient();
  const authorization = await stripe.issuing.authorizations.retrieve(
    authorizationId,
    { stripeAccount: StripeAccountID },
  );

  return {
    authorization,
  };
}

export async function getBalance(StripeAccountID: string) {
  const stripe = stripeClient();
  const balance = await stripe.balance.retrieve({
    stripeAccount: StripeAccountID,
  });

  return {
    balance: balance,
  };
}

export async function getBalanceTransactions(
  StripeAccountID: string,
  currency: string,
) {
  const stripe = stripeClient();

  // Calculate the start and end date for the last 7 days
  const endDate = new Date();
  const startDate = addDays(endDate, -NUMBER_OF_DAYS + 1);

  const balanceTransactions = await stripe.balanceTransactions.list(
    {
      created: {
        gte: Math.floor(startDate.getTime() / 1000), // Convert to seconds
        lte: Math.floor(endDate.getTime() / 1000), // Convert to seconds
      },
      limit: 100,
    },
    { stripeAccount: StripeAccountID },
  );

  const datesArray: string[] = Array.from(
    { length: NUMBER_OF_DAYS },
    (_, index) => {
      const date = addDays(endDate, -index);
      return format(date, DATE_FORMAT);
    },
  );

  const fundsFlowByDate: { [formattedDate: string]: FundsFlowByDate } =
    datesArray.reduce(
      (dates, formattedDate) => {
        dates[formattedDate] = {
          date: formattedDate,
          fundsIn: 0,
          fundsOut: 0,
        };
        return dates;
      },
      {} as { [formattedDate: string]: FundsFlowByDate },
    );

  const transactionList: Stripe.BalanceTransaction[] = [];

  balanceTransactions.data.forEach(function (
    transaction: Stripe.BalanceTransaction,
  ) {
    const date = new Date(transaction.created * 1000);
    const formattedDate = format(date, DATE_FORMAT);
    const amount = Math.abs(transaction.amount) / 100;
    const type = transaction.type;

    if (
      !(
        type == "issuing_authorization_release" ||
        type == "issuing_authorization_hold"
      )
    ) {
      if (fundsFlowByDate.hasOwnProperty(formattedDate)) {
        if (transaction.amount > 0) {
          fundsFlowByDate[formattedDate].fundsIn += amount;
        } else {
          fundsFlowByDate[formattedDate].fundsOut += amount;
        }
      }

      transactionList.push(transaction);
    }
  });

  const fundsInArray: number[] = datesArray.map(
    (formattedDate) => fundsFlowByDate[formattedDate].fundsIn,
  );
  const fundsOutArray: number[] = datesArray.map(
    (formattedDate) => fundsFlowByDate[formattedDate].fundsOut,
  );

  // Reverse the arrays
  datesArray.reverse();
  fundsInArray.reverse();
  fundsOutArray.reverse();

  const balanceTransactionsChart: BalanceChartData = {
    currency: currency,
    balanceTransactionsDates: datesArray,
    balanceTransactionsFundsIn: fundsInArray,
    balanceTransactionsFundsOut: fundsOutArray,
  };

  return {
    balanceTransactions: transactionList,
    balanceFundsFlowChartData: balanceTransactionsChart,
  };
}

export type FinancialAddress = {
  type: "iban" | "sort_code";
  supported_networks: string[];
  iban?: {
    account_holder_name: string;
    bic: string;
    country: string;
    iban: string;
  };
  sort_code?: {
    account_holder_name: string;
    account_number: string;
    sort_code: string;
  };
};

export type FundingInstructions = {
  currency: string;
  funding_type: string;
  livemode: boolean;
  object: string;
  bank_transfer: {
    country: string;
    type: string;
    financial_addresses: FinancialAddress[];
  };
};

export async function createFundingInstructions(
  accountId: string,
  country: string,
  currency: string,
): Promise<FundingInstructions> {
  const bankTransferType =
    country == "GB" ? "gb_bank_transfer" : "eu_bank_transfer";
  const data = {
    currency: currency as string,
    funding_type: "bank_transfer",
    "bank_transfer[type]": bankTransferType,
  };

  // using fetch, because this API is not yet supported in the Node.js libary
  const response = await fetch(
    "https://api.stripe.com/v1/issuing/funding_instructions",
    {
      method: "POST",
      headers: {
        "Stripe-Account": accountId,
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + process.env.STRIPE_SECRET_KEY,
      },
      body: new URLSearchParams(data),
    },
  );
  const responseBody = await response.json();
  return responseBody;
}

const TREASURY_SUPPORTED_COUNTRIES = ["US"];

export const treasurySupported = (country: string): boolean =>
  TREASURY_SUPPORTED_COUNTRIES.includes(country);
