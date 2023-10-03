import {
  Alert,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
import { ReactNode, useState } from "react";
import * as Yup from "yup";

import AuthLayout from "src/layouts/auth/layout";
import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";
import { getSessionForLoginOrRegisterServerSideProps } from "src/utils/session-helpers";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForLoginOrRegisterServerSideProps(context);

  if (session != null) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
};

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string()
    .max(255)
    .required("Password is required")
    // check minimum characters
    .min(8, "Password must have at least 8 characters")
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
});

const Page = () => {
  const [isContinuingSuccessfully, setIsContinuingSuccessfully] =
    useState(false);

  const initialValues = {
    email: "",
    password: "",
    // TODO: See if we can improve the way we handle errors from the backend
    submit: null,
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setErrors }: FormikHelpers<typeof initialValues>,
  ) => {
    setIsContinuingSuccessfully(true);
    const response = await postApi("/api/register", {
      email: values.email,
      password: values.password,
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
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isValid, dirty }) => (
          <Form>
            <Stack spacing={3}>
              <Field
                as={TextField}
                error={!!(touched.email && errors.email)}
                fullWidth
                helperText={touched.email && errors.email}
                label="Email"
                name="email"
              />
              <Field
                as={TextField}
                error={!!(touched.password && errors.password)}
                fullWidth
                helperText={
                  (touched.password && errors.password) ||
                  "Password must be at least 8 characters with a number, a lowercase character, and an uppercase character."
                }
                label="Password"
                name="password"
                type="password"
              />
              {errors.submit && <Alert severity="error">{errors.submit}</Alert>}
              <Button
                fullWidth
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
