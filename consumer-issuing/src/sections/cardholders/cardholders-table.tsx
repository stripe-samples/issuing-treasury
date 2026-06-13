import {
  Box,
  Button,
  Card,
  Checkbox,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { ChangeEvent } from "react";
import Stripe from "stripe";

import { Scrollbar } from "src/components/scrollbar";
import CardholderUpdateWidget from "src/sections/cardholders/cardholder-update-widget";
import { formatDateTime } from "src/utils/format";

const CardholdersTable = ({
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
  items: Stripe.Issuing.Cardholder[];
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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((cardholder) => {
                const isSelected = selected.includes(cardholder.id);
                return (
                  <TableRow hover key={cardholder.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectOne?.(cardholder.id);
                          } else {
                            onDeselectOne?.(cardholder.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {cardholder.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{cardholder.email}</TableCell>
                    <TableCell>{formatDateTime(cardholder.created)}</TableCell>
                    <TableCell
                      sx={{
                        width: "1px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cardholder.individual ? (
                        <form action="/api/cards" method="POST">
                          <input
                            type="hidden"
                            name="cardholderid"
                            value={cardholder.id}
                          ></input>
                          <Stack direction="row" spacing={1.5}>
                            <Select
                              labelId="card-type-label"
                              name="card_type"
                              defaultValue="virtual"
                              sx={{ minWidth: 200, height: 40 }}
                            >
                              <MenuItem value="virtual">Virtual</MenuItem>
                              <MenuItem value="physical">Physical</MenuItem>
                            </Select>
                            <Button variant="contained" type="submit">
                              Issue card
                            </Button>
                          </Stack>
                        </form>
                      ) : (
                        <CardholderUpdateWidget cardholderId={cardholder.id} />
                      )}
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

export default CardholdersTable;
