import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";

const TestDataCreateReceivedCredit = () => {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const simulateReceivedCredit = async () => {
    setSubmitting(true);
    const response = await postApi("api/create_receivedcredit");
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: () => {
        router.reload();
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
    <>
      <Stack spacing={1}>
        <Typography variant="body2">
          By pressing the &quot;Simulate Received Credit&quot; button, you will
          simulate receiving a transfer into your Financial Account by creating
          a testmode received credit.
        </Typography>
        <Typography variant="body2">
          You can send funds directly to your Financial Account via ACH or Wire
          Transfers by using its Account and Routing numbers.
        </Typography>
        <Typography variant="body2">
          Your Financial Account will receive $500.00 each time you press the
          button.
        </Typography>
        {errorText !== "" && <Alert severity="error">{errorText}</Alert>}
      </Stack>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={submitting}
          onClick={simulateReceivedCredit}
          fullWidth
        >
          {submitting ? "Simulating..." : "Simulate Received Credit"}
        </Button>
      </Box>
    </>
  );
};

export default TestDataCreateReceivedCredit;
