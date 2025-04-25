import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
import { OverviewBalanceFundsFlowChart } from "src/sections/overview/overview-balance-funds-flow-chart";
import { OverviewCreditStatement } from "src/sections/overview/overview-credit-limit";
import { OverviewIssuingBalance } from "src/sections/overview/overview-issuing-balance";
import { OverviewLatestBalanceTransactions } from "src/sections/overview/overview-latest-balance-transactions";
import { OverviewAvailableBalance } from "src/sections/overview/overview-payments-balance";
import TestDataTopUpIssuingBalance from "src/sections/test-data/test-data-create-issuing-topup";
import { BalanceChartData } from "src/types/chart-data";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import { getBalance, getCreditLedgerEntries } from "src/utils/stripe-helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount, currency } = session;

  let issuingBalance = null;
  let availableBalance = null;
  let creditLedgerEntries = null;
  let balanceFundsFlowChartData = null;

  const responseCreditLedgerEntries = await getCreditLedgerEntries(
    stripeAccount,
    currency,
  );
  creditLedgerEntries = responseCreditLedgerEntries.balanceTransactions;
  balanceFundsFlowChartData =
    responseCreditLedgerEntries.balanceFundsFlowChartData;

  const responseAccountBalance = await getBalance(stripeAccount);
  issuingBalance = responseAccountBalance.balance.issuing;
  availableBalance = responseAccountBalance.balance;

  return {
    props: {
      issuingBalance,
      availableBalance,
      creditLedgerEntries,
      balanceFundsFlowChartData,
    },
  };
};

const IssuingBalanceStuff = ({
  issuingBalance,
  availableBalance,
  balanceFundsFlowChartData,
  creditLedgerEntries,
}: {
  issuingBalance: Stripe.Balance.Issuing;
  availableBalance: Stripe.Balance;
  creditLedgerEntries: Stripe.BalanceTransaction[];
  balanceFundsFlowChartData: BalanceChartData;
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <OverviewIssuingBalance
          sx={{ height: "100%" }}
          balance={issuingBalance}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <OverviewCreditStatement
          sx={{ height: "100%" }}
          creditLimit={1000000}
        />
      </Grid>
      <Grid item xs={12}>
        <OverviewLatestBalanceTransactions
          creditLedgerEntries={creditLedgerEntries}
        />
      </Grid>
      <Grid item xs={12}>
        <OverviewBalanceFundsFlowChart
          balanceFundsFlowChartData={balanceFundsFlowChartData}
        />
      </Grid>
    </Grid>
  );
};

const Page = ({
  issuingBalance,
  availableBalance,
  creditLedgerEntries,
  balanceFundsFlowChartData,
}: {
  issuingBalance: Stripe.Balance.Issuing;
  availableBalance: Stripe.Balance;
  creditLedgerEntries: Stripe.BalanceTransaction[];
  balanceFundsFlowChartData: BalanceChartData;
}) => {
  const BalanceWidget = (() => {
    return IssuingBalanceStuff({
      issuingBalance,
      availableBalance,
      creditLedgerEntries,
      balanceFundsFlowChartData,
    });
  })();

  const TestDataGenerationPanel = (() => {
    return (
      <FloatingTestPanel title="Simulate Issuing Balance Funding">
        <TestDataTopUpIssuingBalance />
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
