import {
  Stack,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  TextField,
} from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { signOut } from "next-auth/react";
import React, { ReactNode, useState } from "react";
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
    { setErrors, setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
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
      },
      onFinally: () => {
        setSubmitting(false);
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
        {({ errors, touched, isSubmitting, values }) => {
          const submitButtonText = values.skipOnboarding
            ? isSubmitting
              ? "Entering demo..."
              : "Enter demo"
            : isSubmitting
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
                  <Field
                    type="checkbox"
                    as={FormControlLabel}
                    name="skipOnboarding"
                    control={<Checkbox />}
                    label={
                      <Typography variant="body2">
                        Skip onboarding using prefilled info
                      </Typography>
                    }
                  />
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
                  disabled={isSubmitting}
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

Page.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default Page;
