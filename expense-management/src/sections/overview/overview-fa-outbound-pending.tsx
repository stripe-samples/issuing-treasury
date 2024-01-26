import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

import { formatUSD } from "src/utils/format";

export const OverviewFinancialAccountOutboundPending = (props: {
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
              Outbound Pending
            </Typography>
            <Typography variant="h4">{formatUSD(value / 100)}</Typography>
            <Typography color="text.secondary">
              Funds reserved for pending outbound fees
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <ArrowRightCircleIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};
