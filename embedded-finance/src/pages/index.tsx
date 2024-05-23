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
} from "src/utils/stripe-helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount } = session;

  let financialAccount = null;
  let faFundsFlowChartData = null;
  let faTransactions = null;

  const responseFaDetails = await getFinancialAccountDetails(stripeAccount);
  financialAccount = responseFaDetails.financialaccount;

  const faFundsFlowChartDataResult =
    await getFinancialAccountTransactionDetails(stripeAccount);
  faFundsFlowChartData = faFundsFlowChartDataResult.faFundsFlowChartData;

  const responseFaTransations =
    await getFinancialAccountTransactionsExpanded(stripeAccount);
  faTransactions = responseFaTransations.fa_transactions;

  return {
    props: {
      financialAccount,
      faFundsFlowChartData,
      faTransactions,
    },
  };
};

const FinancialAccountStuff = ({
  financialAccount,
  faFundsFlowChartData,
  faTransactions,
}: {
  financialAccount: Stripe.Treasury.FinancialAccount;
  faFundsFlowChartData: ChartData;
  faTransactions: Stripe.Treasury.Transaction[];
}) => {
  return (
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
  );
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
  const BalanceWidget = (() => {
    return FinancialAccountStuff({
      financialAccount,
      faFundsFlowChartData,
      faTransactions,
    });
  })();

  const TestDataGenerationPanel = (() => {
    return (
      <FloatingTestPanel title="Simulate a received credit">
        <TestDataCreateReceivedCredit financialAccount={financialAccount} />
      </FloatingTestPanel>
    );
  })();

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">{BalanceWidget}</Container>
      </Box>

      {TestDataGenerationPanel}
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
