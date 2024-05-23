import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import CurrencyIcon from "src/components/currency-icon";
import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
import CardDetails from "src/sections/[cardId]/card-details";
import CardIllustration from "src/sections/[cardId]/card-illustration";
import LatestCardAuthorizations from "src/sections/[cardId]/latest-card-authorizations";
import TestDataCreateAuthorization from "src/sections/test-data/test-data-create-authorization";
import {
  CountryConfigMap,
  StripeAccount,
  SupportedCountry,
} from "src/utils/account-management-helpers";
import { formatCurrencyForCountry } from "src/utils/format";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import { getStripePublishableKey } from "src/utils/stripe-authentication";
import { getCardDetails } from "src/utils/stripe-helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const cardId = context?.params?.cardId?.toString();
  if (cardId === undefined) {
    throw new Error("cardId must be provided");
  }
  const { stripeAccount, country } = session;
  const cardTransactions = await getCardDetails(stripeAccount, cardId);

  return {
    props: {
      authorizations: cardTransactions.card_authorizations,
      currentSpend: cardTransactions.current_spend,
      stripeAccount: stripeAccount,
      cardId: context?.params?.cardId,
      card: cardTransactions.card_details,
      country: country,
    },
  };
};

const Page = ({
  authorizations,
  currentSpend,
  stripeAccount,
  cardId,
  card,
  country,
}: {
  authorizations: Stripe.Issuing.Authorization[];
  currentSpend: number;
  stripeAccount: StripeAccount;
  cardId: string;
  card: Stripe.Issuing.Card;
  country: SupportedCountry;
}) => {
  const { accountId, platform } = stripeAccount;
  const stripePublishableKey = getStripePublishableKey(platform);

  if (!stripePublishableKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be defined");
  }

  const stripePromise = loadStripe(stripePublishableKey, {
    stripeAccount: accountId,
  });

  const spendingLimit = card.spending_controls.spending_limits?.[0];
  const spendingLimitDisplay =
    spendingLimit != undefined
      ? `${formatCurrencyForCountry(spendingLimit.amount, country)} ${spendingLimit.interval}`
      : "No spending limit set";

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
            <Grid item sx={{ width: "100%", maxWidth: 500 }}>
              <Box sx={{ borderRadius: 2, boxShadow: 12 }}>
                <Elements stripe={stripePromise}>
                  <CardIllustration cardId={cardId} card={card} brand="VISA" />
                </Elements>
              </Box>
            </Grid>
            <Grid item xs={true} sm={true} md={true} lg={true} xl={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                  >
                    <Stack spacing={1}>
                      <Typography color="text.secondary" variant="overline">
                        Current spend
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrencyForCountry(currentSpend, country)}
                      </Typography>
                      <Typography pt={1} color="text.secondary">
                        Spending limit:
                      </Typography>
                      <Typography variant="h5">
                        {spendingLimitDisplay}
                      </Typography>
                    </Stack>
                    <Avatar
                      sx={{
                        backgroundColor: "error.main",
                        height: 56,
                        width: 56,
                      }}
                    >
                      <CurrencyIcon
                        currency={CountryConfigMap[country].currency}
                      />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={true}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <CardDetails card={card} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <LatestCardAuthorizations authorizations={authorizations} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <FloatingTestPanel title="Create a test purchase">
        <TestDataCreateAuthorization cardId={cardId} />
      </FloatingTestPanel>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
