import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { loadConnectAndInitialize } from "@stripe/connect-js/pure";
import {
  ConnectComponentsProvider,
  ConnectIssuingCardsList,
} from "@stripe/react-connect-js";
import { GetServerSidePropsContext } from "next";
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import Stripe from "stripe";

import { EmbeddedComponentsSwitcher } from "src/components/embedded-components-switcher";
import { useSelection } from "src/hooks/use-selection";
import DashboardLayout from "src/layouts/dashboard/layout";
import { CardsSearch } from "src/sections/cards/cards-search";
import CardsTable from "src/sections/cards/cards-table";
import { postApi } from "src/utils/api-helpers";
import { applyPagination } from "src/utils/apply-pagination";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import { getCards } from "src/utils/stripe-helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount } = session;
  const { accountId } = stripeAccount;
  const responseCards = await getCards(stripeAccount);

  return {
    props: {
      cards: responseCards.cards.data,
      account: accountId,
    },
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

  const [useEmbeddedComponents, setUseEmbeddedComponents] =
    React.useState(false);

  const [stripeConnectInstance] = React.useState(() => {
    const fetchClientSecret = async () => {
      // Fetch the AccountSession client secret
      const response = await postApi("/api/create_account_session", {
        method: "POST",
      });
      if (!response.ok) {
        return undefined;
      } else {
        const { client_secret: clientSecret } = await response.json();
        return clientSecret;
      }
    };
    return loadConnectAndInitialize({
      // This is your test publishable API key.
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
      fetchClientSecret: fetchClientSecret,
      appearance: {
        overlays: "dialog",
        variables: {
          colorPrimary: "#625afa",
        },
      },
    });
  });

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
              <Typography variant="h4">Cards</Typography>
              {/* <CardCreateWidget /> */}
            </Stack>
            {useEmbeddedComponents ? (
              <>
                <Grid container spacing={3}>
                  <ConnectComponentsProvider
                    connectInstance={stripeConnectInstance}
                  >
                    <ConnectIssuingCardsList showSpendControls />
                  </ConnectComponentsProvider>
                  <Grid item xs={12}>
                    <Grid container sx={{ justifyContent: "flex-end" }}>
                      <EmbeddedComponentsSwitcher
                        value={useEmbeddedComponents}
                        onChange={() =>
                          setUseEmbeddedComponents(!useEmbeddedComponents)
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
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
                <Grid
                  container
                  sx={{ marginTop: 4, justifyContent: "flex-end" }}
                >
                  <EmbeddedComponentsSwitcher
                    value={useEmbeddedComponents}
                    onChange={() =>
                      setUseEmbeddedComponents(!useEmbeddedComponents)
                    }
                  />
                </Grid>
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
