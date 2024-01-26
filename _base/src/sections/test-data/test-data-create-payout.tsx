import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import { currencyFormat } from "src/utils/format";

function TestDataCreatePayout({
  availableBalance: availableBalanceProp,
  hasExternalAccount: hasExternalAccountProp,
  currency: currencyProp,
}: {
  availableBalance: number;
  hasExternalAccount: boolean;
  currency: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [availableBalance, setAvailableBalance] =
    useState(availableBalanceProp);
  const [hasExternalAccount, setHasExternalAccount] = useState(
    hasExternalAccountProp,
  );

  const createPayout = async () => {
    setSubmitting(true);
    const response = await postApi("api/create_payout");
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        setAvailableBalance(0);
      },
      onError: (error) => {
        setErrorText(`Error: ${error.message}`);
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  const addExternalAccount = async () => {
    setSubmitting(true);
    const response = await postApi("api/add_external_account");
    const result = await extractJsonFromResponse(response);

    handleResult({
      result,
      onSuccess: async () => {
        setHasExternalAccount(true);
      },
      onError: (error) => {
        setErrorText(`Error: ${error.message}`);
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader title="Create Payout" />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={1}>
          <Typography>
            In order to enable payouts, you need to set your financial account
            as the external account for your connected account.
          </Typography>
          <Typography>
            {`If you haven't done it yet, by pressing the "Add financial
          account as external account" button, the financial account will be set
          as an external account, and manual payouts will be enabled.`}
          </Typography>
          <Typography>
            Platforms have the ability to set up automatic payouts with
            different schedules. You can dive deep into this topic on{" "}
            <Link
              href="https://stripe.com/docs/treasury/moving-money/payouts"
              target="_blank"
              underline="none"
            >
              this page
            </Link>
            .
          </Typography>
          <Typography>
            Currently, your connected account has an{" "}
            <Link
              href="https://stripe.com/docs/connect/account-balances"
              target="_blank"
              underline="none"
            >
              available balance
            </Link>{" "}
            of{" "}
            <strong>
              {currencyFormat(availableBalance / 100, currencyProp)}
            </strong>
            .
          </Typography>
          {errorText !== "" && (
            <Alert severity="error" sx={{ pt: 2 }}>
              {errorText}
            </Alert>
          )}
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "center" }}>
        {hasExternalAccount ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={createPayout}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create payout"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={addExternalAccount}
            disabled={submitting}
          >
            {submitting
              ? "Adding..."
              : "Add financial account as external account"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default TestDataCreatePayout;
