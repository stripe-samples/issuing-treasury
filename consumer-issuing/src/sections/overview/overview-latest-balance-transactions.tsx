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
import TransactionDetailsPanel from "src/components/transaction-details-panel";
import { formatCurrencyForCountry, formatDateTime, titleize } from "src/utils/format";

const statusMap: Record<string, "warning" | "success" | "error" | "info"> = {
  open: "warning",
  posted: "success",
  void: "error",
};

const typeMap: Record<string, string> = {
  issuing_authorization: "Authorization",
  issuing_transaction: "Transaction",
};

export const OverviewLatestBalanceTransactions = (props: {
  creditLedgerEntries: any[];  // We'll need to define a proper type for credit ledger entries
  sx?: object;
}) => {
  const { creditLedgerEntries = [], sx } = props;

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
          {creditLedgerEntries.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection="desc">Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Merchant</TableCell>
                  <TableCell>Merchant Category</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {creditLedgerEntries.map((entry) => {
                  const category = entry.auth?.merchant_data?.category
                    ? titleize(entry.auth.merchant_data.category.replace(/_/g, " "))
                    : "Unknown";
                  return (
                    <TableRow hover key={entry.id}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(entry.created)}
                      </TableCell>
                      <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
                        {formatCurrencyForCountry(-entry.amount, country)}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {entry.source?.type
                          ? typeMap[entry.source.type] || entry.source.type
                          : "Unknown"}
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={entry.source?.type === "issuing_transaction" ? "success" : "warning"}>
                          {entry.source?.type === "issuing_transaction" ? "Posted" : "Pending"}
                        </SeverityPill>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {entry.auth?.merchant_data?.name || "Unknown merchant"}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {category}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "1px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <TransactionDetailsPanel
                          transaction={entry}
                          country={country}
                          buttonText="Details"
                          buttonProps={{
                            variant: "text",
                            color: "primary",
                          }}
                        />
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
                  There are no transactions to display.
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Scrollbar>
    </Card>
  );
};
