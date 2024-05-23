import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Stripe from "stripe";

import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import TransactionFlowDetails from "src/sections/overview/transaction-flow-details";
import { formatCurrencyForCountry, formatDateTime } from "src/utils/format";

const statusMap: Record<string, "warning" | "success" | "error" | "info"> = {
  open: "warning",
  posted: "success",
  void: "error",
};

export const OverviewLatestTransactions = (props: {
  faTransactions: Stripe.Treasury.Transaction[];
  sx?: object;
}) => {
  const { faTransactions = [], sx } = props;

  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country } = session;

  return (
    <Card sx={sx}>
      <CardHeader title="Latest transactions" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          {faTransactions.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection="desc">Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faTransactions.map((transaction) => {
                  return (
                    <TableRow hover key={transaction.id}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(transaction.created)}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {formatCurrencyForCountry(transaction.amount, country)}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          textTransform: "uppercase",
                        }}
                      >
                        <TransactionFlowDetails transaction={transaction} />
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[transaction.status]}>
                          {transaction.status}
                        </SeverityPill>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {transaction.description}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <>
              <Divider />
              <Box p={3} color="neutral.400">
                <Typography variant="body1">
                  There are no transactions to show yet.
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Scrollbar>
    </Card>
  );
};
