import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function TestDataCreatePayout(props: {
  availableBalance: number;
  hasExternalAccount: boolean;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [availableBalance, setAvailableBalance] = useState(
    props.availableBalance,
  );
  const [hasExternalAccount, setHasExternalAccount] = useState(
    props.hasExternalAccount,
  );

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const createPayout = async () => {
    try {
      setSubmitted(true);
      const response = await fetch("api/create_payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        setAvailableBalance(0);
      } else {
        setError(true);
        setErrorText(responseData.error);
      }
    } catch (error) {
      setError(true);
      setErrorText("An error occurred while creating the payout.");
    } finally {
      setSubmitted(false);
    }
  };

  const addExternalAccount = async () => {
    try {
      setSubmitted(true);
      const response = await fetch("api/add_external_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const responseData = await response.json();
      if (responseData.externalAcctAdded === true) {
        setHasExternalAccount(true);
      } else {
        setError(true);
        setErrorText(responseData.error);
      }
    } catch (error) {
      setError(true);
      setErrorText("An error occurred while adding the external account.");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Create Payout" />
      <CardContent sx={{ pt: 0 }}>
        <Typography>
          In order to enable payouts, you need to set your Financial Account as
          the external account for your Connected Account.
        </Typography>
        <Typography>
          {`If you haven't done it yet, by pressing the "Add Financial
          Account as External Account" button, the Financial Account will be set
          as an external account, and manual payouts will be enabled.`}
        </Typography>
        <Typography>
          Platforms have the ability to set up automatic payouts with different
          schedules. You can dive deep into this topic on{" "}
          <Link
            href="https://stripe.com/docs/treasury/moving-money/payouts"
            target="_blank"
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
          >
            Available Balance
          </Link>{" "}
          of <strong>{formatter.format(availableBalance / 100)}</strong>.
        </Typography>

        {error && (
          <Typography variant="body2" color="error" align="center">
            {errorText}
          </Typography>
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "center" }}>
        {hasExternalAccount ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={createPayout}
            disabled={submitted}
          >
            {submitted ? "Creating..." : "Create Payout"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={addExternalAccount}
            disabled={submitted}
          >
            {submitted
              ? "Adding..."
              : "Add Financial Account as External Account"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default TestDataCreatePayout;
