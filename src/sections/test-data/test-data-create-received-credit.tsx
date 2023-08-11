import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { fetchApi } from "src/utils/api-helpers";

const TestDataCreateReceivedCredit = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorText, setErrorText] = useState("");

  const simulateReceivedCredit = async () => {
    try {
      setSubmitted(true);
      const response = await fetchApi("api/create_receivedcredit");
      if (!response.ok) {
        const data = await response.json();
        setErrorText(data.error);
      }
    } catch (error) {
      setErrorText("Something went wrong");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Simulate Received Credit"></CardHeader>
      <CardContent sx={{ pt: 0 }}>
        <Typography>
          By pressing the Create Received Credit button, you will simulate
          receiving a transfer into your Financial Account.
        </Typography>
        <Typography>
          You can send funds directly to your Financial Account via ACH or Wire
          Transfers by using its Account and Routing numbers.
        </Typography>
        <Typography>
          Your Financial Account will receive $ 500.00 each time you press the
          button.
        </Typography>
        {errorText !== "" && <Alert severity="error">{errorText}</Alert>}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={submitted}
          onClick={simulateReceivedCredit}
        >
          {submitted ? "Simulating..." : "Simulate Received Credit"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TestDataCreateReceivedCredit;
