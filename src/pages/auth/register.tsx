import { faker } from "@faker-js/faker";
import {
  Alert,
  Box,
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
import { ReactNode } from "react";
import * as Yup from "yup";

import AuthLayout from "src/layouts/auth/layout";
import { fetchApi } from "src/utils/api-helpers";
import { capitalize } from "src/utils/format";
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
  username: Yup.string().max(255).required("Username is required"),
  password: Yup.string()
    .max(255)
    .required("Password is required")
    // check minimum characters
    .min(8, "Password must have at least 8 characters")
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  businessName: Yup.string().max(255).required("Business name is required"),
});

const Page = () => {
  const initialValues = {
    username: "",
    password: "",
    // FOR-DEMO-ONLY: We're using a fake email here but you should modify this line and collect a real email from the
    // user
    email: `demo-user${faker.number.int({ max: 1000 })}@some-company.com`,
    // FOR-DEMO-ONLY: We're using a fake business name here but you should modify this line and collect a real business
    //  name from the user
    businessName: `Demo Innovative Inc.`,
    submit: null,
  };

  const handleSubmit = async (
    values: typeof initialValues,
    {
      setStatus,
      setErrors,
      setSubmitting,
    }: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      const registrationResponse = await fetchApi("/api/register", {
        username: values.username,
        password: values.password,
        email: values.email,
        businessName: values.businessName,
      });

      if (registrationResponse.ok) {
        const signInResponse = await signIn("credentials", {
          username: values.username,
          password: values.password,
          callbackUrl: "/",
        });
        if (signInResponse?.error) {
          throw new Error("Something went wrong");
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      setStatus({ success: false });
      setErrors({ submit: (err as Error).message });
      setSubmitting(false);
    }
  };

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
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Stack spacing={3}>
                    <Field
                      as={TextField}
                      error={!!(touched.username && errors.username)}
                      fullWidth
                      helperText={touched.username && errors.username}
                      label="Username"
                      name="username"
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
                    <Alert severity="info" color="primary" icon={false}>
                      Password must be at least 8 characters with a number, a
                      lowercase character, and an uppercase character.
                    </Alert>
                    <Field
                      as={TextField}
                      error={!!(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label="Email Address"
                      name="email"
                      disabled={true}
                    />
                    <Field
                      as={TextField}
                      error={!!(touched.businessName && errors.businessName)}
                      fullWidth
                      helperText={touched.businessName && errors.businessName}
                      label="Business Name"
                      name="businessName"
                      disabled={true}
                    />
                    <Alert severity="info" color="primary">
                      Email address and business name are automatically
                      generated as part of the demo.
                    </Alert>
                  </Stack>
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
