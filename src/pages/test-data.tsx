import { Box, Container, Grid } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";

import DashboardLayout from "src/layouts/dashboard/layout";
import TestDataCreatePaymentLink from "src/sections/test-data/test-data-create-payment-link";
import TestDataCreatePayouts from "src/sections/test-data/test-data-create-payout";
import TestDataCreatePayoutsToBank from "src/sections/test-data/test-data-create-payout-to-bank";
import UseCase from "src/types/use_cases";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { accountId: StripeAccountID, useCase } = session;

  const stripe = stripeClient();
  const responseAccount = await stripe.accounts.retrieve(StripeAccountID);

  const hasExternalAccount =
    responseAccount.external_accounts?.data[0] != undefined;

  const responseBalance = await stripe.balance.retrieve({
    stripeAccount: StripeAccountID,
  });

  const availableBalance = responseBalance.available[0].amount;
  const currency = responseBalance.available[0].currency;

  return { props: { hasExternalAccount, availableBalance, currency, useCase } };
};

const Page = ({
  hasExternalAccount,
  availableBalance,
  currency,
  useCase,
}: {
  hasExternalAccount: boolean;
  availableBalance: number;
  currency: string;
  useCase: UseCase;
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
              {useCase == UseCase.EmbeddedFinance ? (
                <TestDataCreatePayouts
                  hasExternalAccount={hasExternalAccount}
                  availableBalance={availableBalance}
                  currency={currency}
                />
              ) : (
                <TestDataCreatePayoutsToBank
                  hasExternalAccount={hasExternalAccount}
                  availableBalance={availableBalance}
                  currency={currency}
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
