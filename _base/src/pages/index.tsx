import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
import { OverviewBalanceFundsFlowChart } from "src/sections/overview/overview-balance-funds-flow-chart";
import { OverviewFinancialAccountBalance } from "src/sections/overview/overview-fa-balance";
import { OverviewFinancialAccountFundsFlowChart } from "src/sections/overview/overview-fa-funds-flow-chart";
import { OverviewFinancialAccountOutboundPending } from "src/sections/overview/overview-fa-outbound-pending";
import { OverviewIssuingBalance } from "src/sections/overview/overview-issuing-balance";
import { OverviewLatestBalanceTransactions } from "src/sections/overview/overview-latest-balance-transactions";
import { OverviewLatestTransactions } from "src/sections/overview/overview-latest-transactions";
import { OverviewAvailableBalance } from "src/sections/overview/overview-payments-balance";
import TestDataTopUpIssuingBalance from "src/sections/test-data/test-data-create-issuing-topup";
import TestDataCreateReceivedCredit from "src/sections/test-data/test-data-create-received-credit";
import { ChartData, BalanceChartData } from "src/types/chart-data";
import FinancialProduct from "src/types/financial-product";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import {
  getFinancialAccountDetails,
  getFinancialAccountTransactionDetails,
  getFinancialAccountTransactionsExpanded,
  getBalance,
  getBalanceTransactions,
} from "src/utils/stripe-helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const {
    stripeAccount,
    // @begin-exclude-from-subapps
    financialProduct,
    // @end-exclude-from-subapps
    // @if financialProduct==expense-management
    currency,
    // @endif
  } = session;

  // @if financialProduct==embedded-finance
  let financialAccount = null;
  let faFundsFlowChartData = null;
  let faTransactions = null;
  // @endif
  // @if financialProduct==expense-management
  let issuingBalance = null;
  let availableBalance = null;
  let balanceTransactions = null;
  let balanceFundsFlowChartData = null;
  // @endif

  // @begin-exclude-from-subapps
  if (financialProduct == FinancialProduct.EmbeddedFinance) {
    // @end-exclude-from-subapps
    // @if financialProduct==embedded-finance
    const responseFaDetails = await getFinancialAccountDetails(stripeAccount);
    financialAccount = responseFaDetails.financialaccount;

    const faFundsFlowChartDataResult =
      await getFinancialAccountTransactionDetails(stripeAccount);
    faFundsFlowChartData = faFundsFlowChartDataResult.faFundsFlowChartData;

    const responseFaTransations =
      await getFinancialAccountTransactionsExpanded(stripeAccount);
    faTransactions = responseFaTransations.fa_transactions;
    // @endif
    // @begin-exclude-from-subapps
  } else {
    // @end-exclude-from-subapps
    // @if financialProduct==expense-management
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
    // @endif
    // @begin-exclude-from-subapps
  }
  // @end-exclude-from-subapps

  return {
    props: {
      // @if financialProduct==embedded-finance
      financialAccount,
      faFundsFlowChartData,
      faTransactions,
      // @endif
      // @if financialProduct==expense-management
      issuingBalance,
      availableBalance,
      balanceTransactions,
      balanceFundsFlowChartData,
      // @endif
    },
  };
};

// @if financialProduct==embedded-finance
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
// @endif

// @if financialProduct==expense-management
const IssuingBalanceStuff = ({
  issuingBalance,
  availableBalance,
  balanceFundsFlowChartData,
  balanceTransactions,
}: {
  issuingBalance: Stripe.Balance.Issuing;
  availableBalance: Stripe.Balance;
  balanceTransactions: Stripe.BalanceTransaction[];
  balanceFundsFlowChartData: BalanceChartData;
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
// @endif

const Page = ({
  // @if financialProduct==embedded-finance
  financialAccount,
  faFundsFlowChartData,
  faTransactions,
  // @endif
  // @if financialProduct==expense-management
  issuingBalance,
  availableBalance,
  balanceTransactions,
  balanceFundsFlowChartData,
  // @endif
}: {
  // @if financialProduct==embedded-finance
  financialAccount: Stripe.Treasury.FinancialAccount;
  faFundsFlowChartData: ChartData;
  faTransactions: Stripe.Treasury.Transaction[];
  // @endif
  // @if financialProduct==expense-management
  issuingBalance: Stripe.Balance.Issuing;
  availableBalance: Stripe.Balance;
  balanceTransactions: Stripe.BalanceTransaction[];
  balanceFundsFlowChartData: BalanceChartData;
  // @endif
}) => {
  const BalanceWidget = (() => {
    // @begin-exclude-from-subapps
    if (financialAccount) {
      // @end-exclude-from-subapps
      // @if financialProduct==embedded-finance
      return FinancialAccountStuff({
        financialAccount,
        faFundsFlowChartData,
        faTransactions,
      });
      // @endif
      // @begin-exclude-from-subapps
    } else {
      // @end-exclude-from-subapps
      // @if financialProduct==expense-management
      return IssuingBalanceStuff({
        issuingBalance,
        availableBalance,
        balanceFundsFlowChartData,
        balanceTransactions,
      });
      // @endif
      // @begin-exclude-from-subapps
    }
    // @end-exclude-from-subapps
  })();

  const TestDataGenerationPanel = (() => {
    // @begin-exclude-from-subapps
    if (financialAccount) {
      // @end-exclude-from-subapps
      // @if financialProduct==embedded-finance
      return (
        <FloatingTestPanel title="Simulate a received credit">
          <TestDataCreateReceivedCredit financialAccount={financialAccount} />
        </FloatingTestPanel>
      );
      // @endif
      // @begin-exclude-from-subapps
    } else {
      // @end-exclude-from-subapps
      // @if financialProduct==expense-management
      return (
        <FloatingTestPanel title="Simulate Issuing Balance Funding">
          <TestDataTopUpIssuingBalance />
        </FloatingTestPanel>
      );
      // @endif
      // @begin-exclude-from-subapps
    }
    // @end-exclude-from-subapps
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
