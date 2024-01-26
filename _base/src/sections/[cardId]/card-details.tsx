import { Typography, Box, Stack } from "@mui/material";
import React from "react";
import Stripe from "stripe";

import { SeverityPill } from "src/components/severity-pill";
import CardStatusSwitcher from "src/sections/[cardId]/card-status-switcher";
import { SeverityColor } from "src/types/severity-color";
import { capitalize, formatDateTime } from "src/utils/format";

const statusMap: Record<Stripe.Issuing.Card.Status, SeverityColor> = {
  active: "success",
  canceled: "error",
  inactive: "warning",
};

const CardDetails = ({ card }: { card: Stripe.Issuing.Card }) => {
  return (
    <Box>
      <Stack spacing={3}>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight="bold">
              Card Type
            </Typography>
            <Typography variant="body2">{capitalize(card.type)}</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight="bold">
              Card Created
            </Typography>
            <Typography variant="body2">
              {formatDateTime(card.created)}
            </Typography>
          </Stack>
          <CardStatusSwitcher cardId={card.id} cardStatus={card.status} />
        </Stack>
        <Stack
          alignItems="flex-start"
          direction="row"
          spacing={3}
          justifyContent="space-between"
        >
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight="bold">
              Card Currency
            </Typography>
            <Typography variant="body2">
              {card.currency.toUpperCase()}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography variant="body1" color="neutral.600">
              Status:
            </Typography>
            <Typography variant="body2">
              <SeverityPill color={statusMap[card.status]}>
                {capitalize(card.status)}
              </SeverityPill>
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight="bold">
            Billing Address
          </Typography>
          <Box>
            <Typography variant="body2">
              {card.cardholder.billing.address.line1}
            </Typography>
            <Typography variant="body2">
              {card.cardholder.billing.address.line2}
            </Typography>
            <Typography variant="body2">
              {card.cardholder.billing.address.city} -{" "}
              {card.cardholder.billing.address.state}{" "}
              {card.cardholder.billing.address.postal_code}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CardDetails;
