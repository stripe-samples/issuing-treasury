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
import Stripe from "stripe";

import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import BalanceTransactionFlowDetails from "src/sections/overview/balance-transaction-flow-details";
import { currencyFormat, formatDateTime } from "src/utils/format";

const statusMap: Record<string, "warning" | "success" | "error" | "info"> = {
  open: "warning",
  posted: "success",
  void: "error",
};

export const OverviewLatestBalanceTransactions = (props: {
  balanceTransactions: Stripe.BalanceTransaction[];
  sx?: object;
}) => {
  const { balanceTransactions = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Latest transactions" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          {balanceTransactions.length > 0 ? (
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
                {balanceTransactions.map((transaction) => {
                  return (
                    <TableRow hover key={transaction.id}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(transaction.created)}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {currencyFormat(
                          transaction.amount / 100,
                          transaction.currency,
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          textTransform: "uppercase",
                        }}
                      >
                        <BalanceTransactionFlowDetails
                          transaction={transaction}
                        />
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[transaction.status]}>
                          {transaction.status}
                        </SeverityPill>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {transaction.description
                          ? transaction.description
                          : `Sample ${transaction.type}`}
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
