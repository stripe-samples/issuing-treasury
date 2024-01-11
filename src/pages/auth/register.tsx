import {
  Alert,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Divider,
  Tooltip,
  SelectChangeEvent,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
<<<<<<< HEAD
import { ReactNode, useState, ReactElement, useContext } from "react";
import * as Yup from "yup";
=======
import { ReactNode, useState, ReactElement } from "react";
>>>>>>> d669675 (centralize some validations)

import AuthLayout from "src/layouts/auth/layout";
// import { COUNTRIES } from "src/types/constants";
import UseCase from "src/types/use_cases";
import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import { isDemoMode } from "src/utils/demo-helpers";
import { Platform, enabledPlatforms } from "src/utils/platform";
import {
  RegistrationMode,
  RegistrationModeContext,
} from "src/utils/registration-mode-context";
import { getSessionForLoginOrRegisterServerSideProps } from "src/utils/session-helpers";
import validationSchemas from "src/utils/validation_schemas";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSessionForLoginOrRegisterServerSideProps(context);

  if (session != null) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const {
    [Platform.US]: enableUS,
    [Platform.UK]: enableUK,
    [Platform.EU]: enableEU,
  } = enabledPlatforms();

  return { props: { enableUS, enableUK, enableEU } };
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

const Page = ({
  enableUS,
  enableUK,
  enableEU,
}: {
  enableUS: boolean;
  enableUK: boolean;
  enableEU: boolean;
}) => {
  const [isContinuingSuccessfully, setIsContinuingSuccessfully] =
    useState(false);
  const { setMode } = useContext(RegistrationModeContext);

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
        validationSchema={validationSchemas.user}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isValid, dirty, values, setFieldValue }) => (
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
              <Field
                as={TextField}
                label="Country"
                name="country"
                select
                onChange={(_: SelectChangeEvent, element: ReactElement) => {
                  const country = element.props.value;
                  setFieldValue("country", element.props.value);

                  if (country == "US") {
                    setMode(RegistrationMode.IssuingTreasury);
                    setFieldValue("useCase", UseCase.EmbeddedFinance);
                  } else {
                    setMode(RegistrationMode.Issuing);
                    setFieldValue("useCase", UseCase.ExpenseManagement);
                  }
                }}
              >
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
                <MenuItem value="US" disabled={!enableUS}>
                  United States
                </MenuItem>
              </Field>
              <Divider />
              <Field
                as={RadioGroup}
                label="Use case"
                name="useCase"
                error={!!(touched.useCase && errors.useCase)}
              >
                <FormLabel sx={{ mb: 2 }}>
                  Which financial product would you like to register to use?
                </FormLabel>
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
                      <>
                        <Typography>
                          Full-stack financial services for your business
                        </Typography>
                        <Typography variant="caption">
                          Create cards, make payments, and send and receive
                          money with a financial account
                        </Typography>
                      </>
                    }
                    disabled={values.country != "US"}
                  />
                </Tooltip>
                <Tooltip
                  title={
                    values.country == "US" &&
                    isDemoMode() &&
                    "This financial product is not yet available in this demo for US businesses"
                  }
                >
                  <FormControlLabel
                    value={UseCase.ExpenseManagement}
                    control={<Radio />}
                    label="A commercial pre-funded card issuing program"
                    disabled={values.country == "US"}
                  />
                </Tooltip>
              </Field>
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
