import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
import SendMoneyWizardDialog from "src/sections/financial-account/send-money-wizard-dialog";
import { OverviewFinancialAccountBalance } from "src/sections/overview/overview-fa-balance";
import { OverviewFinancialAccountOutboundPending } from "src/sections/overview/overview-fa-outbound-pending";
import { OverviewLatestTransactions } from "src/sections/overview/overview-latest-transactions";
import TestDataCreateReceivedCredit from "src/sections/test-data/test-data-create-received-credit";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import {
  getFinancialAccountDetailsExp,
  getFinancialAccountTransactionsExpanded,
} from "src/utils/stripe_helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount } = session;

  const responseFaDetails = await getFinancialAccountDetailsExp(stripeAccount);
  const financialAccount = responseFaDetails.financialaccount;

  const responseFaTransations =
    await getFinancialAccountTransactionsExpanded(stripeAccount);
  const faTransactions = responseFaTransations.fa_transactions;

  return {
    props: { financialAccount, faTransactions },
  };
};

const Page = ({
  financialAccount,
  faTransactions,
}: {
  financialAccount: Stripe.Treasury.FinancialAccount;
  faTransactions: Stripe.Treasury.Transaction[];
}) => {
  const faAddress = financialAccount.financial_addresses[0];
  const faAddressCreated = faAddress != undefined;

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
            {faAddressCreated ? (
              <>
                <Grid item xs={12} sm={8}>
                  <Card sx={{ height: "100%" }}>
                    <CardHeader title="Account information" />
                    <List sx={{ p: 0 }}>
                      <ListItem divider sx={{ px: 3, py: 1.5 }}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <ListItemText
                              sx={{ m: 0 }}
                              primary={
                                <Typography variant="subtitle2">
                                  Account holder name
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {faAddress.aba?.account_holder_name}
                                  </Typography>
                                </Box>
                              }
                              disableTypography={true}
                            ></ListItemText>
                          </Grid>
                          <Grid item xs={6}>
                            <ListItemText
                              sx={{ m: 0 }}
                              primary={
                                <Typography variant="subtitle2">
                                  Bank name
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {faAddress.aba?.bank_name}
                                  </Typography>
                                </Box>
                              }
                              disableTypography={true}
                            ></ListItemText>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <ListItem sx={{ px: 3, py: 1.5 }}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <ListItemText
                              sx={{ m: 0 }}
                              primary={
                                <Typography variant="subtitle2">
                                  Routing number
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {faAddress.aba?.routing_number}
                                  </Typography>
                                </Box>
                              }
                              disableTypography={true}
                            ></ListItemText>
                          </Grid>
                          <Grid item xs={6}>
                            <ListItemText
                              sx={{ m: 0 }}
                              primary={
                                <Typography variant="subtitle2">
                                  Account number
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {faAddress.aba?.account_number}
                                  </Typography>
                                </Box>
                              }
                              disableTypography={true}
                            ></ListItemText>
                          </Grid>
                        </Grid>
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack spacing={1} textAlign="center">
                        <Typography color="text.secondary" variant="overline">
                          Supported networks
                        </Typography>
                        <Box>
                          {faAddress.supported_networks?.map((network, i) => (
                            <Chip
                              key={i}
                              sx={{ ml: 1 }}
                              label={network.toUpperCase().replace(/_/g, " ")}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                        <Box pt={1}>
                          <SendMoneyWizardDialog />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Card sx={{ height: "100%" }}>
                  <CardHeader title="Account information" />
                  <CardContent>
                    <Alert severity="info">
                      Your financial account is still being set up (this can
                      take up to two minutes). Refresh this page to try again.
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid item xs={12}>
              <OverviewLatestTransactions faTransactions={faTransactions} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <FloatingTestPanel title="Simulate a received credit">
        <TestDataCreateReceivedCredit financialAccount={financialAccount} />
      </FloatingTestPanel>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
