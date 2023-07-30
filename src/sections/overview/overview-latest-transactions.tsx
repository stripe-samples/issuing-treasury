import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Stripe from "stripe";

import { SeverityPill } from "src/components/severity-pill";
import TransactionFlowDetails from "src/sections/overview/transaction-flow-details";
import { formatDateTime, formatUSD } from "src/utils/format";

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

  return (
    <Card sx={sx}>
      <CardHeader title="Latest Transactions" />
      <Box sx={{ minWidth: 800 }}>
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
                  <TableCell>{formatDateTime(transaction.created)}</TableCell>
                  <TableCell>
                    {`${formatUSD(transaction.amount / 100)} USD`}
                  </TableCell>
                  <TableCell sx={{ textTransform: "uppercase" }}>
                    <TransactionFlowDetails transaction={transaction} />
                  </TableCell>
                  <TableCell>
                    <SeverityPill color={statusMap[transaction.status]}>
                      {transaction.status}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};
