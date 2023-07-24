import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function TestDataCreateReceivedCredit() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const simulateReceivedCredit = async () => {
    try {
      setSubmitted(true);
      const response = await fetch("api/create_receivedcredit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const responseData = await response.json();
      if (responseData.urlCreated === true) {
        console.log("success");
      } else {
        setError(true);
        setErrorText(responseData.error);
      }
    } catch (error) {
      setError(true);
      setErrorText("An error occurred while simulating received credit.");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Simulate Received Credit"></CardHeader>
        <CardContent sx={{ pt: 0 }}>
          <Typography>
            By pressing the Create Received Credit button, you will simulate
            receiving a transfer into your Financial Account.
          </Typography>
          <Typography>
            You can send funds directly to your Financial Account via ACH or
            Wire Transfers by using its Account and Routing numbers.
          </Typography>
          <Typography>
            Your Financial Account will receive $ 500.00 each time you press the
            button.
          </Typography>
          {error && (
            <Typography variant="body2" color="error" align="center">
              {errorText}
            </Typography>
          )}
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
    </>
  );
}

export default TestDataCreateReceivedCredit;
