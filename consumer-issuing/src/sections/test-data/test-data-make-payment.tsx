import {
  Button,
  InputAdornment,
  Grid,
  TextField,
  Alert,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Chip
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { formatCurrencyForCountry } from "src/utils/format";
import { extractJsonFromResponse, handleResult, postApi } from "src/utils/api-helpers";
import { CountryConfigMap } from "src/utils/account-management-helpers";

export const TestDataMakePayment = () => {
  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country, stripeAccount } = session;
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("user_instructed");
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

  const handlePaymentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentType(event.target.value);
    // Clear messages when payment type changes
    setSuccessText("");
    setErrorText("");
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
    const currency = CountryConfigMap[country]?.currency || country.toLowerCase();

    console.log("Submitting payment:", {
      amount,
      amountInCents,
      currency,
      paymentType,
      formattedAmount: formatCurrencyForCountry(amount, country)
    });

    try {
      const response = await postApi("/api/create_credit_repayment", {
        amount: amountInCents,
        currency,
        payment_type: paymentType,
        account: stripeAccount.accountId,
      });

      const result = await extractJsonFromResponse(response);
      handleResult({
        result,
        onSuccess: () => {
          setPaymentAmount("");
          const paymentTypeLabel = paymentType === "api_instructed" ? "on-Stripe" : "off-Stripe";
          setSuccessText(`Successfully processed ${paymentTypeLabel} payment of ${formatCurrencyForCountry(amount, country)}`);
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
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Payment Type
            </Typography>
          </FormLabel>
          <RadioGroup
            row
            value={paymentType}
            onChange={handlePaymentTypeChange}
          >
            <FormControlLabel
              value="api_instructed"
              control={<Radio disabled={submitting} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label="On-Stripe"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              }
            />
            <FormControlLabel
              value="user_instructed"
              control={<Radio disabled={submitting} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label="Off-Stripe"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {paymentType === "api_instructed"
            ? "On-Stripe payments are processed automatically through the API using a stored bank account and credited to the platform's Issuing balance."
            : "Off-Stripe payments are externally-processed payments (e.g., paper check, external bank transfer) that do not affect the platform's balance."
          }
        </Typography>
      </Grid>

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
          {submitting
            ? "Processing..."
            : `Make ${paymentType === "api_instructed" ? "On-Stripe" : "Off-Stripe"} Payment`
          }
        </Button>
      </Grid>
    </Grid>
  );
};
