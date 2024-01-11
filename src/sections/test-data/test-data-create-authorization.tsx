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
import { currencyFormat } from "src/utils/format";

const TestDataCreateAuthorization = ({
  cardId,
  currency,
}: {
  cardId: string;
  currency: string;
}) => {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const simulateAuthorization = async () => {
    setSubmitting(true);
    const response = await postApi("/api/create_authorization", {
      cardId: cardId,
    });
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        await router.push(`/cards/${cardId}`);
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
          A {currencyFormat(10.0, currency)}{" "}
          <Link
            href="https://stripe.com/docs/issuing/purchase/authorizations"
            target="_blank"
            underline="none"
          >
            Authorization{" "}
            <SvgIcon fontSize="small" sx={{ verticalAlign: "top" }}>
              <ArrowTopRightOnSquareIcon />
            </SvgIcon>
          </Link>{" "}
          will be created each time you press the button.
        </Typography>
        {errorText !== "" && (
          <Alert severity="error">
            {errorText ===
            "Error: Insufficient funds to create a test purchase." ? (
              <span>
                Insufficient funds to create a test purchase.{" "}
                <Link href="/" underline="none">
                  Add funds
                </Link>{" "}
                to your financial account first.
              </span>
            ) : (
              errorText
            )}
          </Alert>
        )}
      </Stack>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={submitting}
          onClick={simulateAuthorization}
          fullWidth
        >
          {submitting ? "Simulating..." : "Simulate test purchase"}
        </Button>
      </Box>
    </>
  );
};

export default TestDataCreateAuthorization;
