import {
  ArrowUpOnSquareIcon,
  ArrowDownOnSquareIcon,
} from "@heroicons/react/24/solid";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  SvgIcon,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import { useSelection } from "../hooks/use-selection";
import DashboardLayout from "../layouts/dashboard/layout";
import { withAuthRequiringOnboarded } from "../middleware/auth-middleware";
import CardholderCreateWidget from "../sections/cardholders/cardholder-create-widget";
import { CardholdersSearch } from "../sections/cardholders/cardholders-search";
import CardholdersTable from "../sections/cardholders/cardholders-table";
import Cardholder from "../types/cardholder";
import JwtPayload from "../types/jwt-payload";
import { applyPagination } from "../utils/apply-pagination";
import { getCardholders } from "../utils/stripe_helpers";

export const getServerSideProps = withAuthRequiringOnboarded(
  async (context: GetServerSidePropsContext, session: JwtPayload) => {
    const StripeAccountID = session.accountId;
    const responseCardholders = await getCardholders(StripeAccountID);

    return {
      props: {
        cardholders: responseCardholders.cardholders.data,
      },
    };
  },
);

function useCardholders(
  cardholders: Cardholder[],
  page: number,
  rowsPerPage: number,
): Cardholder[] {
  return useMemo(() => {
    return applyPagination(cardholders, page, rowsPerPage);
  }, [cardholders, page, rowsPerPage]);
}

function useCardholderIds(cardholders: Cardholder[]): string[] {
  return useMemo(() => {
    return cardholders.map((cardholder) => cardholder.id);
  }, [cardholders]);
}

const Page = ({
  cardholders: allCardholders,
}: {
  cardholders: Cardholder[];
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const cardholders = useCardholders(allCardholders, page, rowsPerPage);
  const cardholdersIds = useCardholderIds(cardholders);
  const cardholdersSelection = useSelection<string>(cardholdersIds);

  const handlePageChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      setPage(page);
    },
    [],
  );

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rows = parseInt(event.target.value);
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
              <Stack spacing={1}>
                <Typography variant="h4">Cardholders</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
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
