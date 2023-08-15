import {
  Stack,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import React, { ReactNode, useState } from "react";

import AuthLayout from "src/layouts/auth/layout";
import { fetchApi } from "src/utils/api-helpers";

const Page = () => {
  const [isContinuingOnboarding, setIsContinuingOnboarding] = useState(false);
  const [isSkippingOnboarding, setIsSkippingOnboarding] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const [skipOnboarding, setSkipOnboarding] = useState(true);

  const handleSkipOnboarding = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsSkippingOnboarding(true);
    const response = await fetchApi("/api/onboard", { skipOnboarding: true });

    if (response.ok) {
      window.location.replace("/");
    } else {
      setIsSkippingOnboarding(false);
      throw new Error("Something went wrong");
    }
  };

  const handleContinueOnboarding = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsContinuingOnboarding(true);
    const response = await fetchApi("/api/onboard");
    if (response.ok) {
      const data = await response.json();
      router.push(data.redirectUrl);
    } else {
      setIsContinuingOnboarding(false);
      throw new Error("Something went wrong");
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signOut();
    setIsLoggingOut(true);
  };

  return (
    <>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h5">Complete your profile</Typography>
      </Stack>
      <Stack spacing={3}>
        <Typography color="text.secondary" variant="body2">
          To have access to all features, please complete onboarding.
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              name="skipOnboarding"
              id="accept-terms"
              checked={skipOnboarding}
              onChange={(e) => {
                setSkipOnboarding(e.target.checked);
              }}
            />
          }
          label={
            <Typography variant="body2">
              Skip onboarding and enter the demo
            </Typography>
          }
        />
        {skipOnboarding ? (
          <>
            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              variant="contained"
              onClick={handleSkipOnboarding}
              disabled={isSkippingOnboarding}
            >
              {isSkippingOnboarding ? "Entering demo..." : "Enter demo"}
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              variant="contained"
              onClick={handleContinueOnboarding}
              disabled={isContinuingOnboarding}
            >
              {isContinuingOnboarding
                ? "Continuing onboarding..."
                : "Continue onboarding"}
            </Button>
          </>
        )}
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleLogout}
          disabled={isLoggingOut}
          color="secondary"
          sx={{ mt: 3 }}
        >
          Log out
        </Button>
      </Stack>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default Page;
