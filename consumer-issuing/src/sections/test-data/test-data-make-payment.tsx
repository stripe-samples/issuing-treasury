import { Button, InputAdornment, Grid, TextField, Alert, Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { formatCurrencyForCountry } from "src/utils/format";
import { extractJsonFromResponse, handleResult, postApi } from "src/utils/api-helpers";

export const TestDataMakePayment = () => {
  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country, stripeAccount } = session;
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [successText, setSuccessText] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handlePaymentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setPaymentAmount(value);
      // Clear success message when user starts typing
      setSuccessText("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setErrorText("Please enter a valid payment amount");
      return;
    }

    setSubmitting(true);
    setErrorText("");
    setSuccessText("");

    const amount = parseFloat(paymentAmount);
    const amountInCents = Math.round(amount * 100);
    const currency = country.toLowerCase();

    console.log("Submitting payment:", {
      amount,
      amountInCents,
      currency,
      formattedAmount: formatCurrencyForCountry(amount, country)
    });

    try {
      const response = await postApi("/api/create_credit_repayment", {
        amount: amountInCents,
        currency,
        account: stripeAccount.accountId,
      });

      const result = await extractJsonFromResponse(response);
      handleResult({
        result,
        onSuccess: () => {
          setPaymentAmount("");
          setSuccessText(`Successfully processed payment of ${formatCurrencyForCountry(amount * 100, country)}`);
        },
        onError: (error) => {
          setErrorText(`Error: ${error.message}`);
        },
        onFinally: () => {
          setSubmitting(false);
        },
      });
    } catch (error) {
      setErrorText("An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle2">Payment Amount</Typography>
        <Box sx={{ mt: 0.5 }}>
          <TextField
            fullWidth
            name="paymentAmount"
            onChange={handlePaymentAmountChange}
            onKeyDown={handleKeyDown}
            type="text"
            value={paymentAmount}
            disabled={submitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {formatCurrencyForCountry(0, country).split("0")[0]}
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
      {errorText && (
        <Grid item xs={12}>
          <Alert severity="error">{errorText}</Alert>
        </Grid>
      )}
      {successText && (
        <Grid item xs={12}>
          <Alert severity="success">{successText}</Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button
          color="primary"
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          fullWidth
        >
          {submitting ? "Processing..." : "Make Payment"}
        </Button>
      </Grid>
    </Grid>
  );
}; 