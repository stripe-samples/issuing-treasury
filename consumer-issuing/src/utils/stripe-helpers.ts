import { format, addDays } from "date-fns";
import Stripe from "stripe";
import { Session } from "next-auth";

import { getStripeSecretKey } from "./stripe-authentication";
import { logApiRequest } from "./api-logger";

import { BalanceChartData } from "src/types/chart-data";
import { StripeAccount, PlatformStripeAccount } from "src/utils/account-management-helpers";
import stripeClient from "src/utils/stripe-loader";

type FundsFlowByDate = {
  date: string;
  fundsIn: number;
  fundsOut: number;
};

const NUMBER_OF_DAYS = 90;
const DATE_FORMAT = "MMM dd";

export async function getCardholders(stripeAccount: StripeAccount) {
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);
  const cardholders = await stripe.issuing.cardholders.list(
    { limit: 100 },
    { stripeAccount: accountId },
  );

  return {
    cardholders: cardholders,
  };
}

export async function getCards(stripeAccount: StripeAccount) {
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);
  const cards = await stripe.issuing.cards.list(
    { limit: 100 },
    { stripeAccount: accountId },
  );

  return {
    cards: cards,
  };
}

export async function getCardDetails(
  stripeAccount: StripeAccount,
  cardId: string,
) {
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);
  // Retrieve last 10 authorizations
  const card_authorizations = await stripe.issuing.authorizations.list(
    {
      card: cardId,
      limit: 10,
    },
    { stripeAccount: accountId },
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
      stripeAccount: accountId,
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

export async function getAuthorizations(stripeAccount: StripeAccount) {
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);
  const authorizations = await stripe.issuing.authorizations.list(
    { limit: 10 },
    { stripeAccount: accountId },
  );

  return {
    authorizations,
  };
}

export async function getAuthorizationDetails(
  stripeAccount: StripeAccount,
  authorizationId: string,
) {
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);
  const authorization = await stripe.issuing.authorizations.retrieve(
    authorizationId,
    { stripeAccount: accountId },
  );

  return {
    authorization,
  };
}

export async function getBalance(stripeAccount: StripeAccount, session: Session) {
  const { accountId, platform } = stripeAccount;

  // Get the credit ledger data using direct HTTP request
  const creditLedgerResponse = await fetch("https://api.stripe.com/v1/issuing/credit_ledger", {
    method: "GET",
    headers: {
      "Stripe-Account": accountId,
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + getStripeSecretKey(platform),
      "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
    },
  });

  // Log the API request
  await logApiRequest(
    session.email,
    "https://api.stripe.com/v1/issuing/credit_ledger",
    "GET",
    null,
    await creditLedgerResponse.clone().json()
  );

  if (!creditLedgerResponse.ok) {
    return {
      balance: {
        issuing: {
          available: [{
            amount: 0,
            currency: "usd"
          }],
          credit_limit: [{
            amount: 0,
            currency: "usd"
          }],
          total_balance: [{
            amount: 0,
            currency: "usd"
          }]
        }
      }
    };
  }

  const creditLedger = await creditLedgerResponse.json();
  const totalBalance = (creditLedger.obligations?.unpaid || 0) + (creditLedger.obligations?.accruing || 0);

  // Create a balance object that matches the expected structure
  const balance = {
    issuing: {
      available: [{
        amount: creditLedger.credit_available || 0,
        currency: creditLedger.currency || "usd",
      }],
      credit_limit: [{
        amount: creditLedger.credit_limit || 0,
        currency: creditLedger.currency || "usd",
      }],
      total_balance: [{
        amount: totalBalance,
        currency: creditLedger.currency || "usd",
      }]
    },
  };

  return {
    balance: balance,
  };
}

export async function getCreditLedgerEntries(
  stripeAccount: StripeAccount,
  currency: string,
  session: Session
) {
  const { accountId, platform } = stripeAccount;

  // Calculate the start and end date for the last 7 days
  const endDate = new Date();
  const startDate = addDays(endDate, -NUMBER_OF_DAYS + 1);

  // Make direct API call to credit ledger entries endpoint with limit parameter
  const response = await fetch(
    "https://api.stripe.com/v1/issuing/credit_ledger_entries?limit=100",
    {
      method: "GET",
      headers: {
        "Stripe-Account": accountId,
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + getStripeSecretKey(platform),
        "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
      },
    }
  );

  // Log the API request
  await logApiRequest(
    session.email,
    "https://api.stripe.com/v1/issuing/credit_ledger_entries",
    "GET",
    null,
    await response.clone().json()
  );

  // await logApiRequest(
  //   stripeAccount.userId,
  //   "https://api.stripe.com/v1/issuing/credit_ledger_entries",
  //   "GET",
  //   null,
  //   await response.clone().json()
  // );

  if (!response.ok) {
    throw new Error(`Failed to fetch credit ledger entries: ${response.statusText}`);
  }

  const creditLedgerEntries = await response.json();
  // console.log('Retrieving Credit Ledger Data from https://api.stripe.com/v1/issuing/credit_ledger_entries:', JSON.stringify(creditLedgerEntries, null, 2));

  // Include only credit ledger entries for issuing_credit_repayments with non-null funding_obligation
  const filteredEntries = creditLedgerEntries.data.filter((entry: any) => {
    if (entry.source?.type === "issuing_credit_repayment" && entry.source?.issuing_credit_repayment) {
      return entry.funding_obligation;
    }
    return true;
  });

  const datesArray: string[] = Array.from(
    { length: NUMBER_OF_DAYS },
    (_, index) => {
      const date = addDays(endDate, -index);
      return format(date, DATE_FORMAT);
    },
  );

  const transactionList: any[] = [];

  // Group entries by source
  const entriesBySource: { [source: string]: any[] } = {};
  filteredEntries.forEach((entry: any) => {
    const sourceKey = entry.source ? JSON.stringify(entry.source) : 'unknown';
    if (!entriesBySource[sourceKey]) {
      entriesBySource[sourceKey] = [];
    }
    entriesBySource[sourceKey].push(entry);
  });

  // Process each group of entries
  Object.values(entriesBySource).forEach((entries) => {
    // Calculate total amount for the group
    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
    
    // Skip groups with zero total
    if (totalAmount === 0) {
      return;
    }

    // Use the latest entry's date and metadata, but with the summed amount
    const latestEntry = entries[entries.length - 1];
    const processedEntry = {
      ...latestEntry,
      amount: totalAmount
    };
    transactionList.push(processedEntry);
  });

  // Fetch all transactions and authorizations in bulk
  const stripe = stripeClient(platform);
  const [transactionsResponse, authorizationsResponse] = await Promise.all([
    stripe.issuing.transactions.list(
      { limit: 100 },
      { stripeAccount: accountId }
    ),
    stripe.issuing.authorizations.list(
      { limit: 100 },
      { stripeAccount: accountId }
    )
  ]);

  // Create lookup maps for quick access
  const transactionsMap = new Map(
    transactionsResponse.data.map(t => [t.id, t])
  );
  const authorizationsMap = new Map(
    authorizationsResponse.data.map(a => [a.id, a])
  );

  // Process transactions with the bulk-fetched data
  for (const transaction of transactionList) {
    if (transaction.source?.type === "issuing_authorization" && transaction.source?.issuing_authorization) {
      const auth = authorizationsMap.get(transaction.source.issuing_authorization);
      if (auth) {
        transaction.auth = auth;
      }
    } else if (transaction.source?.type === "issuing_credit_repayment" && transaction.source?.issuing_credit_repayment) {
      try {
        const response = await fetch(
          `https://api.stripe.com/v1/issuing/credit_repayments/${transaction.source.issuing_credit_repayment}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getStripeSecretKey(platform)}`,
              "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
            }
          }
        );

        // Log the credit repayment request
        await logApiRequest(
          session.email,
          `https://api.stripe.com/v1/issuing/credit_repayments/${transaction.source.issuing_credit_repayment}`,
          "GET",
          null,
          await response.clone().json()
        );

        if (response.ok) {
          const creditRepayment = await response.json();
          transaction.creditRepayment = creditRepayment;
        }
      } catch (error) {
        console.error('Failed to fetch credit repayment details:', error);
      }
    } else if (transaction.source?.type === "issuing_transaction" && transaction.source?.issuing_transaction) {
      const issuingTransaction = transactionsMap.get(transaction.source.issuing_transaction);
      if (issuingTransaction) {
        transaction.transaction = issuingTransaction;
        
        // If the transaction has an authorization, get it from our map
        if (issuingTransaction.authorization && typeof issuingTransaction.authorization === 'string') {
          const auth = authorizationsMap.get(issuingTransaction.authorization);
          if (auth) {
            transaction.auth = auth;
          }
        }
      }
    } else if (transaction.source?.type === "issuing_credit_ledger_adjustment" && transaction.source?.issuing_credit_ledger_adjustment) {
      try {
        const response = await fetch(
          `https://api.stripe.com/v1/issuing/credit_ledger_adjustments/${transaction.source.issuing_credit_ledger_adjustment}`,
          {
            method: "GET",
            headers: {
              "Stripe-Account": accountId,
              Authorization: `Bearer ${getStripeSecretKey(platform)}`,
              "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
            }
          }
        );

        // Log the credit ledger adjustment request
        await logApiRequest(
          session.email,
          `https://api.stripe.com/v1/issuing/credit_ledger_adjustments/${transaction.source.issuing_credit_ledger_adjustment}`,
          "GET",
          null,
          await response.clone().json()
        );

        if (response.ok) {
          const creditLedgerAdjustment = await response.json();
          transaction.creditLedgerAdjustment = creditLedgerAdjustment;
        }
      } catch (error) {
        console.error('Failed to fetch credit ledger adjustment details:', error);
      }
    }
  }

  // Initialize funds flow data
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

  // Process transactions to build funds flow data
  transactionList.forEach((transaction) => {
    const date = new Date(transaction.created * 1000);
    const formattedDate = format(date, DATE_FORMAT);
    const amount = Math.abs(transaction.amount);

    if (fundsFlowByDate.hasOwnProperty(formattedDate)) {
      if (transaction.amount > 0) {
        fundsFlowByDate[formattedDate].fundsIn += amount;
      } else {
        fundsFlowByDate[formattedDate].fundsOut += amount;
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

  const balanceTransactionsChart: BalanceChartData = {
    currency: currency,
    balanceTransactionsDates: datesArray,
    balanceTransactionsFundsIn: fundsInArray,
    balanceTransactionsFundsOut: fundsOutArray,
  };
  const result = {
    balanceTransactions: transactionList,
    balanceFundsFlowChartData: balanceTransactionsChart,
  };

  return result;
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
  stripeAccount: StripeAccount,
  country: string,
  currency: string,
): Promise<FundingInstructions> {
  const { accountId, platform } = stripeAccount;
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
        Authorization: "Bearer " + getStripeSecretKey(platform),
      },
      body: new URLSearchParams(data),
    },
  );
  const responseBody = await response.json();
  return responseBody;
}
