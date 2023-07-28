import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format, fromUnixTime } from "date-fns";
import Stripe from "stripe";

import { SeverityPill } from "../../components/severity-pill";
import { formatUSD } from "../../utils/format";

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
              const createdAt = format(
                fromUnixTime(transaction.created),
                "dd/MM/yyyy",
              );

              type FlowDetailsWithRegulatoryReceiptUrl<T extends string> =
                T extends "other" | "issuing_authorization" ? never : T;

              const flowType =
                transaction.flow_type as FlowDetailsWithRegulatoryReceiptUrl<Stripe.Treasury.Transaction.FlowType>;
              const flowDetails = transaction.flow_details?.[flowType];

              return (
                <>
                  <TableRow hover key={transaction.id}>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>
                      {`${formatUSD(transaction.amount / 100)} USD`}
                    </TableCell>
                    <TableCell sx={{ textTransform: "uppercase" }}>
                      {flowDetails &&
                      flowDetails.hosted_regulatory_receipt_url ? (
                        <Stack direction="row" spacing={1}>
                          <Typography>{transaction.flow_type}</Typography>
                          <Link
                            href={flowDetails.hosted_regulatory_receipt_url}
                            target="_blank"
                          >
                            <SvgIcon>
                              <DocumentArrowDownIcon />
                            </SvgIcon>
                          </Link>
                        </Stack>
                      ) : (
                        <Typography>{transaction.flow_type}</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <SeverityPill color={statusMap[transaction.status]}>
                        {transaction.status}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                </>
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
