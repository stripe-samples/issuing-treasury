import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";

const TestDataTopUpIssuingBalance = ({}) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const simulateIssuingBalanceFunding = async () => {
    setSubmitting(true);
    const response = await postApi("api/create_issuingtopup");
    const result = await extractJsonFromResponse(response);

    handleResult({
      result,
      onSuccess: async () => {
        await router.push("/");
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
          Your issuing balance account will receive a £500.00{" "}
          <Link
            href="https://stripe.com/docs/issuing/funding/balance"
            target="_blank"
            underline="none"
          >
            funding{" "}
            <SvgIcon fontSize="small" sx={{ verticalAlign: "top" }}>
              <ArrowTopRightOnSquareIcon />
            </SvgIcon>
          </Link>{" "}
          each time you press the button.
        </Typography>
        {errorText !== "" && <Alert severity="error">{errorText}</Alert>}
      </Stack>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={submitting}
          onClick={simulateIssuingBalanceFunding}
          fullWidth
        >
          {submitting ? "Simulating..." : "Simulate issuing balance funding"}
        </Button>
      </Box>
    </>
  );
};

export default TestDataTopUpIssuingBalance;
