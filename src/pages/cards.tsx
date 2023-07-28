import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import CardsWidget from "../components/Stripe/CardsWidget";
import DashboardLayout from "../layouts/dashboard/layout";
import { withAuthRequiringOnboarded } from "../middleware/auth-middleware";
import JwtPayload from "../types/jwt-payload";
import { getCards } from "../utils/stripe_helpers";

export const getServerSideProps = withAuthRequiringOnboarded(
  async (context: GetServerSidePropsContext, session: JwtPayload) => {
    const StripeAccountID = session.accountId;
    const responseCards = await getCards(StripeAccountID);
    return {
      props: { cards: responseCards.cards.data, account: StripeAccountID },
    };
  },
);

const Page = ({ cards }: { cards: Stripe.Issuing.Card[] }) => {
  return (
    <>
      <CardsWidget cards={cards} />
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
