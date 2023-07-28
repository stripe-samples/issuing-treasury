import { Box, Container, Grid } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";

import DashboardLayout from "../layouts/dashboard/layout";
import { withAuthRequiringOnboarded } from "../middleware/auth-middleware";
import TestDataCreatePaymentLink from "../sections/test-data/test-data-create-payment-link";
import TestDataCreatePayouts from "../sections/test-data/test-data-create-payout";
import TestDataCreateReceivedCredit from "../sections/test-data/test-data-create-received-credit";
import JwtPayload from "../types/jwt-payload";
import stripe from "../utils/stripe-loader";

export const getServerSideProps = withAuthRequiringOnboarded(
  async (context: GetServerSidePropsContext, session: JwtPayload) => {
    const StripeAccountID = session.accountId;

    const responseAccount = await stripe.accounts.retrieve(StripeAccountID);
    // @ts-expect-error Remove after deployment succeeds
    const accountExternalAccount = responseAccount.external_accounts.data[0];

    const responseBalance = await stripe.balance.retrieve({
      stripeAccount: StripeAccountID,
    });
    const availableBalance = responseBalance.available[0].amount;

    let hasExternalAccount = false;

    if (accountExternalAccount) {
      hasExternalAccount = true;
    }
    return {
      props: { hasExternalAccount, availableBalance }, // will be passed to the page component as props
    };
  },
);

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
              <TestDataCreateReceivedCredit />
            </Grid>
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
