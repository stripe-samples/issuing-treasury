import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import FaAccountInfoWidget from "../components/Stripe/FaAccountInfoWidget";
import FaSendMoneyWidget from "../components/Stripe/FaSendMoneyWidget";
import FaTransactionsExtendedWidget from "../components/Stripe/FaTransactionsExtendedWidget";
import DashboardLayout from "../layouts/dashboard/layout";
import { withAuthRequiringOnboarded } from "../middleware/auth-middleware";
import JwtPayload from "../types/jwt-payload";
import {
  getFinancialAccountDetailsExp,
  getFinancialAccountTransactionsExpanded,
} from "../utils/stripe_helpers";

export const getServerSideProps = withAuthRequiringOnboarded(
  async (context: GetServerSidePropsContext, session: JwtPayload) => {
    const StripeAccountID = session.accountId;

    const responseFaDetails = await getFinancialAccountDetailsExp(
      StripeAccountID,
    );
    const financialAccount = responseFaDetails.financialaccount;
    const responseFaTransactions =
      await getFinancialAccountTransactionsExpanded(StripeAccountID);
    const faTransactions = responseFaTransactions.fa_transactions;
    return {
      props: { financialAccount, faTransactions },
    };
  },
);

const Page = ({
  financialAccount,
  faTransactions,
}: {
  financialAccount: Stripe.Treasury.FinancialAccount;
  faTransactions: Stripe.Treasury.Transaction[];
}) => {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 p-6">
        <div className="flex justify-end">
          <FaAccountInfoWidget financialAccount={financialAccount} />
          <FaSendMoneyWidget />
        </div>
      </div>
      {/* <FaBalanceWidget financialAccount={financialAccount} /> */}
      <FaTransactionsExtendedWidget faTransactions={faTransactions} />
    </div>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
