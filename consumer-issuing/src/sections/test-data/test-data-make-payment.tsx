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
  Chip,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { formatCurrencyForCountry } from "src/utils/format";
import { extractJsonFromResponse, handleResult, postApi } from "src/utils/api-helpers";
import { CountryConfigMap } from "src/utils/account-management-helpers";

interface VerifiedPaymentMethod {
  customer: {
    id: string;
    name: string;
    email: string;
  };
  paymentMethods: Array<{
    id: string;
    bank_name?: string;
    last4?: string;
    account_type?: string;
    account_holder_type?: string;
  }>;
}

export const TestDataMakePayment = () => {
  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country, stripeAccount } = session;
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("user_instructed");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [verifiedPaymentMethods, setVerifiedPaymentMethods] = useState<VerifiedPaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [errorText, setErrorText] = useState<string>("");
  const [successText, setSuccessText] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch verified payment methods immediately when component mounts
  useEffect(() => {
    fetchVerifiedPaymentMethods();
  }, []);

  const fetchVerifiedPaymentMethods = async () => {
    setLoadingPaymentMethods(true);
    try {
      const response = await fetch("/api/get_verified_payment_methods", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const result = await extractJsonFromResponse(response);
      if (result.success && result.data) {
        setVerifiedPaymentMethods(result.data as VerifiedPaymentMethod[]);
      } else {
        setErrorText("Failed to load verified payment methods");
      }
    } catch (error) {
      setErrorText("Error loading payment methods");
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

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
    // Clear messages and selections when payment type changes
    setSuccessText("");
    setErrorText("");
    setSelectedPaymentMethod("");
    setSelectedCustomer("");
  };

  const handlePaymentMethodChange = (event: any) => {
    const value = event.target.value;
    setSelectedPaymentMethod(value);

    // Find the customer for this payment method
    for (const customerData of verifiedPaymentMethods) {
      const paymentMethod = customerData.paymentMethods.find(pm => pm.id === value);
      if (paymentMethod) {
        setSelectedCustomer(customerData.customer.id);
        break;
      }
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

    if (paymentType === "api_instructed" && !selectedPaymentMethod) {
      setErrorText("Please select a payment method for on-Stripe payments");
      return;
    }

    setSubmitting(true);
    setErrorText("");
    setSuccessText("");

    const amount = parseFloat(paymentAmount);
    const amountInCents = Math.round(amount * 100);
    const currency = CountryConfigMap[country]?.currency || country.toLowerCase();

    const requestData: any = {
      amount: amountInCents,
      currency,
      payment_type: paymentType,
      account: stripeAccount.accountId,
    };

    if (paymentType === "api_instructed") {
      requestData.payment_method_id = selectedPaymentMethod;
      requestData.customer_id = selectedCustomer;
    }

    console.log("Submitting payment:", {
      amount,
      amountInCents,
      currency,
      paymentType,
      requestData,
      formattedAmount: formatCurrencyForCountry(amount, country)
    });

    try {
      const response = await postApi("/api/create_credit_repayment", requestData);

      const result = await extractJsonFromResponse(response);
      handleResult({
        result,
        onSuccess: () => {
          setPaymentAmount("");
          setSelectedPaymentMethod("");
          setSelectedCustomer("");
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

  // Get all payment methods for the dropdown
  const allPaymentMethods = verifiedPaymentMethods.flatMap(customerData =>
    customerData.paymentMethods.map(pm => ({
      ...pm,
      customerName: customerData.customer.name || customerData.customer.email,
      customerId: customerData.customer.id,
    }))
  );

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

      {paymentType === "api_instructed" && (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="payment-method-select-label">Select Payment Method</InputLabel>
            <Select
              labelId="payment-method-select-label"
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
              disabled={submitting}
              label="Select Payment Method"
            >
              {loadingPaymentMethods ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    <Typography variant="body2">Loading payment methods...</Typography>
                  </Box>
                </MenuItem>
              ) : allPaymentMethods.length === 0 ? (
                <MenuItem disabled>
                  <Box sx={{ py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      No verified bank accounts found
                    </Typography>
                  </Box>
                </MenuItem>
              ) : (
                allPaymentMethods.map((pm) => (
                  <MenuItem key={pm.id} value={pm.id}>
                    <Box>
                      <Typography variant="body2">
                        {pm.bank_name} ****{pm.last4} ({pm.account_type})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Account holder: {pm.customerName}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
      )}

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
          disabled={submitting || (paymentType === "api_instructed" && !selectedPaymentMethod)}
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
