import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  DialogTitle,
  Drawer,
  Grid,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import React, { ReactNode, useState } from "react";
import Stripe from "stripe";

import { SeverityPill } from "src/components/severity-pill";
import { SeverityColor } from "src/types/severity-color";
import { SupportedCountry } from "src/utils/account-management-helpers";
import {
  capitalize,
  formatCurrencyForCountry,
  formatDateAndTime,
  titleize,
} from "src/utils/format";

interface TransactionDetailsPanelProps {
  transaction: {
    id: string;
    amount: number;
    created: number;
    source: {
      type: string;
      id: string;
      issuing_transaction?: string;
    };
    auth?: Stripe.Issuing.Authorization;
  };
  country: SupportedCountry;
  buttonText: string;
  buttonProps?: {
    variant?: "text" | "outlined" | "contained";
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    size?: "small" | "medium" | "large";
  };
}

const statusMap: Record<Stripe.Issuing.Authorization.Status, SeverityColor> = {
  closed: "primary",
  pending: "warning",
  reversed: "error",
};

const TransactionDetailsPanel = ({
  transaction,
  country,
  buttonText,
  buttonProps = {},
}: TransactionDetailsPanelProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {buttonText}
      </Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml={1}
          mt={1}
        >
          Transaction details
          <IconButton onClick={() => setOpen(false)}>
            <SvgIcon>
              <XMarkIcon />
            </SvgIcon>
          </IconButton>
        </DialogTitle>
        <Box maxWidth={400} px={4}>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">ID</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {transaction.id}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Type</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {titleize(transaction.source.type.replace(/_/g, " "))}
                </Typography>
              </Box>
            </Grid>
            {transaction.source.issuing_transaction && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Issuing Transaction ID</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.source.issuing_transaction}
                  </Typography>
                </Box>
              </Grid>
            )}
            {transaction.auth && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Issuing Authorization ID</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.auth.id}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="subtitle2">Date / Time</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {formatDateAndTime(transaction.created)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Amount</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrencyForCountry(-transaction.amount, country)}
                </Typography>
              </Box>
            </Grid>
            {transaction.auth && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Stack direction="row" spacing={1}>
                      <SeverityPill
                        color={transaction.auth.approved ? "success" : "error"}
                      >
                        {transaction.auth.approved ? "Approved" : "Declined"}
                      </SeverityPill>
                      <SeverityPill color={statusMap[transaction.auth.status]}>
                        {capitalize(transaction.auth.status)}
                      </SeverityPill>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Merchant</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.auth.merchant_data.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Location</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.auth.merchant_data.city +
                        ", " +
                        transaction.auth.merchant_data.state +
                        ", " +
                        transaction.auth.merchant_data.postal_code +
                        ", " +
                        transaction.auth.merchant_data.country}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Merchant category</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {titleize(
                        transaction.auth.merchant_data.category.replace(/_/g, " "),
                      )}
                    </Typography>
                  </Box>
                </Grid>
                {!transaction.auth.approved && transaction.auth.request_history.at(-1)?.reason && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Decline reason</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {titleize(
                          transaction.auth.request_history.at(-1)?.reason?.replace(/_/g, " ") ?? "",
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>
      </Drawer>
    </>
  );
};

export default TransactionDetailsPanel; 