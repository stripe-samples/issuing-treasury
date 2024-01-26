import { Box, Container, Stack, Typography } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import Stripe from "stripe";

import { useSelection } from "src/hooks/use-selection";
import DashboardLayout from "src/layouts/dashboard/layout";
import CardholderCreateWidget from "src/sections/cardholders/cardholder-create-widget";
import { CardholdersSearch } from "src/sections/cardholders/cardholders-search";
import CardholdersTable from "src/sections/cardholders/cardholders-table";
import { applyPagination } from "src/utils/apply-pagination";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import { getCardholders } from "src/utils/stripe_helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount } = session;
  const responseCardholders = await getCardholders(stripeAccount);

  return {
    props: {
      cardholders: responseCardholders.cardholders.data,
    },
  };
};

function useCardholders(
  cardholders: Stripe.Issuing.Cardholder[],
  page: number,
  rowsPerPage: number,
): Stripe.Issuing.Cardholder[] {
  return useMemo(() => {
    return applyPagination(cardholders, page, rowsPerPage);
  }, [cardholders, page, rowsPerPage]);
}

function useCardholderIds(cardholders: Stripe.Issuing.Cardholder[]): string[] {
  return useMemo(() => {
    return cardholders.map((cardholder) => cardholder.id);
  }, [cardholders]);
}

const Page = ({
  cardholders: allCardholders,
}: {
  cardholders: Stripe.Issuing.Cardholder[];
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const cardholders = useCardholders(allCardholders, page, rowsPerPage);
  const cardholdersIds = useCardholderIds(cardholders);
  const cardholdersSelection = useSelection<string>(cardholdersIds);

  const handlePageChange = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      setPage(page);
    },
    [],
  );

  const handleRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const rows = parseInt(e.target.value);
      setRowsPerPage(rows);
    },
    [],
  );

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
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Cardholders</Typography>
              <CardholderCreateWidget />
            </Stack>
            <CardholdersSearch />
            <CardholdersTable
              count={allCardholders.length}
              items={cardholders}
              onDeselectAll={cardholdersSelection.handleDeselectAll}
              onDeselectOne={cardholdersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={cardholdersSelection.handleSelectAll}
              onSelectOne={cardholdersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={cardholdersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
