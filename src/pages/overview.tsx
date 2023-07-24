import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { parse } from "cookie";
import React, { ReactNode } from "react";

import DashboardLayout from "../layouts/dashboard/layout";
import { OverviewFinancialAccountBalance } from "../sections/overview/overview-fa-balance";
import { OverviewFinancialAccountFundsFlowChart } from "../sections/overview/overview-fa-funds-flow-chart";
import { OverviewFinancialAccountOutboundPending } from "../sections/overview/overview-fa-outbound-pending";
import { OverviewLatestTransactions } from "../sections/overview/overview-latest-transactions";
import { decode } from "../utils/jwt_encode_decode";
import {
  getFinancialAccountDetails,
  getFinancialAccountTransactionDetails,
  getFinancialAccountTransactionsExpanded,
} from "../utils/stripe_helpers";

export async function getServerSideProps(context: any) {
  if ("cookie" in context.req.headers) {
    const cookie = parse(context.req.headers.cookie);
    if ("app_auth" in cookie) {
      const session = decode(cookie.app_auth);
      if (session.requiresOnboarding === true) {
        return {
          redirect: {
            destination: "/onboard",
          },
        };
      }
      const StripeAccountID = session.accountId;
      const responseFaDetails = await getFinancialAccountDetails(
        StripeAccountID,
      );
      const financialAccount = responseFaDetails.financialaccount;
      const responseFaTransations =
        await getFinancialAccountTransactionsExpanded(StripeAccountID);
      const faTransactions = responseFaTransations.fa_transactions;
      const responseFaTransations_chart =
        await getFinancialAccountTransactionDetails(StripeAccountID);
      const faTransactionsChart =
        responseFaTransations_chart.faTransactions_chart;
      return {
        props: { financialAccount, faTransactions, faTransactionsChart }, // will be passed to the page component as props
      };
    }
  }
  return {
    redirect: {
      destination: "/signin",
    },
  };
}

const Page = ({
  financialAccount,
  faTransactionsChart,
  faTransactions,
}: {
  financialAccount: any;
  faTransactionsChart: any;
  faTransactions: any;
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
                faTransactionsChart={faTransactionsChart}
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
