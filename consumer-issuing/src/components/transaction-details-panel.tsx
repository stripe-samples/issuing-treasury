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
import { useSession } from "next-auth/react";

import { SeverityPill } from "src/components/severity-pill";
import { SeverityColor } from "src/types/severity-color";
import { SupportedCountry } from "src/utils/account-management-helpers";
import {
  capitalize,
  formatCurrencyForCountry,
  formatDateAndTime,
  titleize,
} from "src/utils/format";
import { GoogleMapComponent } from "./google-map";

interface TransactionDetailsPanelProps {
  transaction: {
    id: string;
    amount: number;
    created: number;
    source: {
      type: string;
      id: string;
      issuing_transaction?: string;
      issuing_credit_repayment?: string;
      issuing_credit_ledger_adjustment?: string;
    };
    auth?: Stripe.Issuing.Authorization & {
      merchant_data?: {
        name?: string;
        category: string;
        address?: {
          line1?: string;
          line2?: string;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
        };
      };
      enriched_merchant_data?: {
        merchant?: {
          name?: string;
          url?: string;
          phone?: string;
          location?: {
            coordinates?: {
              latitude: number;
              longitude: number;
            };
            address?: {
              line1: string;
              line2: string;
              city: string;
              state: string;
              postal_code: string;
              country: string;
            };
          };
        };
      };
    };
    creditRepayment?: {
      id: string;
      status: string;
      instructed_by?: {
        type: string;
      };
    };
    creditLedgerAdjustment?: {
      reason?: string;
      reason_description?: string;
    };
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

const creditRepaymentStatusMap: Record<string, SeverityColor> = {
  succeeded: "success",
  pending: "warning",
  failed: "error",
};

// Helper function to ensure URL has https:// prefix
const ensureHttps = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
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
            {transaction.source.type === "issuing_credit_repayment" && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Credit Repayment ID</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.source.issuing_credit_repayment}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Payment Type</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {transaction.creditRepayment?.instructed_by?.type ? (
                      <Stack direction="row" spacing={1}>
                        <SeverityPill
                          color={transaction.creditRepayment.instructed_by.type === "credit_repayments_api" ? "primary" : "secondary"}
                        >
                          {transaction.creditRepayment.instructed_by.type === "credit_repayments_api" ? "On-Stripe" : "Off-Stripe"}
                        </SeverityPill>
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                          ({transaction.creditRepayment.instructed_by.type === "credit_repayments_api"
                            ? "API-instructed"
                            : "User-instructed"
                          })
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unknown
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {transaction.creditRepayment ? (
                      <SeverityPill color={creditRepaymentStatusMap[transaction.creditRepayment.status] || "info"}>
                        {capitalize(transaction.creditRepayment.status)}
                      </SeverityPill>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unknown
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </>
            )}
            {transaction.source.type === "issuing_credit_ledger_adjustment" && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Reason</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {titleize(transaction.creditLedgerAdjustment?.reason?.replace(/_/g, " ") || "Unknown")}
                    </Typography>
                  </Box>
                </Grid>
                {transaction.creditLedgerAdjustment?.reason_description && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Description</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {transaction.creditLedgerAdjustment.reason_description}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </>
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
                      {transaction.auth?.enriched_merchant_data?.merchant?.url ? (
                        <a
                          href={ensureHttps(transaction.auth.enriched_merchant_data.merchant.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#1976d2', // Material-UI primary blue
                            textDecoration: 'underline'
                          }}
                        >
                          {transaction.auth?.enriched_merchant_data?.merchant?.name || transaction.auth?.merchant_data?.name || "Unknown merchant"}
                        </a>
                      ) : (
                        transaction.auth?.enriched_merchant_data?.merchant?.name || transaction.auth?.merchant_data?.name || "Unknown merchant"
                      )}
                      {transaction.auth?.enriched_merchant_data?.merchant?.phone && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          ({transaction.auth.enriched_merchant_data.merchant.phone})
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Location</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.auth?.enriched_merchant_data?.merchant?.location?.address ? (
                        [
                          transaction.auth.enriched_merchant_data.merchant.location.address.line1,
                          transaction.auth.enriched_merchant_data.merchant.location.address.line2,
                          transaction.auth.enriched_merchant_data.merchant.location.address.city,
                          transaction.auth.enriched_merchant_data.merchant.location.address.state,
                          transaction.auth.enriched_merchant_data.merchant.location.address.postal_code,
                          transaction.auth.enriched_merchant_data.merchant.location.address.country,
                        ].filter(Boolean).join(", ")
                      ) : (
                        [
                          transaction.auth?.merchant_data?.city,
                          transaction.auth?.merchant_data?.state,
                          transaction.auth?.merchant_data?.postal_code,
                          transaction.auth?.merchant_data?.country,
                        ].filter(Boolean).join(", ") || "Unknown location"
                      )}
                    </Typography>
                    {transaction.auth?.enriched_merchant_data?.merchant?.location?.coordinates?.latitude &&
                     transaction.auth?.enriched_merchant_data?.merchant?.location?.coordinates?.longitude && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                        {`${transaction.auth.enriched_merchant_data.merchant.location.coordinates.latitude.toFixed(6)}, ${transaction.auth.enriched_merchant_data.merchant.location.coordinates.longitude.toFixed(6)}`}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                {transaction.auth?.enriched_merchant_data?.merchant?.location?.coordinates?.latitude &&
                 transaction.auth?.enriched_merchant_data?.merchant?.location?.coordinates?.longitude && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                      <GoogleMapComponent
                        latitude={transaction.auth.enriched_merchant_data.merchant.location.coordinates.latitude}
                        longitude={transaction.auth.enriched_merchant_data.merchant.location.coordinates.longitude}
                      />
                    </Box>
                  </Grid>
                )}
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
