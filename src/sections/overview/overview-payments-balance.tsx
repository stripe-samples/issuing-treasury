import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import Stripe from "stripe";

import CurrencyIcon from "src/components/currency-icon";
import { currencyFormat } from "src/utils/format";

export const OverviewAvailableBalance = (props: {
  sx: object;
  balance: Stripe.Balance.Available;
}) => {
  const { sx, balance } = props;
  const { amount: value, currency } = balance;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Payments Available Balance
            </Typography>
            <Typography variant="h4">
              {currencyFormat(value / 100, currency)}
            </Typography>
            <Typography color="text.secondary">Available balance</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <CurrencyIcon currency={currency} />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};
