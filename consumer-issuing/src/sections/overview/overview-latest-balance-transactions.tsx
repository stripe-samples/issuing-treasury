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
import { SeverityColor } from "src/types/severity-color";

const statusMap: Record<string, SeverityColor> = {
  open: "warning",
  posted: "success",
  void: "error",
};

const typeMap: Record<string, string> = {
  issuing_authorization: "Authorization",
  issuing_transaction: "Transaction",
  issuing_credit_repayment: "Repayment",
  issuing_credit_ledger_adjustment: "Adjustment"
};

const adjustmentReasonMap: Record<string, string> = {
  interest_charge: "Interest Charge",
  interest_credit: "Interest Credit",
  late_fee: "Late Fee",
  annual_fee: "Annual Fee",
  foreign_transaction_fee: "Foreign Transaction Fee",
  cash_advance_fee: "Cash Advance Fee",
  balance_transfer_fee: "Balance Transfer Fee",
  returned_payment_fee: "Returned Payment Fee",
  statement_credit: "Statement Credit",
  other: "Other Adjustment",
  platform_issued_debit_memo: "Platform Issued Debit Memo",
};

const getTransactionType = (entry: any): string => {
  if (entry.source?.type === 'issuing_transaction' && entry.transaction?.type === 'refund') {
    return 'Refund';
  }
  return entry.source?.type ? typeMap[entry.source.type] || entry.source.type : 'Unknown';
};

const getStatusInfo = (entry: any): { text: string; color: SeverityColor } => {
  if (entry.source?.type === "issuing_credit_repayment") {
    const status = entry.creditRepayment?.status || "processing";
    switch (status) {
      case "processing":
        return {
          text: "Processing",
          color: "info"
        };
      case "succeeded":
        return {
          text: "Success",
          color: "success"
        };
      case "failed":
        return {
          text: "Failed",
          color: "error"
        };
      default:
        return {
          text: "Pending",
          color: "info"
        };
      }
  } else if (entry.source?.type === "issuing_transaction") {
    return {
      text: "Posted",
      color: "success"
    };
  } else if (entry.source?.type === "issuing_credit_ledger_adjustment") {
    return {
      text: "Posted",
      color: "success"
    };
  } else {
    return {
      text: "Pending",
      color: "warning"
    };
  }
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
                    : entry.source?.type === "issuing_credit_ledger_adjustment"
                    ? adjustmentReasonMap[entry.creditLedgerAdjustment?.reason] || titleize(entry.creditLedgerAdjustment?.reason?.replace(/_/g, " ") || "Unknown")
                    : "Unknown";
                  const isRepayment = entry.source?.type === "issuing_credit_repayment";
                  const isAdjustment = entry.source?.type === "issuing_credit_ledger_adjustment";
                  const statusInfo = getStatusInfo(entry);
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
                        {getTransactionType(entry)}
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={statusInfo.color}>
                          {statusInfo.text}
                        </SeverityPill>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {!isRepayment && !isAdjustment && (entry.auth?.merchant_data?.name || "Unknown merchant")}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {!isRepayment && category}
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
