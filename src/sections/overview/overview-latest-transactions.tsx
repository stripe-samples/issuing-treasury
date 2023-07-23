import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";

import { Scrollbar } from "../../components/scrollbar";
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
      <Scrollbar sx={{ flexGrow: 1 }}>
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
                const createdAt = format(transaction.created, "dd/MM/yyyy");

                return (
                  <TableRow hover key={transaction.id}>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>
                      {`${formatUSD(transaction.amount / 100)} USD`}
                    </TableCell>
                    <TableCell sx={{ textTransform: "uppercase" }}>
                      {transaction.flow_details[transaction.flow_type]
                        .hosted_regulatory_receipt_url ? (
                        <span className="text-gray-500 font-medium flex justify-between">
                          {transaction.flow_type}
                          <a
                            href={
                              transaction.flow_details[transaction.flow_type]
                                .hosted_regulatory_receipt_url
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                              />
                            </svg>
                          </a>
                        </span>
                      ) : (
                        <span className="text-gray-500 font-medium flex">
                          {transaction.flow_type}
                        </span>
                      )}
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
      </Scrollbar>
      <Divider />
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
