import { Container, Grid } from "@mui/material";
import { parse } from "cookie";
import React, { ReactNode } from "react";

import DashboardLayout from "../layouts/dashboard/layout";
import TestDataCreatePaymentLink from "../sections/test-data/test-data-create-payment-link";
import TestDataCreatePayouts from "../sections/test-data/test-data-create-payout";
import TestDataCreateReceivedCredit from "../sections/test-data/test-data-create-received-credit";
import { decode } from "../utils/jwt_encode_decode";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

      const responseAccount = await stripe.accounts.retrieve(StripeAccountID);
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
      destination: "/signin",
    },
  };
}

const Page = (props: any) => {
  return (
    <>
      <Container>
        <Grid container spacing={3}>
          <Grid item>
            <TestDataCreateReceivedCredit />
          </Grid>
          <Grid item>
            <TestDataCreatePaymentLink />
          </Grid>
          <Grid item>
            <TestDataCreatePayouts
              hasExternalAccount={props.hasExternalAccount}
              availableBalance={props.availableBalance}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
