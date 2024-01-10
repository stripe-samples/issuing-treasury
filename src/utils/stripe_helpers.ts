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

export const treasurySupported = (country: string): boolean => country == "US";
