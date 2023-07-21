import React from 'react';
import CardDetailsWidget from '../../components/Stripe/CardDetailsWidget';
import IssuingAuthorizationsWidget from '../../components/Stripe/IssuingAuthorizationsWidget';
import CardStatusSwitchWidget from '../../components/Stripe/CardStatusSwitchWidget';
import {getCardTransactions} from '../../utils/stripe_helpers';
import {decode} from '../../utils/jwt_encode_decode';

import {parse} from 'cookie';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function getServerSideProps(context: any) {
  if ('cookie' in context.req.headers) {
    const cookie = parse(context.req.headers.cookie);
    if ('app_auth' in cookie) {
      const session = decode(cookie.app_auth);
      const cardId = context.params.cardId;
      const StripeAccountID = session.accountId;
      const cardTransactions = await getCardTransactions(
        StripeAccountID,
        cardId
      );

      return {
        props: {
          cardAuthorizations: cardTransactions.card_authorizations,
          CurrentSpend: cardTransactions.current_spend,
          account: StripeAccountID,
          cardId: context.params.cardId,
          cardDetails: cardTransactions.card_details,
        },
      };
    }
  }
  return {
    redirect: {
      destination: '/signin',
    },
  };
}

const CardDetails = (props: any) => {
  const stripePromise = loadStripe(
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    {
      stripeAccount: props.account,
    }
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 p-6">
      <Elements stripe={stripePromise}>
        <div className="flex justify-end">
          <CardStatusSwitchWidget
            cardStatus={props.cardDetails.status}
            cardId={props.cardId}
          />
        </div>
        <CardDetailsWidget
          accountId={props.account}
          cardId={props.cardId}
          cardDetails={props.cardDetails}
          currentSpend={props.CurrentSpend}
        />
        <IssuingAuthorizationsWidget
          cardAuthorizations={props.cardAuthorizations}
        />
      </Elements>
    </div>
  );
};

export default CardDetails;
