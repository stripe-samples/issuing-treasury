import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Stripe from "stripe";

import CurrencyIcon from "src/components/currency-icon";
import { CountryConfigMap } from "src/utils/account-management-helpers";
import { formatCurrencyForCountry } from "src/utils/format";

type IssuingBalance = {
  available?: Array<{
    amount: number;
    currency: string;
  }>;
  credit_limit?: Array<{
    amount: number;
    currency: string;
  }>;
  total_balance?: Array<{
    amount: number;
    currency: string;
  }>;
};

export const OverviewIssuingBalance = (props: {
  sx: object;
  balance: IssuingBalance;
}) => {
  const { sx, balance } = props;
  const availableAmount = balance.available?.[0]?.amount ?? 0;
  const creditLimitAmount = balance.credit_limit?.[0]?.amount ?? 0;
  const totalBalanceAmount = balance.total_balance?.[0]?.amount ?? 0;

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
              Your Credit Account
            </Typography>
            <Typography variant="h4">
              {formatCurrencyForCountry(totalBalanceAmount, country)}
            </Typography>
            <Typography color="text.secondary">
            Total balance
              
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography color="text.secondary">
                Credit limit
              </Typography>
              <Typography variant="h6">
                {formatCurrencyForCountry(creditLimitAmount, country)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography color="text.secondary">
              Available credit balance
              </Typography>
              <Typography variant="h6">
                {formatCurrencyForCountry(availableAmount, country)}
              </Typography>
            </Stack>
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
