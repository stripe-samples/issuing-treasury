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
  Typography,
} from "@mui/material";
import { Formik, Form, Field, FormikValues } from "formik";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";

import {
  extractJsonFromResponse,
  handleResult,
  putApi,
} from "src/utils/api-helpers";

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
  const router = useRouter();

  const [showModal, setShowModal] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const response = await putApi("api/cardholders", {
      cardholderId: cardholderId,
    });
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        await router.push("/cardholders");
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
    <div>
      <Button onClick={() => setShowModal(true)} variant="contained">
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
          onSubmit={handleSubmit}
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
                      control={<Field as={Checkbox} name="accept" />}
                      label={
                        <Typography variant="body2">
                          This cardholder has agreed to the{" "}
                          <Link href="https://stripe.com/legal/issuing/celtic-authorized-user-terms">
                            Example Bank Authorized User Terms
                          </Link>{" "}
                          and{" "}
                          <Link href="https://www.celticbank.com/privacy">
                            Example Bank Privacy Policy.
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
