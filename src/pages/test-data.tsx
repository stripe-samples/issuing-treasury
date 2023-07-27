import { Box, Container, Grid } from "@mui/material";
import { parse } from "cookie";
import React, { ReactNode } from "react";

import DashboardLayout from "../layouts/dashboard/layout";
import TestDataCreatePaymentLink from "../sections/test-data/test-data-create-payment-link";
import TestDataCreatePayouts from "../sections/test-data/test-data-create-payout";
import TestDataCreateReceivedCredit from "../sections/test-data/test-data-create-received-credit";
import { decode } from "../utils/jwt_encode_decode";
import stripe from "../utils/stripe-loader";

export async function getServerSideProps(context: any) {
  if ("cookie" in context.req.headers) {
    const cookie = parse(context.req.headers.cookie);
    if ("app_auth" in cookie) {
      const session = decode(cookie.app_auth);
      // @ts-expect-error Remove after deployment succeeds
      if (session.requiresOnboarding === true) {
        return {
          redirect: {
            destination: "/onboard",
          },
        };
      }

      // @ts-expect-error Remove after deployment succeeds
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
    }
  }
  return {
    redirect: {
      destination: "/auth/login",
    },
  };
}

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
