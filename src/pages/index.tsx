import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
// import { OverviewFinancialAccountBalance } from "src/sections/overview/overview-fa-balance";
// import { OverviewFinancialAccountFundsFlowChart } from "src/sections/overview/overview-fa-funds-flow-chart";
// import { OverviewFinancialAccountOutboundPending } from "src/sections/overview/overview-fa-outbound-pending";
// import { OverviewLatestTransactions } from "src/sections/overview/overview-latest-transactions";
// import TestDataCreateReceivedCredit from "src/sections/test-data/test-data-create-received-credit";
// import { OverviewFinancialAccountBalance } from "src/sections/overview/overview-fa-balance";

import TestDataTopUpIssuingBalance from "src/sections/test-data/test-data-create-issuing-topup";
import { ChartData, BalanceChartData } from "src/types/chart-data";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import {
  // getFinancialAccountDetails,
  // getFinancialAccountTransactionDetails,
  // getFinancialAccountTransactionsExpanded,
  // getIssuingTransactions,
  getBalance,
  getBalanceTransactions,
} from "src/utils/stripe_helpers";

import { OverviewBalanceFundsFlowChart } from "src/sections/overview/overview-balance-funds-flow-chart";
import {OverviewIssuingBalance} from "src/sections/overview/overview-issuing-balance";
import {OverviewAvailableBalance} from "src/sections/overview/overview-acquring-balance";
import { OverviewLatestBalanceTransactions } from "src/sections/overview/overview-latest-balance-transactions";
import { log } from "console";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const StripeAccountID = session.accountId;

//   const responseFaDetails = await getFinancialAccountDetails(StripeAccountID);
//   const financialAccount = responseFaDetails.financialaccount;

//   const faFundsFlowChartDataResult =
//     await getFinancialAccountTransactionDetails(StripeAccountID);
//   const faFundsFlowChartData = faFundsFlowChartDataResult.faFundsFlowChartData;

//   const responseFaTransations =
//     await getFinancialAccountTransactionsExpanded(StripeAccountID);
//   const faTransactions = responseFaTransations.fa_transactions;

  const responseBalanceTransactions = 
    await getBalanceTransactions(StripeAccountID);
  const balanceTransactions = responseBalanceTransactions.balanceTransactions;

  const balanceFundsFlowChartDataResult =
    await getBalanceTransactions(StripeAccountID);
  const balanceFundsFlowChartData = balanceFundsFlowChartDataResult.balanceFundsFlowChartData;

  const responseAccountBalance = 
    await getBalance(StripeAccountID);
  const issuingBalance = responseAccountBalance.balance.issuing;
  const availableBalance = responseAccountBalance.balance;


  return {
    // props: { financialAccount, faFundsFlowChartData, faTransactions },
    props: { issuingBalance, availableBalance, balanceTransactions, balanceFundsFlowChartData },
  };
};



const Page = ({
  // financialAccount,
  // faFundsFlowChartData,
  // faTransactions,
  issuingBalance,
  availableBalance,
  balanceFundsFlowChartData,
  balanceTransactions,
}: {
  // financialAccount: Stripe.Treasury.FinancialAccount;
  // faFundsFlowChartData: ChartData;
  // faTransactions: Stripe.Treasury.Transaction[];
  issuingBalance : Stripe.Balance.Issuing;
  availableBalance : Stripe.Balance
  balanceFundsFlowChartData :  BalanceChartData;
  balanceTransactions : Stripe.BalanceTransaction[];

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
              <OverviewAvailableBalance
                sx={{ height: "100%" }}
                value={availableBalance.available[0].amount}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <OverviewIssuingBalance
                sx={{ height: "100%" }}
                value= {issuingBalance.available[0].amount}
              />
            </Grid>

            <Grid item xs={12}>
              <OverviewBalanceFundsFlowChart
                balanceFundsFlowChartData={balanceFundsFlowChartData}
              />
            </Grid>

            <Grid item xs={12}>
              <OverviewLatestBalanceTransactions balanceTransactions={balanceTransactions}/>
            </Grid>



          {/* <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <OverviewFinancialAccountBalance
                sx={{ height: "100%" }}
                value={financialAccount.balance.cash.usd}
              />
          </Grid> */}

            {/* <Grid item xs={12} sm={6}>
              <OverviewFinancialAccountOutboundPending
                sx={{ height: "100%" }}
                // value={financialAccount.balance.outbound_pending.usd}
              />
            </Grid> */}

            {/* <Grid item xs={12}>
              <OverviewFinancialAccountFundsFlowChart
                faFundsFlowChartData={faFundsFlowChartData}
              />
            </Grid> */}

            {/* <Grid item xs={12}>
              <OverviewLatestTransactions faTransactions={faTransactions} />
            </Grid> */}

          </Grid>
        </Container>
      </Box>
      <FloatingTestPanel title="Simulate Issuing Balance Funding">
      <TestDataTopUpIssuingBalance issuingBalance={issuingBalance} />
        {/* <TestDataCreateReceivedCredit financialAccount={financialAccount} /> */}
      </FloatingTestPanel>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
