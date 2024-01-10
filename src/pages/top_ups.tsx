import {
  Box,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, { ReactNode } from "react";

import FloatingTestPanel from "src/components/floating-test-panel";
import DashboardLayout from "src/layouts/dashboard/layout";
import TestDataTopUpIssuingBalance from "src/sections/test-data/test-data-create-issuing-topup";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import {
  FinancialAddress,
  FundingInstructions,
  createFundingInstructions,
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

  return {
    props: { fundingInstructions },
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
    <List>
      <ListItem>
        <strong>Account number:</strong> {sortCode.account_number}
      </ListItem>
      <ListItem>
        <strong>Sort code:</strong> {sortCode.sort_code}
      </ListItem>
      <ListItem>
        <strong>Beneficiary name:</strong> {sortCode.account_holder_name}
      </ListItem>
    </List>
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
    <List>
      <ListItem>
        <strong>Account number:</strong> {iban.iban}
      </ListItem>
      <ListItem>
        <strong>BIC:</strong> {iban.bic}
      </ListItem>
      <ListItem>
        <strong>Country:</strong> {iban.country}
      </ListItem>
      <ListItem>
        <strong>Beneficiary name:</strong> {iban.account_holder_name}
      </ListItem>
    </List>
  );
};

const Page = ({
  fundingInstructions,
}: {
  country: string;
  fundingInstructions: FundingInstructions;
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
                Send a bank transfer to top up your Issuing balance.
              </CardContent>

              <CardContent>
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
