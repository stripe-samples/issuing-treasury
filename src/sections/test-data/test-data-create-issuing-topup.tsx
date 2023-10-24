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
import Stripe from "stripe";

import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import { log } from "console";

const TestDataTopUpIssuingBalance = ({
  issuingBalance,
}: {
  issuingBalance: Stripe.Balance.Issuing;
}) => {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const simulatIssuingBalanceFunding = async () => {
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

  // const faAddress = financialAccount.financial_addresses[0];
  // const faAddressCreated = faAddress != undefined;

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
        {/* {!faAddressCreated && (
          <Alert severity="error">
            Your financial account is still being set up (this can take up to
            two minutes). Refresh this page to try again.
          </Alert>
        )} */}
      </Stack>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          // disabled={!faAddressCreated || submitting}
          onClick={simulatIssuingBalanceFunding}
          fullWidth
        >
          {submitting ? "Simulating..." : "Simulate issuing balance funding"}
        </Button>
      </Box>
    </>
  );
};

export default TestDataTopUpIssuingBalance;
