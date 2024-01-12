import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
import { OverviewAvailableBalance } from "src/sections/overview/overview-acquring-balance";
import { OverviewBalanceFundsFlowChart } from "src/sections/overview/overview-balance-funds-flow-chart";
import { OverviewFinancialAccountBalance } from "src/sections/overview/overview-fa-balance";
import { OverviewFinancialAccountFundsFlowChart } from "src/sections/overview/overview-fa-funds-flow-chart";
import { OverviewFinancialAccountOutboundPending } from "src/sections/overview/overview-fa-outbound-pending";
import { OverviewIssuingBalance } from "src/sections/overview/overview-issuing-balance";
import { OverviewLatestBalanceTransactions } from "src/sections/overview/overview-latest-balance-transactions";
import { OverviewLatestTransactions } from "src/sections/overview/overview-latest-transactions";
import TestDataTopUpIssuingBalance from "src/sections/test-data/test-data-create-issuing-topup";
import TestDataCreateReceivedCredit from "src/sections/test-data/test-data-create-received-credit";
import { ChartData, BalanceChartData } from "src/types/chart-data";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import {
  getFinancialAccountDetails,
  getFinancialAccountTransactionDetails,
  getFinancialAccountTransactionsExpanded,
  getBalance,
  getBalanceTransactions,
  treasurySupported,
} from "src/utils/stripe_helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount, country, currency } = session;

  let financialAccount = null;
  let faFundsFlowChartData = null;
  let faTransactions = null;
  let issuingBalance = null;
  let availableBalance = null;
  let balanceTransactions = null;
  let balanceFundsFlowChartData = null;

  if (treasurySupported(country)) {
    const responseFaDetails = await getFinancialAccountDetails(stripeAccount);
    financialAccount = responseFaDetails.financialaccount;

    const faFundsFlowChartDataResult =
      await getFinancialAccountTransactionDetails(stripeAccount);
    faFundsFlowChartData = faFundsFlowChartDataResult.faFundsFlowChartData;

    const responseFaTransations =
      await getFinancialAccountTransactionsExpanded(stripeAccount);
    faTransactions = responseFaTransations.fa_transactions;
  } else {
    const responseBalanceTransactions = await getBalanceTransactions(
      stripeAccount,
      currency,
    );
    balanceTransactions = responseBalanceTransactions.balanceTransactions;
    balanceFundsFlowChartData =
      responseBalanceTransactions.balanceFundsFlowChartData;

    const responseAccountBalance = await getBalance(stripeAccount);
    issuingBalance = responseAccountBalance.balance.issuing;
    availableBalance = responseAccountBalance.balance;
  }

  return {
    props: {
      financialAccount,
      faFundsFlowChartData,
      faTransactions,
      issuingBalance,
      availableBalance,
      balanceTransactions,
      balanceFundsFlowChartData,
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

const IssuingBalanceStuff = ({
  issuingBalance,
  availableBalance,
  balanceFundsFlowChartData,
  balanceTransactions,
}: {
  issuingBalance: Stripe.Balance.Issuing;
  availableBalance: Stripe.Balance;
  balanceFundsFlowChartData: BalanceChartData;
  balanceTransactions: Stripe.BalanceTransaction[];
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <OverviewAvailableBalance
          sx={{ height: "100%" }}
          balance={availableBalance.available[0]}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <OverviewIssuingBalance
          sx={{ height: "100%" }}
          balance={issuingBalance.available[0]}
        />
      </Grid>
      <Grid item xs={12}>
        <OverviewBalanceFundsFlowChart
          balanceFundsFlowChartData={balanceFundsFlowChartData}
        />
      </Grid>

      <Grid item xs={12}>
        <OverviewLatestBalanceTransactions
          balanceTransactions={balanceTransactions}
        />
      </Grid>
    </Grid>
  );
};

const Page = ({
  financialAccount,
  faFundsFlowChartData,
  faTransactions,
  issuingBalance,
  availableBalance,
  balanceFundsFlowChartData,
  balanceTransactions,
}: {
  financialAccount: Stripe.Treasury.FinancialAccount;
  faFundsFlowChartData: ChartData;
  faTransactions: Stripe.Treasury.Transaction[];
  issuingBalance: Stripe.Balance.Issuing;
  availableBalance: Stripe.Balance;
  balanceFundsFlowChartData: BalanceChartData;
  balanceTransactions: Stripe.BalanceTransaction[];
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
          {financialAccount
            ? FinancialAccountStuff({
                financialAccount,
                faFundsFlowChartData,
                faTransactions,
              })
            : IssuingBalanceStuff({
                issuingBalance,
                availableBalance,
                balanceFundsFlowChartData,
                balanceTransactions,
              })}
        </Container>
      </Box>

      {financialAccount ? (
        <FloatingTestPanel title="Simulate a received credit">
          <TestDataCreateReceivedCredit financialAccount={financialAccount} />
        </FloatingTestPanel>
      ) : (
        <FloatingTestPanel title="Simulate Issuing Balance Funding">
          <TestDataTopUpIssuingBalance />
        </FloatingTestPanel>
      )}
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
