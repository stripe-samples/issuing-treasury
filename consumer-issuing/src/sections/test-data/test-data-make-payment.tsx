import { Button, InputAdornment, Stack, TextField, Alert } from "@mui/material";
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
  const [submitting, setSubmitting] = useState(false);

  const handlePaymentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setPaymentAmount(value);
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

    try {
      const response = await postApi("/api/create_credit_repayment", {
        amount: Math.round(parseFloat(paymentAmount) * 100), // Convert to cents
        currency: country.toLowerCase(),
        account: stripeAccount.accountId,
      });

      const result = await extractJsonFromResponse(response);
      handleResult({
        result,
        onSuccess: () => {
          setPaymentAmount("");
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
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Payment amount"
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
      {errorText && <Alert severity="error">{errorText}</Alert>}
      <Button
        color="primary"
        onClick={handleSubmit}
        variant="contained"
        disabled={submitting}
      >
        {submitting ? "Processing..." : "Make Payment"}
      </Button>
    </Stack>
  );
}; 