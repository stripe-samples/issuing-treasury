import {
  Box,
  Stack,
  Typography,
  Button,
  Alert,
  Chip,
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
            <Alert severity="info" color="primary">
              <Stack spacing={2}>
                <Typography variant="body2">
                  Welcome to our interactive onboarding simulation! To complete
                  the process, simply follow these steps:
                </Typography>
                <ol>
                  <li>
                    Click &quot;Continue onboarding&quot; to initiate the
                    simulation. You&apos;ll be guided through the verification
                    steps.
                  </li>
                  <li>
                    When prompted, use the following test details:
                    <ul>
                      <li>
                        Test Phone Number:{" "}
                        <Chip
                          variant="outlined"
                          label="000 000 0000"
                          size="small"
                        />
                      </li>
                      <li>
                        Test Email:{" "}
                        <Chip
                          variant="outlined"
                          label="Enter any fake email"
                          size="small"
                        />
                      </li>
                      <li>
                        Test SMS Verification Code: Click{" "}
                        <Chip
                          variant="outlined"
                          label="Use test code"
                          size="small"
                        />
                      </li>
                    </ul>
                  </li>
                  <li>
                    Finally click{" "}
                    <Chip
                      variant="outlined"
                      label="Skip this step"
                      size="small"
                    />{" "}
                    to skip &quot;Verifying your identity&quot;.
                  </li>
                </ol>
                <Typography variant="body2">
                  It&apos;s important to know that all your required account
                  information has been automatically generated for this
                  simulation. Any attempt to use genuine personal information
                  will result in a mismatch, preventing successful onboarding.
                </Typography>
              </Stack>
            </Alert>
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
