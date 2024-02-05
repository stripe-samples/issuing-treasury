import {
  Stack,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Chip,
  Divider,
} from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { signOut } from "next-auth/react";
import React, { ChangeEvent, ReactNode, useState } from "react";

import AuthLayout from "src/layouts/auth/layout";
import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";
import validationSchemas from "src/utils/validation_schemas";

const Page = () => {
  const [isContinuingSuccessfully, setIsContinuingSuccessfully] =
    useState(false);
  const [showConnectOnboardingGuide, setShowConnectOnboardingGuide] =
    useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initialValues = {
    businessName: "",
    ...(isDemoMode() && {
      // FOR-DEMO-ONLY: We're using a fake business name here but you should modify this line and collect a real business
      //  name from the user
      businessName: `Demo Innovative Inc.`,
      skipOnboarding: true,
    }),
    // TODO: See if we can improve the way we handle errors from the backend
    submit: null,
  };

  type OnboardResponse = {
    redirectUrl: string;
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setErrors }: FormikHelpers<typeof initialValues>,
  ) => {
    setIsContinuingSuccessfully(true);
    const response = await postApi("/api/onboard", {
      businessName: values.businessName,
      ...(isDemoMode() && { skipOnboarding: values.skipOnboarding }),
    });
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        if (result.data && "redirectUrl" in result.data) {
          const data = result.data as OnboardResponse;
          const redirectUrl = data.redirectUrl;
          window.location.replace(redirectUrl);
        } else {
          throw new Error("Something went wrong");
        }
      },
      onError: (error) => {
        setErrors({ submit: (error as Error).message });
        setIsContinuingSuccessfully(false);
      },
    });
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signOut();
    setIsLoggingOut(true);
  };

  return (
    <>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h5">Enter your business name</Typography>
        {isDemoMode() && (
          <Typography color="text.secondary" variant="body2">
            <>
              We&apos;ll create a demo account for this business. Accounts are
              deleted after 6 months of inactivity.
            </>
          </Typography>
        )}
      </Stack>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas.business.default}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, isValid, setFieldValue }) => {
          const submitButtonText = values.skipOnboarding
            ? isContinuingSuccessfully
              ? "Entering demo..."
              : "Enter demo"
            : isContinuingSuccessfully
              ? "Continuing..."
              : "Continue";

          return (
            <Form>
              <Stack spacing={2}>
                <Field
                  as={TextField}
                  error={!!(touched.businessName && errors.businessName)}
                  fullWidth
                  helperText={touched.businessName && errors.businessName}
                  label="Business Name"
                  name="businessName"
                />
                {isDemoMode() && (
                  <>
                    <Field
                      type="checkbox"
                      as={FormControlLabel}
                      name="skipOnboarding"
                      control={<Checkbox />}
                      onChange={(e: ChangeEvent) => {
                        const target = e.target as HTMLInputElement;
                        const checked = target.checked;
                        if (!checked) {
                          setShowConnectOnboardingGuide(true);
                        }
                        setFieldValue("skipOnboarding", checked);
                      }}
                      label={
                        <Typography variant="body2">
                          Skip the rest of onboarding
                        </Typography>
                      }
                    />
                    <ConnectOnboardingGuideDialog
                      showConnectOnboardingGuide={showConnectOnboardingGuide}
                      setShowConnectOnboardingGuide={
                        setShowConnectOnboardingGuide
                      }
                    />
                  </>
                )}
                {errors.submit && (
                  <Alert severity="error">{errors.submit}</Alert>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                  disabled={isContinuingSuccessfully || !isValid}
                >
                  {submitButtonText}
                </Button>
              </Stack>
            </Form>
          );
        }}
      </Formik>
      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={handleLogout}
        disabled={isLoggingOut}
        color="secondary"
        sx={{ mt: 2 }}
      >
        Log out
      </Button>
    </>
  );
};

const ConnectOnboardingGuideDialog = ({
  showConnectOnboardingGuide,
  setShowConnectOnboardingGuide,
}: {
  showConnectOnboardingGuide: boolean;
  setShowConnectOnboardingGuide: (show: boolean) => void;
}) => (
  <Dialog
    open={showConnectOnboardingGuide}
    onClose={() => setShowConnectOnboardingGuide(false)}
  >
    <DialogTitle>
      Use these test values in Stripe&apos;s hosted onboarding form
    </DialogTitle>
    <Divider />
    <DialogContent>
      {/* <DialogContentText>Hello World</DialogContentText> */}
      <Stack spacing={2}>
        <Typography variant="body2">
          To complete onboarding, you&apos;ll be redirected to Stripe&apos;s
          hosted onboarding form.
        </Typography>
        <Typography variant="body2">
          We&apos;ve prefilled the account data for this demo. If you don&apos;t
          follow these steps, you&apos;ll get an error.
        </Typography>
        <ol>
          <li>
            <Typography variant="body2">
              On the &quot;Let&apos;s get started&quot; screen, enter:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Mobile Number:{" "}
                  <Chip variant="outlined" label="000 000 0000" size="small" />
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Email:{" "}
                  <Chip
                    variant="outlined"
                    label="Any fake email address"
                    size="small"
                  />
                </Typography>
              </li>
            </ul>
          </li>
          <li>
            <Typography variant="body2">
              At &quot;Verify your mobile number&quot;, click{" "}
              <Chip variant="outlined" label="Use test code" size="small" />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              At &quot;Verify your identity&quot;, click{" "}
              <Chip variant="outlined" label="Skip this step" size="small" />
            </Typography>
          </li>
        </ol>
      </Stack>
    </DialogContent>
    <Divider />
    <DialogActions>
      <Button
        autoFocus
        variant="contained"
        onClick={() => {
          setShowConnectOnboardingGuide(false);
        }}
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

Page.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default Page;
