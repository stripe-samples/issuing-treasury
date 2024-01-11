import { allFakers } from "@faker-js/faker";
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
import clm from "country-locale-map";
import { Formik, Form, Field, FormikProps, FormikValues } from "formik";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { RefObject, useRef } from "react";

import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";
import validationSchemas from "src/utils/validation_schemas";

const validCardholderCountries = (
  country: string,
): { name: string; code: string }[] => {
  if (country == "US") {
    return [{ name: "United States", code: "US" }];
  }

  if (country == "GB") {
    return [{ name: "United Kingdom", code: "GB" }];
  }

  return [
    { name: "Austria", code: "AT" },
    { name: "Belgium", code: "BE" },
    { name: "Croatia", code: "HR" },
    { name: "Cyprus", code: "CY" },
    { name: "Estonia", code: "EE" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "Greece", code: "GR" },
    { name: "Ireland", code: "IE" },
    { name: "Italy", code: "IT" },
    { name: "Latvia", code: "LV" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Malta", code: "MT" },
    { name: "Netherlands", code: "NL" },
    { name: "Portugal", code: "PT" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Spain", code: "ES" },
  ];
};

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

  let validationSchema;
  if (country == "US") {
    validationSchema = validationSchemas.cardholder.default;
  } else {
    validationSchema = validationSchemas.cardholder.withSCA;
  }

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    accept: false,
  };

  const [errorText, setErrorText] = React.useState("");

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
                required
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
                {validCardholderCountries(country).map((validCountry) => (
                  <MenuItem key={validCountry.code} value={validCountry.code}>
                    {validCountry.name}
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
      const locale = clm.getLocaleByAlpha2(country) || "en_US";
      const faker =
        allFakers[locale as keyof typeof allFakers] || allFakers["en_US"];

      let state;
      let zipCode;
      if (country == "US") {
        state = faker.location.state();
        zipCode = faker.location.zipCode("#####");
      } else {
        state = faker.location.county();
        zipCode = faker.location.zipCode();
      }

      form.setValues({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phoneNumber: faker.phone.number(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: state,
        postalCode: zipCode,
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
