import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import NextLink from "next/link";
import { ReactNode, useCallback, useState } from "react";
import * as Yup from "yup";

import { useAuth } from "../../hooks/use-auth";
import AuthLayout from "../../layouts/auth/layout";

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
  const auth = useAuth();
  const [method, setMethod] = useState<"email" | "phoneNumber">("email");

  const handleMethodChange = useCallback(
    (event: React.SyntheticEvent, value: "email" | "phoneNumber") => {
      setMethod(value);
    },
    [],
  );

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
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Email" value="email" />
              <Tab label="Phone Number" value="phoneNumber" />
            </Tabs>
            {method === "email" && (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (
                  values,
                  { setStatus, setErrors, setSubmitting },
                ) => {
                  try {
                    await auth.login(values.email, values.password);
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
                      Continue
                    </Button>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={3}
                    >
                      <Alert color="primary" severity="info">
                        Password field is illustrative and not verified
                      </Alert>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
            {method === "phoneNumber" && (
              <div>
                <Typography sx={{ mb: 1 }} variant="h6">
                  Not available in the demo
                </Typography>
                <Typography color="text.secondary">
                  To prevent unnecessary costs we disabled this feature in the
                  demo.
                </Typography>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default Page;
