import { faker } from "@faker-js/faker";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, Field, FormikProps, FormikValues } from "formik";
import { useRouter } from "next/router";
import React, { RefObject, useRef } from "react";
import * as Yup from "yup";

import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";

const CreateCardholderForm = ({
  formRef,
  onCreate,
}: {
  formRef: RefObject<FormikProps<FormikValues>>;
  onCreate: () => void;
}) => {
  const router = useRouter();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    address1: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State / Province is required"),
    postalCode: Yup.string().required("ZIP / Postal code is required"),
    country: Yup.string().required("Country is required"),
    accept: Yup.boolean()
      .required("The terms of service and privacy policy must be accepted.")
      .oneOf(
        [true],
        "The terms of service and privacy policy must be accepted.",
      ),
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
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
                <MenuItem value="US">United States</MenuItem>
              </Field>
            </Grid>
            <Grid item xs={12}>
              <Field
                type="checkbox"
                as={FormControlLabel}
                control={<Checkbox />}
                label={
                  <Typography variant="body2">
                    This cardholder has agreed to the{" "}
                    <Link href="#">Example Bank Authorized User Terms</Link> and{" "}
                    <Link href="#">Example Bank Privacy Policy.</Link>
                  </Typography>
                }
                name="accept"
                error={touched.accept && Boolean(errors.accept)}
                helperText={touched.accept && errors.accept}
              />
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

  const handleAutofill = () => {
    const form = formRef.current;
    if (form) {
      form.setValues({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode("#####"),
        country: "US",
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
