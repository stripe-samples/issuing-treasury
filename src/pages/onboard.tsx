import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
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
  Link,
  Divider,
  SvgIcon,
} from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { signOut } from "next-auth/react";
import React, { ChangeEvent, ReactNode, useState } from "react";
import * as Yup from "yup";

import AuthLayout from "src/layouts/auth/layout";
import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";

const validationSchema = Yup.object().shape({
  businessName: Yup.string().max(255).required("Business name is required"),
});

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
        <Typography variant="h5">Complete your profile</Typography>
        <Typography color="text.secondary" variant="body2">
          To have access to all features, please complete onboarding.
        </Typography>
      </Stack>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
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
                          Skip onboarding using prefilled info
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
    <DialogTitle>Enter Onboarding Test Data</DialogTitle>
    <Divider />
    <DialogContent>
      {/* <DialogContentText>Hello World</DialogContentText> */}
      <Stack spacing={2}>
        <Typography variant="body2">
          You&apos;ve selected to onboard using our interactive onboarding
          simulation. To complete the process, simply follow these steps:
        </Typography>
        <Typography variant="body2">
          These steps are also available{" "}
          <Link
            href="https://github.com/stripe-samples/issuing-treasury/tree/main#entering-connect-onboarding-test-data"
            target="_blank"
            underline="none"
          >
            here{" "}
            <SvgIcon fontSize="small" sx={{ verticalAlign: "top" }}>
              <ArrowTopRightOnSquareIcon />
            </SvgIcon>
          </Link>
          .
        </Typography>
        <ol>
          <li>
            <Typography variant="body2">
              Click &quot;Continue&quot; to initiate the simulation. You&apos;ll
              be guided through the verification steps.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              When prompted, use the following test details:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Test Phone Number:{" "}
                  <Chip variant="outlined" label="000 000 0000" size="small" />
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Test Email:{" "}
                  <Chip
                    variant="outlined"
                    label="Enter any fake email"
                    size="small"
                  />
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Test SMS Verification Code: Click{" "}
                  <Chip variant="outlined" label="Use test code" size="small" />
                </Typography>
              </li>
            </ul>
          </li>
          <li>
            <Typography variant="body2">
              Finally click{" "}
              <Chip variant="outlined" label="Skip this step" size="small" /> to
              skip &quot;Verifying your identity&quot;.
            </Typography>
          </li>
        </ol>
        <Typography variant="body2">
          It&apos;s important to know that all your required account information
          has been automatically generated for this simulation. Any attempt to
          use genuine personal information will result in a mismatch, preventing
          successful onboarding.
        </Typography>
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
