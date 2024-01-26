import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  Box,
  Button,
  Card,
  Checkbox,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { ChangeEvent } from "react";
import Stripe from "stripe";

import { SeverityPill } from "../severity-pill";

import { Scrollbar } from "src/components/scrollbar";
import { SeverityColor } from "src/types/severity-color";
import { capitalize, currencyFormat, formatDateTime } from "src/utils/format";

const statusMap: Record<Stripe.Issuing.Authorization.Status, SeverityColor> = {
  closed: "primary",
  pending: "warning",
  reversed: "error",
};

const AuthorizationsTable = ({
  count = 0,
  items = [],
  onDeselectAll,
  onDeselectOne,
  onPageChange = () => ({}),
  onRowsPerPageChange,
  onSelectAll,
  onSelectOne,
  page = 0,
  rowsPerPage = 0,
  selected = [],
}: {
  count?: number;
  items: Stripe.Issuing.Authorization[];
  onDeselectAll: () => void;
  onDeselectOne: (item: string) => void;
  onPageChange: (
    e: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void;
  onRowsPerPageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectAll: () => void;
  onSelectOne: (item: string) => void;
  page?: number;
  rowsPerPage?: number;
  selected?: string[];
}) => {
  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  return (
    <Card>
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell sortDirection="desc">Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Name on card</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Card last 4</TableCell>
                <TableCell>{/* Approved? */}</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Merchant</TableCell>
                <TableCell>Merchant category</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((authorization) => {
                const isSelected = selected.includes(authorization.id);
                const category = authorization.merchant_data.category.replace(
                  /_/g,
                  " ",
                );
                return (
                  <TableRow hover key={authorization.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectOne?.(authorization.id);
                          } else {
                            onDeselectOne?.(authorization.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatDateTime(authorization.created)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ textTransform: "uppercase", whiteSpace: "nowrap" }}
                    >
                      {currencyFormat(
                        authorization.amount / 100,
                        authorization.currency,
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {authorization.card.cardholder.name}
                    </TableCell>
                    <TableCell>•••• {authorization.card.last4}</TableCell>
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
                      {authorization.merchant_data.name}
                    </TableCell>
                    <TableCell
                      sx={{ textTransform: "uppercase", whiteSpace: "nowrap" }}
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
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default AuthorizationsTable;
