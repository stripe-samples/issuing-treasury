import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Container,
  Stack,
  Typography,
  SvgIcon,
  Card,
  InputAdornment,
  OutlinedInput,
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

import AuthorizationsTable from "src/components/issuing/authorizations-table";
import { useSelection } from "src/hooks/use-selection";
import DashboardLayout from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import { getSessionForServerSideProps } from "src/utils/session-helpers";
import { getAuthorizations } from "src/utils/stripe_helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForServerSideProps(context);
  const { stripeAccount } = session;
  const responseAuthorizations = await getAuthorizations(stripeAccount);

  return {
    props: {
      authorizations: responseAuthorizations.authorizations.data,
    },
  };
};

function useAuthorizations(
  authorizations: Stripe.Issuing.Authorization[],
  page: number,
  rowsPerPage: number,
): Stripe.Issuing.Authorization[] {
  return useMemo(() => {
    return applyPagination(authorizations, page, rowsPerPage);
  }, [authorizations, page, rowsPerPage]);
}

function useAuthorizationIds(
  authorizations: Stripe.Issuing.Authorization[],
): string[] {
  return useMemo(() => {
    return authorizations.map((authorization) => authorization.id);
  }, [authorizations]);
}

const Page = ({
  authorizations: allAuthorizations,
}: {
  authorizations: Stripe.Issuing.Authorization[];
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const authorizations = useAuthorizations(
    allAuthorizations,
    page,
    rowsPerPage,
  );
  const authorizationsIds = useAuthorizationIds(authorizations);
  const authorizationsSelection = useSelection<string>(authorizationsIds);

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
            <Typography variant="h4">Card authorizations</Typography>
            <Card sx={{ p: 2 }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search authorizations"
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{ maxWidth: 500 }}
              />
            </Card>
            <AuthorizationsTable
              count={allAuthorizations.length}
              items={authorizations}
              onDeselectAll={authorizationsSelection.handleDeselectAll}
              onDeselectOne={authorizationsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={authorizationsSelection.handleSelectAll}
              onSelectOne={authorizationsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={authorizationsSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
