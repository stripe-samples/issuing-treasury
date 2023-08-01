import {
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
import React, { RefObject, useRef } from "react";
import * as Yup from "yup";

const CreateCardholderForm = ({
  formRef,
}: {
  formRef: RefObject<FormikProps<FormikValues>>;
}) => {
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
    accept: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and privacy policy",
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

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await fetch("api/add_cardholder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            window.location.replace("/cardholders");
          } else {
            const result = await response.json();
            setErrorText(result.error);
          }
        } catch (error) {
          setErrorText("An error occurred. Please try again later.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid container spacing={3}>
            {errorText != "" && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error">
                  {errorText}
                </Typography>
              </Grid>
            )}

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
              <FormControlLabel
                control={
                  <Field as={Checkbox} name="accept" id="accept-terms" />
                }
                label={
                  <Typography variant="body2">
                    This cardholder has agreed to the{" "}
                    <Link href="https://stripe.com/legal/issuing/celtic-authorized-user-terms">
                      Celtic Bank Authorized User Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="https://www.celticbank.com/privacy">
                      Celtic Bank Privacy Policy.
                    </Link>
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const CardholderCreateWidget = () => {
  const [showModal, setShowModal] = React.useState(false);

  const formRef = useRef<FormikProps<FormikValues>>(null);
  const handleSubmit = async () => {
    const form = formRef.current;
    if (form) {
      form.submitForm();
    }
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)} variant="contained">
        Add
      </Button>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        id="new-cardholder-modal"
      >
        <DialogTitle>Add New Cardholder</DialogTitle>
        <Divider />
        <DialogContent>
          <CreateCardholderForm formRef={formRef} />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button>Autofill with test data</Button>
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
