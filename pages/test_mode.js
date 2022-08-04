import React from 'react';
import PaymentLinkCreate from '../components/Stripe/TestModePaymentLinkCreateWidget.js';
import ReceivedCreditCreate from '../components/Stripe/TestModeReceivedCreditCreateWidget.js';
import PayoutWidget from '../components/Stripe/TestModePayouts.js';
import {decode} from '../utils/jwt_encode_decode';
import {parse} from 'cookie';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function getServerSideProps(context) {
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

      const responseAccount = await stripe.accounts.retrieve(StripeAccountID);
      const accountExternalAccount = responseAccount.external_accounts.data[0];

      const responseBalance = await stripe.balance.retrieve({
        stripeAccount: StripeAccountID,
      });
      const availableBalance = responseBalance.available[0].amount;

      let hasExternalAccount = false;

      if (accountExternalAccount) {
        hasExternalAccount = true;
      }
      return {
        props: {hasExternalAccount, availableBalance}, // will be passed to the page component as props
      };
    }
  }
  return {
    redirect: {
      destination: '/signin',
    },
  };
}

const TestMode = (props) => {
  return (
    <div>
      <ReceivedCreditCreate />
      <PaymentLinkCreate />
      <PayoutWidget
        hasExternalAccount={props.hasExternalAccount}
        availableBalance={props.availableBalance}
      />
    </div>
  );
};

export default TestMode;
