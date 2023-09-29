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
import router from "next/router";
import { signIn } from "next-auth/react";
import { ReactNode, useState } from "react";
import * as Yup from "yup";

import AuthLayout from "src/layouts/auth/layout";
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

const validationSchema = Yup.object({
  email: Yup.string().max(255).required("Email is required"),
  password: Yup.string().max(255).required("Password is required"),
});

const Page = () => {
  const { callbackUrl } = router.query;
  const [isContinuingSuccessfully, setIsContinuingSuccessfully] =
    useState(false);

  const initialValues = {
    email: "",
    password: "",
    submit: null,
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setStatus, setErrors }: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      setIsContinuingSuccessfully(true);
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.ok) {
        router.push((callbackUrl ?? "/") as string);
      } else if (response?.error === "CredentialsSignin") {
        if (isDemoMode()) {
          throw new Error(
            "Incorrect email or password. Demo accounts inactive for 6 months are deleted.",
          );
        } else {
          throw new Error("Incorrect email or password.");
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      setStatus({ success: false });
      setErrors({ submit: (err as Error).message });
      setIsContinuingSuccessfully(false);
    }
  };

  return (
    <>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h5">Login</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account? &nbsp;
          <Link
            component={NextLink}
            href="/auth/register"
            underline="hover"
            variant="subtitle2"
          >
            Register
          </Link>
        </Typography>
      </Stack>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
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
                helperText={touched.password && errors.password}
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
                disabled={isContinuingSuccessfully}
              >
                {isContinuingSuccessfully ? "Logging in..." : "Continue"}
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
