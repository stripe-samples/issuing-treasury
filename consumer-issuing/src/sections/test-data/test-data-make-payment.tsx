import { Button, InputAdornment, Stack, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { formatCurrencyForCountry } from "src/utils/format";

export const TestDataMakePayment = () => {
  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country } = session;

  const [paymentAmount, setPaymentAmount] = useState<string>("");

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
    // TODO: Implement payment submission
    console.log("Making payment:", paymentAmount);
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {formatCurrencyForCountry(0, country).split("0")[0]}
            </InputAdornment>
          ),
        }}
      />
      <Button
        color="primary"
        onClick={handleSubmit}
        variant="contained"
      >
        Make Payment
      </Button>
    </Stack>
  );
}; 