// @if financialProduct==embedded-finance
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";

import { formatCurrencyForCountry } from "src/utils/format";

export const OverviewFinancialAccountBalance = (props: {
  sx: object;
  value: number;
}) => {
  const { sx, value } = props;

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
              Account Balance
            </Typography>
            <Typography variant="h4">
              {formatCurrencyForCountry(value, country)}
            </Typography>
            <Typography color="text.secondary">Current balance</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};
// @endif
