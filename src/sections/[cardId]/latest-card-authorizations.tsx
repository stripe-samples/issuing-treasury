import {
  Card,
  CardHeader,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Divider,
} from "@mui/material";
import React from "react";
import Stripe from "stripe";

import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { formatDateTime, formatUSD } from "src/utils/format";

function LatestCardAuthorizations({
  authorizations,
  sx,
}: {
  authorizations: Stripe.Issuing.Authorization[];
  sx?: object;
}) {
  return (
    <>
      <Card sx={sx}>
        <CardHeader title="Latest Authorizations" />
        <Scrollbar sx={{ flexGrow: 1 }}>
          <Box sx={{ minWidth: 800 }}>
            {authorizations.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sortDirection="desc">Date</TableCell>
                    <TableCell>Merchant</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Merchant Category</TableCell>
                    <TableCell>ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authorizations.map((authorization) => {
                    const category =
                      authorization.merchant_data.category.replace(/_/g, " ");
                    return (
                      <TableRow hover key={authorization.id}>
                        <TableCell>
                          <Typography noWrap>
                            {formatDateTime(authorization.created)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            {authorization.merchant_data.name}{" "}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textTransform: "uppercase" }}>
                          <Typography noWrap>
                            {formatUSD(authorization.amount / 100)}{" "}
                            {authorization.currency}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <SeverityPill
                            color={authorization.approved ? "success" : "error"}
                          >
                            {authorization.approved ? "Approved" : "Declined"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell sx={{ textTransform: "uppercase" }}>
                          <Typography noWrap>{category}</Typography>
                        </TableCell>
                        <TableCell>{authorization.id}</TableCell>
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
                    There are no issuing authorizations for this card.
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
}

export default LatestCardAuthorizations;
