import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { signOut } from "next-auth/react";
import React, { useState } from "react";

import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";

function SettingsDeleteAccount() {
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const deleteAccount = async () => {
    setSubmitting(true);
    const response = await postApi("api/delete-account");
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        await signOut();
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
    <Card>
      <CardHeader title="Delete account" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          <Typography>
            Deleting your account will permanently remove all of your data from
            our platform. This action cannot be undone.
          </Typography>
          <Typography>
            You&apos;ll be logged out and will need to register again if you
            want to use our platform.
          </Typography>
          {errorText !== "" && (
            <Alert severity="error" sx={{ pt: 2 }}>
              {errorText}
            </Alert>
          )}
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={deleteAccount}
          disabled={submitting}
        >
          {submitting ? "Deleting..." : "Delete account"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default SettingsDeleteAccount;
