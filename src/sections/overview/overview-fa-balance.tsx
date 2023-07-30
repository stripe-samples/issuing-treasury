import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

import { formatUSD } from "src/utils/format";

export const OverviewFinancialAccountBalance = (props: {
  sx: object;
  value: number;
}) => {
  const { sx, value } = props;

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
            <Typography variant="h4">{formatUSD(value / 100)}</Typography>
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
