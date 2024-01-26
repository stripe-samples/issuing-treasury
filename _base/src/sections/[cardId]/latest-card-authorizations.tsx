import { ArrowRightIcon } from "@heroicons/react/20/solid";
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
  Button,
  SvgIcon,
} from "@mui/material";
import React from "react";
import Stripe from "stripe";

import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { SeverityColor } from "src/types/severity-color";
import { capitalize, currencyFormat, formatDateTime } from "src/utils/format";

const statusMap: Record<Stripe.Issuing.Authorization.Status, SeverityColor> = {
  closed: "primary",
  pending: "warning",
  reversed: "error",
};

const LatestCardAuthorizations = ({
  authorizations,
  sx,
}: {
  authorizations: Stripe.Issuing.Authorization[];
  sx?: object;
}) => {
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
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>{/* Approved? */}</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Merchant</TableCell>
                    <TableCell>Merchant Category</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authorizations.map((authorization) => {
                    const category =
                      authorization.merchant_data.category.replace(/_/g, " ");
                    return (
                      <TableRow hover key={authorization.id}>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {formatDateTime(authorization.created)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {currencyFormat(
                            authorization.amount / 100,
                            authorization.currency,
                          )}
                        </TableCell>
                        <TableCell>
                          <SeverityPill
                            color={authorization.approved ? "success" : "error"}
                          >
                            {authorization.approved ? "Approved" : "Declined"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={statusMap[authorization.status]}>
                            {capitalize(authorization.status)}
                          </SeverityPill>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          <Typography noWrap>
                            {authorization.merchant_data.name}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {category}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "1px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Button
                            color="inherit"
                            endIcon={
                              <SvgIcon fontSize="small">
                                <ArrowRightIcon />
                              </SvgIcon>
                            }
                            href={`/authorizations/${authorization.id}`}
                          >
                            Details
                          </Button>
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
};

export default LatestCardAuthorizations;
