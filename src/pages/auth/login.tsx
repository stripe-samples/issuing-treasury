import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import NextLink from "next/link";
import router from "next/router";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";
import * as Yup from "yup";

import AuthLayout from "src/layouts/auth/layout";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string().max(255).required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
  submit: null,
};

const Page = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
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
              onSubmit={async (
                values,
                { setStatus, setErrors, setSubmitting },
              ) => {
                try {
                  const response = await signIn("credentials", {
                    email: values.email,
                    password: values.password,
                    redirect: false,
                  });
                  if (response?.ok) {
                    router.push("/");
                  } else if (response?.error === "CredentialsSignin") {
                    throw new Error("Invalid credentials");
                  } else {
                    throw new Error("Something went wrong");
                  }
                } catch (err) {
                  setStatus({ success: false });
                  setErrors({ submit: (err as Error).message });
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Stack spacing={3}>
                    <Field
                      as={TextField}
                      error={!!(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label="Email Address"
                      name="email"
                      type="email"
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
                  </Stack>
                  {errors.submit && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={3}
                    >
                      <Alert severity="error">{errors.submit}</Alert>
                    </Box>
                  )}
                  <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Continue
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default Page;
