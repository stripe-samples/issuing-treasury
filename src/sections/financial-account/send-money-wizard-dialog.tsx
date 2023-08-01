import {
  Dialog,
  DialogTitle,
  Divider,
  Button,
  DialogContent,
  DialogActions,
  Typography,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import { useMachine } from "@xstate/react";
import {
  Formik,
  Form,
  Field,
  FormikProps,
  FormikValues,
  ErrorMessage,
} from "formik";
import React, { RefObject, useRef } from "react";
import * as Yup from "yup";

import stateMachine from "src/sections/financial-account/send-money-wizard-state-machine";

const SelectingNetworkForm = ({
  formRef,
  onFormSubmit,
}: {
  formRef: RefObject<FormikProps<FormikValues>>;
  onFormSubmit: () => void;
}) => {
  const initialValues = {
    network: "",
  };
  const validationSchema = Yup.object().shape({
    network: Yup.string().required("Please select a network"),
  });

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        onFormSubmit();
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Typography>
            In this demo you can test an experience for sending funds from a
            Treasury Financial Account to an external 3rd party US bank account.
            Depending on the network type, timing for funds to be available may
            vary.
          </Typography>
          <Typography>
            You can set the status of the transaction before sending the payment
            for demo purposes. Do not forget to check the Financial Account
            balance afterwards!
          </Typography>
          <FormLabel htmlFor="network">Network</FormLabel>
          <Field as={RadioGroup} aria-label="network" name="network">
            <FormControlLabel value="ach" control={<Radio />} label="ACH" />
            <FormControlLabel
              value="us_domestic_wire"
              control={<Radio />}
              label="Wire Transfer"
            />
          </Field>
          <ErrorMessage name="network">
            {(errorMsg: string) => (
              <FormHelperText error={Boolean(errors.network)}>
                {errorMsg}
              </FormHelperText>
            )}
          </ErrorMessage>
        </Form>
      )}
    </Formik>
  );
};

const SendMoneyWizardDialog = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [current, send] = useMachine(stateMachine);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleNext = () => {
    send("NEXT");
  };

  const handleBack = () => {
    send("BACK");
  };

  const selectingNetworkFormRef = useRef<FormikProps<FormikValues>>(null);
  const handleSubmitForm = () => {
    const selectingNetworkForm = selectingNetworkFormRef.current;
    if (selectingNetworkForm) {
      selectingNetworkForm.submitForm();
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        Send Money
      </Button>
      <Dialog open={showModal} onClose={handleClose}>
        <DialogTitle>Send Money</DialogTitle>
        <Divider />
        <DialogContent>
          {current.matches("selectingNetwork") && (
            <SelectingNetworkForm
              formRef={selectingNetworkFormRef}
              onFormSubmit={handleNext}
            />
          )}
          {current.matches("collectingDestinationAddress") && (
            <div>collectingDestinationAddress</div>
          )}
          {current.matches("confirmingTransfer") && <div>selectingNetwork</div>}
        </DialogContent>
        <Divider />
        <DialogActions>
          {current.matches("selectingNetwork") && (
            <div>
              <Button id="foo" onClick={handleNext} variant="contained">
                Next
              </Button>
              <Button onClick={handleSubmitForm}>Submit</Button>
            </div>
          )}
          {current.matches("collectingDestinationAddress") && (
            <div>
              <Button onClick={handleBack} variant="contained">
                Back
              </Button>
              <Button onClick={handleNext} variant="contained">
                Next
              </Button>
            </div>
          )}
          {current.matches("confirmingTransfer") && (
            <div>
              <Button onClick={handleBack} variant="contained">
                Back
              </Button>
              <Button variant="contained">Transfer</Button>
            </div>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SendMoneyWizardDialog;
