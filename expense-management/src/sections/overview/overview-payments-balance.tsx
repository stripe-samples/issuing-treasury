import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Stripe from "stripe";

import CurrencyIcon from "src/components/currency-icon";
import { CountryConfigMap } from "src/utils/account-management-helpers";
import { formatCurrencyForCountry } from "src/utils/format";

export const OverviewAvailableBalance = (props: {
  sx: object;
  balance: Stripe.Balance.Available;
}) => {
  const { sx, balance } = props;
  const { amount: value } = balance;

  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country } = session;

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
              Payments Acquired Balance
            </Typography>
            <Typography variant="h4">
              {formatCurrencyForCountry(value, country)}
            </Typography>
            <Typography color="text.secondary">
              Available acquired balance
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <CurrencyIcon currency={CountryConfigMap[country].currency} />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};
