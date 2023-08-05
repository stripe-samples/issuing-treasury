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
import Stripe from "stripe";

import { useSelection } from "src/hooks/use-selection";
import DashboardLayout from "src/layouts/dashboard/layout";
import { CardsSearch } from "src/sections/cards/cards-search";
import CardsTable from "src/sections/cards/cards-table";
import { applyPagination } from "src/utils/apply-pagination";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import { getCards } from "src/utils/stripe_helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const StripeAccountID = session.accountId;
  const responseCards = await getCards(StripeAccountID);
  return {
    props: { cards: responseCards.cards.data, account: StripeAccountID },
  };
};

function useCards(
  cards: Stripe.Issuing.Card[],
  page: number,
  rowsPerPage: number,
): Stripe.Issuing.Card[] {
  return useMemo(() => {
    return applyPagination(cards, page, rowsPerPage);
  }, [cards, page, rowsPerPage]);
}

function useCardIds(cards: Stripe.Issuing.Card[]): string[] {
  return useMemo(() => {
    return cards.map((card) => card.id);
  }, [cards]);
}

const Page = ({ cards: allCards }: { cards: Stripe.Issuing.Card[] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const cards = useCards(allCards, page, rowsPerPage);
  const cardsIds = useCardIds(cards);
  const cardsSelection = useSelection<string>(cardsIds);

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
                <Typography variant="h4">Cards</Typography>
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
              {/* <CardCreateWidget /> */}
            </Stack>
            <CardsSearch />
            <CardsTable
              count={allCards.length}
              items={cards}
              onDeselectAll={cardsSelection.handleDeselectAll}
              onDeselectOne={cardsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={cardsSelection.handleSelectAll}
              onSelectOne={cardsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={cardsSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
