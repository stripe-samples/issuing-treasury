import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";

function TestDataCreatePaymentLink() {
  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { stripeAccount } = session;
  const { accountId } = stripeAccount;
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [gotUrl, setGotUrl] = useState(false);
  const [url, setUrl] = useState("");

  const createPaymentLink = async () => {
    setSubmitted(true);
    const response = await postApi("api/create_paymentlink");
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        setGotUrl(true);
        if (result.data && "paymentLink" in result.data) {
          const data = result.data as {
            paymentLink: string;
          };
          const paymentLink = data.paymentLink;
          setUrl(paymentLink);
        } else {
          throw new Error("Something went wrong");
        }
      },
      onError: (error) => {
        setErrorText(`Error: ${error.message}`);
      },
      onFinally: () => {
        setSubmitted(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader title="Create PaymentLink" />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={1}>
          <Typography>
            By pressing the Create PaymentLink button you will generate a{" "}
            <Link
              href="https://stripe.com/docs/payments/payment-links"
              target="_blank"
              underline="none"
            >
              PaymentLink
            </Link>{" "}
            that you can use to receive a payment into your Connected
            Account&apos;s Stripe Balance.
          </Typography>
          <Typography>
            Use the test card number{" "}
            <Typography variant="button">4000 0000 0000 0077</Typography> to
            make the charge succeed. Funds are added directly to your available
            balance, bypassing your pending balance.
          </Typography>
          {(!isDemoMode() || router.query.debug) && (
            <Typography>
              You can view the payments{" "}
              <Link
                href={`https://dashboard.stripe.com/${accountId}/test/payments`}
                target="_blank"
                underline="none"
              >
                here
              </Link>{" "}
              in the Stripe dashboard.
            </Typography>
          )}
          {errorText !== "" && <Alert severity="error">{errorText}</Alert>}
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "center" }}>
        {gotUrl ? (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => window.open(url, "_blank")}
          >
            Go to PaymentLink
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={submitted}
            onClick={createPaymentLink}
          >
            {submitted ? "Creating..." : "Create PaymentLink"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default TestDataCreatePaymentLink;
