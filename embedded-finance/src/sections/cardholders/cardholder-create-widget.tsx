import { Faker } from "@faker-js/faker";
import {
  Alert,
  Button,
  Checkbox,
  CheckboxProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, Field, FormikProps, FormikValues } from "formik";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { RefObject, useRef } from "react";

import { getSupportedCountryConfigsInRegion } from "src/utils/account-management-helpers";
import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import {
  getFakeAddressByCountry,
  getFakePhoneByCountry,
  LocalizedFakerMap,
} from "src/utils/demo-helpers";
import validationSchemas from "src/utils/validation-schemas";

const CreateCardholderForm = ({
  formRef,
  onCreate,
}: {
  formRef: RefObject<FormikProps<FormikValues>>;
  onCreate: () => void;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country } = session;

  const validationSchema = (() => {
    return validationSchemas.cardholder.default;
  })();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    country: country,
    accept: false,
  };

  const [errorText, setErrorText] = React.useState("");

  // Get all the countries that are supported by the platform Stripe Account
  const countryConfigs = getSupportedCountryConfigsInRegion(country);

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const response = await postApi("api/cardholders", values);
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        await router.push("/cardholders");
        onCreate();
      },
      onError: (error) => {
        setErrorText(`Error: ${error.message}`);
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  // For SCA in EU/UK
  const phoneNumberRequired = () => {
    return false;
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                fullWidth
                required
                label="First name"
                name="firstName"
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                fullWidth
                required
                label="Last name"
                name="lastName"
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                fullWidth
                required
                label="Email address"
                name="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                fullWidth
                required={phoneNumberRequired}
                label="Phone number"
                name="phoneNumber"
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                fullWidth
                required
                label="Street address"
                name="address1"
                error={touched.address1 && Boolean(errors.address1)}
                helperText={touched.address1 && errors.address1}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field
                as={TextField}
                fullWidth
                required
                label="City"
                name="city"
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field
                as={TextField}
                fullWidth
                required
                label="State / Province"
                name="state"
                error={touched.state && Boolean(errors.state)}
                helperText={touched.state && errors.state}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field
                as={TextField}
                fullWidth
                required
                label="ZIP / Postal code"
                name="postalCode"
                error={touched.postalCode && Boolean(errors.postalCode)}
                helperText={touched.postalCode && errors.postalCode}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                fullWidth
                select
                required
                label="Country"
                name="country"
                error={touched.country && Boolean(errors.country)}
                helperText={touched.country && errors.country}
              >
                {countryConfigs.map((countryConfig) => (
                  <MenuItem key={countryConfig.code} value={countryConfig.code}>
                    {countryConfig.name}
                  </MenuItem>
                ))}
              </Field>
            </Grid>
            <Grid item xs={12}>
              <FormControl error={touched.accept && Boolean(errors.accept)}>
                <Field
                  name="accept"
                  type="checkbox"
                  as={(props: CheckboxProps) => (
                    <FormControlLabel
                      control={<Checkbox {...props} />}
                      label={
                        <Typography variant="body2">
                          This cardholder has agreed to the{" "}
                          <Link href="#">
                            Example Bank Authorized User Terms
                          </Link>{" "}
                          and <Link href="#">Example Bank Privacy Policy.</Link>
                        </Typography>
                      }
                    />
                  )}
                />
                {touched.accept && errors.accept && (
                  <FormHelperText>{errors.accept.toString()}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {errorText !== "" && (
              <Grid item xs={12}>
                <Alert severity="error">{errorText}</Alert>
              </Grid>
            )}
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const CardholderCreateWidget = () => {
  const [showModal, setShowModal] = React.useState(false);

  const formRef = useRef<FormikProps<FormikValues>>(null);

  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country } = session;

  const handleAutofill = () => {
    const form = formRef.current;
    if (form) {
      const faker = LocalizedFakerMap[country] as Faker;

      const generateNamesWithMaxLength = (maxLength: number) => {
        let firstName, lastName;
        do {
          firstName = faker.person.firstName();
          lastName = faker.person.lastName();
        } while (firstName.length + lastName.length >= maxLength);
        return { firstName, lastName };
      };
      const { firstName, lastName } = generateNamesWithMaxLength(24);

      const fakeAddress = getFakeAddressByCountry(country);

      form.setValues({
        firstName: firstName,
        lastName: lastName,
        email: faker.internet.email().toLowerCase(),
        phoneNumber: getFakePhoneByCountry(country),
        address1: fakeAddress.address1,
        city: fakeAddress.city,
        state: fakeAddress.state,
        postalCode: fakeAddress.postalCode,
        country: country,
        accept: true,
      });
    }
  };

  const handleSubmit = async () => {
    const form = formRef.current;
    if (form) {
      form.submitForm();
    }
  };

  const handleCreate = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)} variant="contained">
        Create a new cardholder
      </Button>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        id="new-cardholder-modal"
      >
        <DialogTitle>Add new cardholder</DialogTitle>
        <Divider />
        <DialogContent>
          <CreateCardholderForm formRef={formRef} onCreate={handleCreate} />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleAutofill}>Autofill with test data</Button>
          <Button
            disabled={formRef.current?.isSubmitting}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {formRef.current?.isSubmitting
              ? "Adding cardholder..."
              : "Add cardholder"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CardholderCreateWidget;
