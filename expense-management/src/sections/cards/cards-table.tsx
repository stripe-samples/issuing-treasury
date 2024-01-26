import { ArrowRightIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Stack,
  SvgIcon,
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
import { SeverityPill } from "src/components/severity-pill";
import { SeverityColor } from "src/types/severity-color";
import { formatDateTime } from "src/utils/format";

const statusMap: Record<Stripe.Issuing.Card.Type, SeverityColor> = {
  virtual: "info",
  physical: "warning",
};

const CardsTable = ({
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
  items: Stripe.Issuing.Card[];
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
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Cardholder Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Card Last 4</TableCell>
                <TableCell>Created</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((card) => {
                const isSelected = selected.includes(card.id);
                return (
                  <TableRow hover key={card.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(card.id);
                          } else {
                            onDeselectOne?.(card.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {card.cardholder.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[card.type]}>
                        {card.type}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{card.last4}</TableCell>
                    <TableCell>{formatDateTime(card.created)}</TableCell>
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
                        href={`/cards/${card.id}`}
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

export default CardsTable;
