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

import { SeverityPill } from "../../components/severity-pill";
import { formatUSD } from "../../utils/format";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewLatestTransactions = (props: {
  faTransactions: [];
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
                // @ts-expect-error Remove after deployment succeeds
                fromUnixTime(transaction.created),
                "dd/MM/yyyy",
              );

              return (
                <>
                  {/* @ts-expect-error Remove after deployment succeeds */}
                  <TableRow hover key={transaction.id}>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>
                      {/* @ts-expect-error Remove after deployment succeeds */}
                      {`${formatUSD(transaction.amount / 100)} USD`}
                    </TableCell>
                    <TableCell sx={{ textTransform: "uppercase" }}>
                      {/* @ts-expect-error Remove after deployment succeeds */}
                      {transaction.flow_details[transaction.flow_type]
                        .hosted_regulatory_receipt_url ? (
                        <Stack direction="row" spacing={1}>
                          {/* @ts-expect-error Remove after deployment succeeds */}
                          <Typography>{transaction.flow_type}</Typography>
                          <Link
                            href={
                              // @ts-expect-error Remove after deployment succeeds
                              transaction.flow_details[transaction.flow_type]
                                .hosted_regulatory_receipt_url
                            }
                            target="_blank"
                          >
                            <SvgIcon>
                              <DocumentArrowDownIcon />
                            </SvgIcon>
                          </Link>
                        </Stack>
                      ) : (
                        <Typography>
                          {/* @ts-expect-error Remove after deployment succeeds */}
                          {transaction.flow_type}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {/* @ts-expect-error Remove after deployment succeeds */}
                      <SeverityPill color={statusMap[transaction.status]}>
                        {/* @ts-expect-error Remove after deployment succeeds */}
                        {transaction.status}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {/* @ts-expect-error Remove after deployment succeeds */}
                      {transaction.description}
                    </TableCell>
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
