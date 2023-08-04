import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import NextLink from "next/link";
import router from "next/router";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";
import * as Yup from "yup";

import AuthLayout from "src/layouts/auth/layout";
import { fetchApi } from "src/utils/api-helpers";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  name: Yup.string().max(255).required("Name is required"),
  password: Yup.string().max(255).required("Password is required"),
});

const initialValues = {
  email: "",
  name: "ACME Corp.",
  password: "",
  submit: null,
};

const Page = () => {
  return (
    <>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 550, px: 3, py: "100px", width: "100%" }}>
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Register</Typography>
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
              onSubmit={async (
                values,
                { setStatus, setErrors, setSubmitting },
              ) => {
                try {
                  const registrationResponse = await fetchApi("/api/register", {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                  });
                  const data = await registrationResponse.json();

                  if (registrationResponse.ok) {
                    const response = await signIn("credentials", {
                      email: values.email,
                      password: values.password,
                      redirect: false,
                    });
                    if (response?.ok) {
                      router.push("/");
                    } else {
                      throw new Error("Something went wrong");
                    }
                  } else {
                    throw new Error(`Registration failed: ${data.error}`);
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
                      error={!!(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      label="Business Name"
                      name="name"
                    />
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
                    <Typography color="error" sx={{ mt: 3 }} variant="body2">
                      {errors.submit}
                    </Typography>
                  )}
                  <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Continue"}
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
