import { Box, Container, Grid } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";

import DashboardLayout from "src/layouts/dashboard/layout";
import TestDataCreatePaymentLink from "src/sections/test-data/test-data-create-payment-link";
import TestDataCreatePayouts from "src/sections/test-data/test-data-create-payout";
import TestDataCreatePayoutsToBank from "src/sections/test-data/test-data-create-payout-to-bank";
import FinancialProduct from "src/types/financial-product";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const {
    stripeAccount,
    // @begin-exclude-from-subapps
    financialProduct,
    // @end-exclude-from-subapps
  } = session;
  const { accountId, platform } = stripeAccount;
  const stripe = stripeClient(platform);
  const responseAccount = await stripe.accounts.retrieve(accountId);

  const hasExternalAccount =
    responseAccount.external_accounts?.data[0] != undefined;

  const responseBalance = await stripe.balance.retrieve({
    stripeAccount: accountId,
  });

  const availableBalance = responseBalance.available[0].amount;

  return {
    props: {
      hasExternalAccount,
      availableBalance,
      // @begin-exclude-from-subapps
      financialProduct,
      // @end-exclude-from-subapps
    },
  };
};

const Page = ({
  hasExternalAccount,
  availableBalance,
  // @begin-exclude-from-subapps
  financialProduct,
  // @end-exclude-from-subapps
}: {
  hasExternalAccount: boolean;
  availableBalance: number;
  // @begin-exclude-from-subapps
  financialProduct: FinancialProduct;
  // @end-exclude-from-subapps
}) => {
  const PayoutsWidget = (() => {
    // @begin-exclude-from-subapps
    if (financialProduct == FinancialProduct.EmbeddedFinance) {
      // @end-exclude-from-subapps
      // @if financialProduct==embedded-finance
      return (
        <TestDataCreatePayouts
          hasExternalAccount={hasExternalAccount}
          availableBalance={availableBalance}
        />
      );
      // @endif
      // @begin-exclude-from-subapps
    } else {
      // @end-exclude-from-subapps
      // @if financialProduct==expense-management
      return (
        <TestDataCreatePayoutsToBank
          hasExternalAccount={hasExternalAccount}
          availableBalance={availableBalance}
        />
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
        <Container maxWidth="xl">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={10} md={8}>
              <TestDataCreatePaymentLink />
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
              {PayoutsWidget}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
