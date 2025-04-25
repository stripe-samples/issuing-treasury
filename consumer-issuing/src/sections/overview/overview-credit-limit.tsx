import { Avatar, Card, CardContent, Link, Stack, Typography } from "@mui/material";
import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

import { CountryConfigMap } from "src/utils/account-management-helpers";
import { formatCurrencyForCountry } from "src/utils/format";
import FloatingPaymentPanel from "src/components/floating-payment-panel";
import { TestDataMakePayment } from "src/sections/test-data/test-data-make-payment";

export const OverviewCreditStatement = (props: {
  sx: object;
  creditLimit: number;
}) => {
  const { sx, creditLimit } = props;

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
              Last Statement
            </Typography>
            <Typography variant="h4">
              {formatCurrencyForCountry(creditLimit, country)}
            </Typography>
            <Typography color="text.secondary">
              Statement balance
            </Typography>
          </Stack>
          <Stack spacing={1} alignItems="flex-start">
            <Link
              href="#"
              underline="hover"
              color="primary"
              sx={{ cursor: 'pointer' }}
            >
              Download Statement
            </Link>
            <FloatingPaymentPanel
              title="Make Payment"
              buttonText="Make Payment"
              buttonProps={{
                variant: "contained",
                color: "primary",
                size: "small"
              }}
            >
              <TestDataMakePayment />
            </FloatingPaymentPanel>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            <DocumentCurrencyDollarIcon className="text-white" style={{ width: 24, height: 24 }} />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}; 