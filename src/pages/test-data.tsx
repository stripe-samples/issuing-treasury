import { Box, Container, Grid } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";

import DashboardLayout from "src/layouts/dashboard/layout";
import TestDataCreatePaymentLink from "src/sections/test-data/test-data-create-payment-link";
import TestDataCreatePayouts from "src/sections/test-data/test-data-create-payout";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);
  const responseAccount = await stripe.accounts.retrieve(accountId);

  const hasExternalAccount =
    responseAccount.external_accounts?.data[0] != undefined;

  const responseBalance = await stripe.balance.retrieve({
    stripeAccount: accountId,
  });
  const availableBalance = responseBalance.available[0].amount;

  return { props: { hasExternalAccount, availableBalance } };
};

const Page = ({
  hasExternalAccount,
  availableBalance,
}: {
  hasExternalAccount: boolean;
  availableBalance: number;
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
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={10} md={8}>
              <TestDataCreatePaymentLink />
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
              <TestDataCreatePayouts
                hasExternalAccount={hasExternalAccount}
                availableBalance={availableBalance}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
