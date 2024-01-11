import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
import { OverviewFinancialAccountBalance } from "src/sections/overview/overview-fa-balance";
import { OverviewFinancialAccountFundsFlowChart } from "src/sections/overview/overview-fa-funds-flow-chart";
import { OverviewFinancialAccountOutboundPending } from "src/sections/overview/overview-fa-outbound-pending";
import { OverviewLatestTransactions } from "src/sections/overview/overview-latest-transactions";
import TestDataCreateReceivedCredit from "src/sections/test-data/test-data-create-received-credit";
import { ChartData } from "src/types/chart-data";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import {
  getFinancialAccountDetails,
  getFinancialAccountTransactionDetails,
  getFinancialAccountTransactionsExpanded,
} from "src/utils/stripe_helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount } = session;

  const responseFaDetails = await getFinancialAccountDetails(stripeAccount);
  const financialAccount = responseFaDetails.financialaccount;

  const faFundsFlowChartDataResult =
    await getFinancialAccountTransactionDetails(stripeAccount);
  const faFundsFlowChartData = faFundsFlowChartDataResult.faFundsFlowChartData;

  const responseFaTransations =
    await getFinancialAccountTransactionsExpanded(stripeAccount);
  const faTransactions = responseFaTransations.fa_transactions;

  return {
    props: { financialAccount, faFundsFlowChartData, faTransactions },
  };
};

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
      <FloatingTestPanel title="Simulate a received credit">
        <TestDataCreateReceivedCredit financialAccount={financialAccount} />
      </FloatingTestPanel>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
