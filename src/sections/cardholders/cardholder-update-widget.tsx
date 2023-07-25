import { PencilIcon } from "@heroicons/react/24/solid";
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
  SvgIcon,
  Typography,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import React from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  accept: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and privacy policy",
  ),
});

const initialValues = {
  accept: false,
};

const CardholderUpdateWidget = ({ cardholderId }: { cardholderId: string }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");

  return (
    <div>
      <Button
        startIcon={
          <SvgIcon fontSize="small">
            <PencilIcon />
          </SvgIcon>
        }
        onClick={() => setShowModal(true)}
        variant="contained"
      >
        Update
      </Button>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle>Update Cardholder</DialogTitle>
        <Divider />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const body = {
                cardholderId: cardholderId,
              };
              const response = await fetch("api/update_cardholder", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(body),
              });

              if (response.ok) {
                window.location.replace("/cardholders");
              } else {
                setSubmitting(false);
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
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={3}>
                  {errorText != "" && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="error">
                        {errorText}
                      </Typography>
                    </Grid>
                  )}
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
              </DialogContent>
              <Divider />
              <DialogActions>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                >
                  {isSubmitting
                    ? "Updating cardholder..."
                    : "Update cardholder"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default CardholderUpdateWidget;
