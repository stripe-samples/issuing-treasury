const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function getFinancialAccountTransactions(StripeAccountID: any) {
  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: StripeAccountID,
  });
  const financialAccount = financialAccounts.data[0];
  const fa_transactions = await stripe.treasury.transactions.list(
    {
      financial_account: financialAccount.id,
      limit: 30,
    },
    {stripeAccount: StripeAccountID},
  );
  return {
    fa_transactions: fa_transactions.data,
  };
}


export async function getFinancialAccountTransactionsExpanded(StripeAccountID: any) {
  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: StripeAccountID,
  });
  const financialAccount = financialAccounts.data[0];
  const fa_transactions = await stripe.treasury.transactions.list(
    {
      financial_account: financialAccount.id,
      limit: 30,
      expand: ['data.flow_details'],
    }, 
    {stripeAccount: StripeAccountID},
  );
  return {
    fa_transactions: fa_transactions.data,
  };
}

export async function getFinancialAccountDetails(StripeAccountID: any) {
  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: StripeAccountID,
  });
  const financialAccount = financialAccounts.data[0];
  return {
    financialaccount: financialAccount,
  };
}

export async function getFinancialAccountDetailsExp(StripeAccountID: any) {
  const financialAccounts = await stripe.treasury.financialAccounts.list(
    {expand: ['data.financial_addresses.aba.account_number']},
    {
      stripeAccount: StripeAccountID,
    },
  );
  const financialAccount = financialAccounts.data[0];
  return {
    financialaccount: financialAccount,
  };
}

export async function getFinancialAccountTransactionDetails(StripeAccountID: any) {
  const financialAccounts = await stripe.treasury.financialAccounts.list({
    stripeAccount: StripeAccountID,
  });
  const financialAccount = financialAccounts.data[0];
  const fa_transactions = await stripe.treasury.transactions.list(
    {
      financial_account: financialAccount.id,
      limit: 100,
    },
    {stripeAccount: StripeAccountID},
  );

  //get FinancialAccount balance
  let transactions_dates = {};
  //To show a history of the balance we will start from the latest balance and apply subtract the operations
  //Get Transactions

  //Parse Transactions
  fa_transactions.data.forEach((element: any) => {
    var date = new Date(element.created * 1000);
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Date'.
    date =
      date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    //Check if date already exists as a key in the JSON object
    // @ts-expect-error TS(2345): Argument of type 'Date' is not assignable to param... Remove this comment to see the full error message
    if (transactions_dates.hasOwnProperty(date)) {
      if (element.amount > 0) {
        // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
        transactions_dates[date]['funds_in'] =
          // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
          transactions_dates[date]['funds_in'] + element.amount / 100;
      } else {
        // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
        transactions_dates[date]['funds_out'] =
          // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
          transactions_dates[date]['funds_out'] +
          Math.abs(element.amount) / 100;
      }
    } else {
      //Initialize the key, only update balance when adding the day as this is the ending balance
      // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
      transactions_dates[date] = {
        funds_in: 0,
        funds_out: 0,
      };
      //Populate the funds_in and funds_out values
      if (element.amount > 0) {
        // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
        transactions_dates[date]['funds_in'] =
          // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
          transactions_dates[date]['funds_in'] + element.amount / 100;
      } else {
        //We are calculating the total funds out by using its absolute value so we can stack and compare
        // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
        transactions_dates[date]['funds_out'] =
          // @ts-expect-error TS(2538): Type 'Date' cannot be used as an index type.
          transactions_dates[date]['funds_out'] +
          Math.abs(element.amount) / 100;
      }
    }
  });
  //Initialize chart arrays
  let dates_array: any = [];
  let funds_in_array: any = [];
  let funds_out_array: any = [];

  if (Object.keys(transactions_dates).length === 0) {
    //If the transactions_dates object is empty populate arrays with 0
    dates_array.push('0');
    funds_in_array.push('0');
    funds_out_array.push('0');
  } else {
    Object.keys(transactions_dates).forEach(function (key) {
      dates_array.push(key);
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      funds_in_array.push(transactions_dates[key].funds_in);
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      funds_out_array.push(transactions_dates[key].funds_out);
    });
    dates_array = dates_array.reverse();
    funds_in_array = funds_in_array.reverse();
    funds_out_array = funds_out_array.reverse();
    //If there are multiple days, remove first element to ensure we have the whole day balance, else we could have partial operations for the day
    if (dates_array.length > 1) {
      dates_array.shift();
      funds_in_array.shift();
      funds_out_array.shift();
    }
  }

  const faTransactions_chart = {
    faTransactionsDates: dates_array,
    faTransactionsFundsIn: funds_in_array,
    faTransactionsFundsOut: funds_out_array,
  };
  return {
    faTransactions_chart: faTransactions_chart,
  };
}

export async function getCardholders(StripeAccountID: any) {
  const cardholders = await stripe.issuing.cardholders.list(
    {limit: 10},
    {stripeAccount: StripeAccountID},
  );
  const cards = await stripe.issuing.cards.list(
    {limit: 10},
    {stripeAccount: StripeAccountID},
  );

  return {
    cardholders: cardholders,
  };
}

export async function getCards(StripeAccountID: any) {
  const cards = await stripe.issuing.cards.list(
    {limit: 10},
    {stripeAccount: StripeAccountID},
  );

  return {
    cards: cards,
  };
}

export async function getCardTransactions(StripeAccountID: any, cardId: any) {
  const today = Math.trunc(new Date().setHours(0, 0) / 1000);

  //Retrieve last 10 authorizations
  const card_authorizations = await stripe.issuing.authorizations.list(
    {
      card: cardId,
      limit: 10,
    },
    {stripeAccount: StripeAccountID},
  );

  //Calculate current spend
  let current_spend = 0;

  card_authorizations.data.forEach(function (authorization: any) {
    //Validate the authorization was approved before adding it to the total spend
    if (authorization.approved == true) {
      current_spend = current_spend + authorization.amount;
    }
  });

  if (current_spend > 0) {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
    current_spend = (current_spend / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  } else {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
    current_spend = current_spend.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  let card_details = await stripe.issuing.cards.retrieve(
    cardId,
    {expand: ['cardholder']},
    {
      stripeAccount: StripeAccountID,
    },
  );
  let cardTransactions = {};
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  cardTransactions['card_authorizations'] = card_authorizations.data;
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  cardTransactions['current_spend'] = current_spend;
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  cardTransactions['card_details'] = card_details;

  return cardTransactions;
}

export async function createAccountOnboardingUrl(accountId: any, host: any) {
  const {url} = await stripe.accountLinks.create({
    type: 'account_onboarding',
    account: accountId,
    refresh_url: host + '/onboard',
    return_url: host + '/onboard',
  });
  return url;
}
