import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function TestDataCreatePaymentLink() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [gotUrl, setGotUrl] = useState(false);
  const [url, setUrl] = useState("");

  const createPaymentLink = async () => {
    try {
      setSubmitted(true);
      const response = await fetch("api/create_paymentlink", {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const responseData = await response.json();
      if (responseData.urlCreated === true) {
        setGotUrl(true);
        setUrl(responseData.paymentLink);
      } else {
        setError(true);
        setErrorText(responseData.error);
      }
    } catch (error) {
      setError(true);
      setErrorText("An error occurred while creating the PaymentLink.");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Create PaymentLink" />
      <CardContent sx={{ pt: 0 }}>
        <Typography>
          By pressing the Create PaymentLink button you will generate a{" "}
          <Link
            href="https://stripe.com/docs/payments/payment-links"
            target="_blank"
          >
            PaymentLink
          </Link>{" "}
          that you can use to receive a payment into your Connected
          Account&apos;s Stripe Balance.
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center">
            {errorText}
          </Typography>
        )}
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
