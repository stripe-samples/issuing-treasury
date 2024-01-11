import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import { SeverityPill } from "src/components/severity-pill";
import DashboardLayout from "src/layouts/dashboard/layout";
import { SeverityColor } from "src/types/severity-color";
import {
  capitalize,
  currencyFormat,
  formatDateAndTime,
  titleize,
} from "src/utils/format";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import { getAuthorizationDetails } from "src/utils/stripe_helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const authorizationId = context?.params?.authorizationId?.toString();
  if (authorizationId === undefined) {
    throw new Error("authorizationId must be provided");
  }
  const StripeAccountID = session.accountId;
  const result = await getAuthorizationDetails(
    StripeAccountID,
    authorizationId,
  );

  return {
    props: {
      authorization: result.authorization,
    },
  };
};

const statusMap: Record<Stripe.Issuing.Authorization.Status, SeverityColor> = {
  closed: "primary",
  pending: "warning",
  reversed: "error",
};

const Page = ({
  authorization,
}: {
  authorization: Stripe.Issuing.Authorization;
}) => {
  const declineReason = authorization.request_history.at(-1)?.reason;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4">Authorization details</Typography>
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Grid container rowSpacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">ID</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {authorization.id}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Card</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    •••• {authorization.card.last4}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Location</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {authorization.merchant_data.city +
                      ", " +
                      authorization.merchant_data.state +
                      ", " +
                      authorization.merchant_data.postal_code +
                      ", " +
                      authorization.merchant_data.country}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Date / Time</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateAndTime(authorization.created)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Amount</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {currencyFormat(
                      authorization.amount / 100,
                      authorization.currency,
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Status</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Stack direction="row" spacing={1}>
                    <SeverityPill
                      color={authorization.approved ? "success" : "error"}
                    >
                      {authorization.approved ? "Approved" : "Declined"}
                    </SeverityPill>
                    <SeverityPill color={statusMap[authorization.status]}>
                      {capitalize(authorization.status)}
                    </SeverityPill>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Merchant</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {authorization.merchant_data.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Merchant category</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {titleize(
                      authorization.merchant_data.category.replace(/_/g, " "),
                    )}
                  </Typography>
                </Box>
              </Grid>
              {!authorization.approved && declineReason && (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Decline reason</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {titleize(declineReason.replace(/_/g, " "))}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
