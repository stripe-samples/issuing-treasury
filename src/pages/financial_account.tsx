import {parse} from 'cookie';
import React from 'react';

import FaAccountInfoWidget from '../components/Stripe/FaAccountInfoWidget';
import FaBalanceWidget from '../components/Stripe/FaBalanceWidget';
import FaSendMoneyWidget from '../components/Stripe/FaSendMoneyWidget';
import FaTransactionsExtendedWidget from '../components/Stripe/FaTransactionsExtendedWidget';
import {decode} from '../utils/jwt_encode_decode';
import {
  getFinancialAccountDetailsExp,
  getFinancialAccountTransactionsExpanded,
} from '../utils/stripe_helpers';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function getServerSideProps(context: any) {
  if ('cookie' in context.req.headers) {
    const cookie = parse(context.req.headers.cookie);
    if ('app_auth' in cookie) {
      const session = decode(cookie.app_auth);
      if (session.requiresOnboarding === true) {
        return {
          redirect: {
            destination: '/onboard',
          },
        };
      }
      const StripeAccountID = session.accountId;
      const responseFaDetails = await getFinancialAccountDetailsExp(
        StripeAccountID
      );
      const financialAccount = responseFaDetails.financialaccount;
      const responseFaTransactions =
        await getFinancialAccountTransactionsExpanded(StripeAccountID);
      const faTransactions = responseFaTransactions.fa_transactions;
      return {
        props: {financialAccount, faTransactions}, // will be passed to the page component as props
      };
    }
  }
  return {
    redirect: {
      destination: '/signin',
    },
  };
}

const FinancialAccountDetails = (props: any) => {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 p-6">
        <div className="flex justify-end">
          <FaAccountInfoWidget financialAccount={props.financialAccount} />
          <FaSendMoneyWidget />
        </div>
      </div>
      <FaBalanceWidget financialAccount={props.financialAccount} />
      <FaTransactionsExtendedWidget faTransactions={props.faTransactions} />
    </div>
  );
};

export default FinancialAccountDetails;