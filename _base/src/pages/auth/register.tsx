import {
  Alert,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
import { ReactNode, useState } from "react";

import AuthLayout from "src/layouts/auth/layout";
// import { COUNTRIES } from "src/types/constants";
import {
  PlatformStripeAccount,
  enabledPlatforms,
} from "src/utils/account-management-helpers";
import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";
import { getSessionForLoginOrRegisterServerSideProps } from "src/utils/session-helpers";
import validationSchemas from "src/utils/validation-schemas";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForLoginOrRegisterServerSideProps(context);

  if (session != null) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const {
    // @if financialProduct==embedded-finance
    [PlatformStripeAccount.US]: enableUS,
    // @endif
    // @if financialProduct==expense-management
    [PlatformStripeAccount.UK]: enableUK,
    [PlatformStripeAccount.EU]: enableEU,
    // @endif
  } = enabledPlatforms();

  return {
    props: {
      // @if financialProduct==embedded-finance
      enableUS,
      // @endif
      // @if financialProduct==expense-management
      enableUK,
      enableEU,
      // @endif
    },
  };
};

const Page = ({
  // @if financialProduct==embedded-finance
  enableUS,
  // @endif
  // @if financialProduct==expense-management
  enableUK,
  enableEU,
  // @endif
}: {
  // @if financialProduct==embedded-finance
  enableUS: boolean;
  // @endif
  // @if financialProduct==expense-management
  enableUK: boolean;
  enableEU: boolean;
  // @endif
}) => {
  const [isContinuingSuccessfully, setIsContinuingSuccessfully] =
    useState(false);

  const initialValues = {
    email: "",
    password: "",
    // TODO: See if we can improve the way we handle errors from the backend
    submit: null,
    // @if financialProduct==expense-management
    ...{
      country: "GB",
    },
    // @endif
    // @if financialProduct==embedded-finance
    ...{
      country: "US",
    },
    // @endif
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setErrors }: FormikHelpers<typeof initialValues>,
  ) => {
    setIsContinuingSuccessfully(true);
    const response = await postApi("/api/register", {
      email: values.email,
      password: values.password,
      country: values.country,
    });
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        const signInResponse = await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: "/",
        });
        if (signInResponse?.error) {
          throw new Error("Something went wrong");
        }
      },
      onError: (error) => {
        setErrors({ submit: (error as Error).message });
        setIsContinuingSuccessfully(false);
      },
    });
  };

  return (
    <>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h5">
          Create
          {isDemoMode() ? " a demo account" : " an account"}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?&nbsp;
          <Link
            component={NextLink}
            href="/auth/login"
            underline="hover"
            variant="subtitle2"
          >
            Log in
          </Link>
        </Typography>
      </Stack>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas.user}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          isValid,
          dirty,
          // @begin-exclude-from-subapps
          values,
          // @end-exclude-from-subapps
        }) => (
          <Form>
            <Stack spacing={3}>
              <Field
                as={TextField}
                error={!!(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                label="Email"
                name="email"
              />
              <Field
                as={TextField}
                error={!!(touched.password && errors.password)}
                helperText={
                  (touched.password && errors.password) ||
                  "Password must be at least 8 characters with a number, a lowercase character, and an uppercase character."
                }
                label="Password"
                name="password"
                type="password"
              />
              <Field as={TextField} label="Country" name="country" select>
                {/* @if financialProduct==expense-management */}
                <MenuItem value="AT" disabled={!enableEU}>
                  Austria
                </MenuItem>
                <MenuItem value="BE" disabled={!enableEU}>
                  Belgium
                </MenuItem>
                <MenuItem value="HR" disabled={!enableEU}>
                  Croatia
                </MenuItem>
                <MenuItem value="CY" disabled={!enableEU}>
                  Cyprus
                </MenuItem>
                <MenuItem value="EE" disabled={!enableEU}>
                  Estonia
                </MenuItem>
                <MenuItem value="FI" disabled={!enableEU}>
                  Finland
                </MenuItem>
                <MenuItem value="FR" disabled={!enableEU}>
                  France
                </MenuItem>
                <MenuItem value="DE" disabled={!enableEU}>
                  Germany
                </MenuItem>
                <MenuItem value="GR" disabled={!enableEU}>
                  Greece
                </MenuItem>
                <MenuItem value="IE" disabled={!enableEU}>
                  Ireland
                </MenuItem>
                <MenuItem value="IT" disabled={!enableEU}>
                  Italy
                </MenuItem>
                <MenuItem value="LV" disabled={!enableEU}>
                  Latvia
                </MenuItem>
                <MenuItem value="LT" disabled={!enableEU}>
                  Lithuania
                </MenuItem>
                <MenuItem value="LU" disabled={!enableEU}>
                  Luxembourg
                </MenuItem>
                <MenuItem value="MT" disabled={!enableEU}>
                  Malta
                </MenuItem>
                <MenuItem value="NL" disabled={!enableEU}>
                  Netherlands
                </MenuItem>
                <MenuItem value="PT" disabled={!enableEU}>
                  Portugal
                </MenuItem>
                <MenuItem value="SK" disabled={!enableEU}>
                  Slovakia
                </MenuItem>
                <MenuItem value="SI" disabled={!enableEU}>
                  Slovenia
                </MenuItem>
                <MenuItem value="ES" disabled={!enableEU}>
                  Spain
                </MenuItem>
                <MenuItem value="GB" disabled={!enableUK}>
                  United Kingdom
                </MenuItem>
                {/* @endif */}
                {/* @if financialProduct==embedded-finance */}
                <MenuItem value="US" disabled={!enableUS}>
                  United States
                </MenuItem>
                {/* @endif */}
              </Field>
              {/* @begin-exclude-from-subapps */}
              {values.country == "US" ? (
                <Typography color="neutral.500" variant="body2">
                  Create commercial cards and bank account replacements; create
                  cardholders, issue virtual or physical cards for spending,
                  fund accounts, send and receive money, view transactions, and
                  more.
                </Typography>
              ) : (
                <Typography color="neutral.500" variant="body2">
                  Create commercial cards; create cardholders, issue virtual or
                  physical cards for spending, view transactions, and more.
                </Typography>
              )}
              {/* @end-exclude-from-subapps */}
              {errors.submit && <Alert severity="error">{errors.submit}</Alert>}
              <Button
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled={!dirty || isContinuingSuccessfully || !isValid}
              >
                {isContinuingSuccessfully ? "Continuing..." : "Continue"}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default Page;
