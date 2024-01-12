import {
  Alert,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Divider,
  Box,
  Tooltip,
  SelectChangeEvent,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
import { ReactNode, useState, ReactElement } from "react";
import * as Yup from "yup";

import AuthLayout from "src/layouts/auth/layout";
import UseCase from "src/types/use_cases";
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
    country: "US",
    useCase: UseCase.EmbeddedFinance,
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
      useCase: values.useCase,
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
        {({ errors, touched, isValid, dirty, values, setFieldValue }) => (
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
              <Field
                as={Select}
                label="Country"
                name="country"
                fullWidth
                onChange={(_: SelectChangeEvent, element: ReactElement) => {
                  const country = element.props.value;
                  setFieldValue("country", element.props.value);

                  if (country == "US") {
                    setFieldValue("useCase", UseCase.EmbeddedFinance);
                  } else {
                    setFieldValue("useCase", UseCase.ExpenseManagement);
                  }
                }}
              >
                <MenuItem value="AT">Austria</MenuItem>
                <MenuItem value="BE">Belgium</MenuItem>
                <MenuItem value="HR">Croatia</MenuItem>
                <MenuItem value="CY">Cyprus</MenuItem>
                <MenuItem value="EE">Estonia</MenuItem>
                <MenuItem value="FI">Finland</MenuItem>
                <MenuItem value="FR">France</MenuItem>
                <MenuItem value="DE">Germany</MenuItem>
                <MenuItem value="GR">Greece</MenuItem>
                <MenuItem value="IE">Ireland</MenuItem>
                <MenuItem value="IT">Italy</MenuItem>
                <MenuItem value="LV">Latvia</MenuItem>
                <MenuItem value="LT">Lithuania</MenuItem>
                <MenuItem value="LU">Luxembourg</MenuItem>
                <MenuItem value="MT">Malta</MenuItem>
                <MenuItem value="NL">Netherlands</MenuItem>
                <MenuItem value="PT">Portugal</MenuItem>
                <MenuItem value="SK">Slovakia</MenuItem>
                <MenuItem value="SI">Slovenia</MenuItem>
                <MenuItem value="ES">Spain</MenuItem>
                <MenuItem value="GB">United Kingdom</MenuItem>
                <MenuItem value="US">United States</MenuItem>
              </Field>
              <Divider />
              <FormLabel>What kind of app are you building?</FormLabel>
              <Field
                as={RadioGroup}
                label="Use case"
                name="useCase"
                fullWidth
                error={!!(touched.useCase && errors.useCase)}
              >
                <Tooltip
                  title={
                    values.country != "US" &&
                    "Embedded finance is not yet supported in the selected country"
                  }
                >
                  <FormControlLabel
                    value={UseCase.EmbeddedFinance}
                    control={<Radio />}
                    label={
                      <Box mb={2}>
                        <Typography variant="button" display="block">
                          Embedded finance
                        </Typography>
                        <Typography variant="caption">
                          Full-stack financial services for your users
                        </Typography>
                      </Box>
                    }
                    disabled={values.country != "US"}
                  />
                </Tooltip>

                <Tooltip
                  title={
                    values.country == "US" &&
                    "Expense management in the US is not yet suported in the demo app"
                  }
                >
                  <FormControlLabel
                    value={UseCase.ExpenseManagement}
                    control={<Radio />}
                    label={
                      <>
                        <Typography variant="button" display="block">
                          Expense management
                        </Typography>
                        <Typography variant="caption">
                          A commercial pre-funded card issuing program
                        </Typography>
                      </>
                    }
                    disabled={values.country == "US"}
                  />
                </Tooltip>
              </Field>

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
