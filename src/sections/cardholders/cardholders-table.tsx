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

import { formatDateTime } from "../../utils/format";

import CardholderUpdateWidget from "./cardholder-update-widget";

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
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
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
                      onChange={(event) => {
                        if (event.target.checked) {
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
                      <form action="/api/issue_card" method="POST">
                        <input
                          type="hidden"
                          id="cardholderid"
                          name="cardholderid"
                          value={cardholder.id}
                        ></input>
                        <Stack direction="row" spacing={1.5}>
                          <Select
                            labelId="card-type-label"
                            id="card_type"
                            name="card_type"
                            defaultValue="virtual"
                            label="Card Type"
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
