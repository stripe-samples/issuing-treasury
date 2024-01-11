import BusinessIcon from "@mui/icons-material/Business";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import LanguageIcon from "@mui/icons-material/Language";
import NumbersIcon from "@mui/icons-material/Numbers";
import {
  Box,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";
import Stripe from "stripe";

import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
import TestDataTopUpIssuingBalance from "src/sections/test-data/test-data-create-issuing-topup";
import { currencyFormat } from "src/utils/format";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";
import {
  FinancialAddress,
  FundingInstructions,
  createFundingInstructions,
  getBalance,
} from "src/utils/stripe_helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { accountId, country, currency } = session;

  const fundingInstructions = await createFundingInstructions(
    accountId,
    country,
    currency,
  );

  const response = await getBalance(accountId);
  const balance = response.balance;
  const availableBalance = balance.available[0];

  return {
    props: { fundingInstructions, availableBalance },
  };
};

const FPSTransferTopupInstructions = ({
  financialAddress,
}: {
  financialAddress: FinancialAddress;
}) => {
  const sortCode = financialAddress.sort_code;

  if (!sortCode) {
    return;
  }

  return (
    <>
      <Typography>
        Send an FPS or BACS credit transfer to the following bank account to top
        up your Issuing balance.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <NumbersIcon />
          </ListItemIcon>
          <ListItemText
            primary="Account number"
            secondary={sortCode.account_number}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ForkRightIcon />
          </ListItemIcon>
          <ListItemText primary="Sort code" secondary={sortCode.sort_code} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText
            primary="Beneficiary name"
            secondary={sortCode.account_holder_name}
          />
        </ListItem>
      </List>
    </>
  );
};
const SEPATransferTopupInstructions = ({
  financialAddress,
}: {
  financialAddress: FinancialAddress;
}) => {
  const iban = financialAddress.iban;

  if (!iban) {
    return;
  }

  return (
    <>
      <Typography>
        Send an SEPA credit transfer to the following bank account to top up
        your Issuing balance.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <NumbersIcon />
          </ListItemIcon>
          <ListItemText primary="Account number" secondary={iban.iban} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ForkRightIcon />
          </ListItemIcon>
          <ListItemText primary="BIC" secondary={iban.bic} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary="Country" secondary={iban.country} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText
            primary="Beneficiary name"
            secondary={iban.account_holder_name}
          />
        </ListItem>
      </List>
    </>
  );
};

const Page = ({
  fundingInstructions,
  availableBalance,
}: {
  fundingInstructions: FundingInstructions;
  availableBalance: Stripe.Balance.Available;
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
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">Top up your Issuing balance</Typography>

            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography>
                    Your Issusing balance is currently{" "}
                    <strong>
                      {currencyFormat(
                        availableBalance.amount / 100,
                        availableBalance.currency,
                      )}
                    </strong>
                  </Typography>

                  {fundingInstructions.bank_transfer.type ==
                  "gb_bank_transfer" ? (
                    <FPSTransferTopupInstructions
                      financialAddress={
                        fundingInstructions.bank_transfer.financial_addresses[0]
                      }
                    />
                  ) : (
                    <SEPATransferTopupInstructions
                      financialAddress={
                        fundingInstructions.bank_transfer.financial_addresses[0]
                      }
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>

      <FloatingTestPanel title="Simulate Issuing Balance Funding">
        <TestDataTopUpIssuingBalance />
      </FloatingTestPanel>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
