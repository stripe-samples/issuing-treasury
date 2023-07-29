import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { JwtPayload } from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import DashboardLayout from "../layouts/dashboard/layout";
import { withAuthRequiringOnboarded } from "../middleware/auth-middleware";
import { OverviewFinancialAccountBalance } from "../sections/overview/overview-fa-balance";
import { OverviewFinancialAccountFundsFlowChart } from "../sections/overview/overview-fa-funds-flow-chart";
import { OverviewFinancialAccountOutboundPending } from "../sections/overview/overview-fa-outbound-pending";
import { OverviewLatestTransactions } from "../sections/overview/overview-latest-transactions";
import { ChartData } from "../types/chart-data";
import {
  getFinancialAccountDetails,
  getFinancialAccountTransactionDetails,
  getFinancialAccountTransactionsExpanded,
} from "../utils/stripe_helpers";

export const getServerSideProps = withAuthRequiringOnboarded(
  async (context: GetServerSidePropsContext, session: JwtPayload) => {
    const StripeAccountID = session.accountId;

    const responseFaDetails = await getFinancialAccountDetails(StripeAccountID);
    const financialAccount = responseFaDetails.financialaccount;

    const faFundsFlowChartDataResult =
      await getFinancialAccountTransactionDetails(StripeAccountID);
    const faFundsFlowChartData =
      faFundsFlowChartDataResult.faFundsFlowChartData;

    const responseFaTransations = await getFinancialAccountTransactionsExpanded(
      StripeAccountID,
    );
    const faTransactions = responseFaTransations.fa_transactions;

    return {
      props: { financialAccount, faFundsFlowChartData, faTransactions },
    };
  },
);

const Page = ({
  financialAccount,
  faFundsFlowChartData,
  faTransactions,
}: {
  financialAccount: Stripe.Treasury.FinancialAccount;
  faFundsFlowChartData: ChartData;
  faTransactions: Stripe.Treasury.Transaction[];
}) => {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <OverviewFinancialAccountBalance
                sx={{ height: "100%" }}
                value={financialAccount.balance.cash.usd}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <OverviewFinancialAccountOutboundPending
                sx={{ height: "100%" }}
                value={financialAccount.balance.outbound_pending.usd}
              />
            </Grid>
            <Grid item xs={12}>
              <OverviewFinancialAccountFundsFlowChart
                faFundsFlowChartData={faFundsFlowChartData}
              />
            </Grid>
            <Grid item xs={12}>
              <OverviewLatestTransactions faTransactions={faTransactions} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
