import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GetServerSidePropsContext } from "next";
import React from "react";

import CardDetailsWidget from "src/components/Stripe/CardDetailsWidget";
import CardStatusSwitchWidget from "src/components/Stripe/CardStatusSwitchWidget";
import IssuingAuthorizationsWidget from "src/components/Stripe/IssuingAuthorizationsWidget";
import { withAuthRequiringOnboarded } from "src/middleware/auth-middleware";
import JwtPayload from "src/types/jwt-payload";

import { getCardTransactions } from "src/utils/stripe_helpers";

export const getServerSideProps = withAuthRequiringOnboarded(
  async (context: GetServerSidePropsContext, session: JwtPayload) => {
    const cardId = context?.params?.cardId;
    const StripeAccountID = session.accountId;
    const cardTransactions = await getCardTransactions(StripeAccountID, cardId);

    return {
      props: {
        cardAuthorizations: cardTransactions.card_authorizations,
        CurrentSpend: cardTransactions.current_spend,
        account: StripeAccountID,
        cardId: context?.params?.cardId,
        cardDetails: cardTransactions.card_details,
      },
    };
  },
);

const CardDetails = (props: any) => {
  const stripePromise = loadStripe(
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    {
      stripeAccount: props.account,
    },
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
