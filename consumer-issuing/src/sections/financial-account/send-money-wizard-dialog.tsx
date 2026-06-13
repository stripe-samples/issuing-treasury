import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
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
  TextField,
  Grid,
  Box,
  FormControl,
  MenuItem,
  Select,
  Link,
  Alert,
  SvgIcon,
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
import React, { ChangeEvent, RefObject, useRef, useState } from "react";
import * as Yup from "yup";

import stateMachine from "src/sections/financial-account/send-money-wizard-state-machine";
import NetworkType from "src/types/network-type";
import TransactionResult from "src/types/transaction-result";
import {
  extractJsonFromResponse,
  handleResult,
  postApi,
} from "src/utils/api-helpers";

const DEFAULT_TRANSACTION_RESULT = TransactionResult.POSTED;

type DestinationAddress = {
  name: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  routingNumber: string;
  accountNumber: string;
  amount: number;
  accountNotes?: string;
};

const SelectingNetworkForm = ({
  formRef,
  onFormSubmit,
  network,
  setNetwork,
  destinationAddress,
  setDestinationAddress,
}: {
  formRef: RefObject<FormikProps<FormikValues>>;
  onFormSubmit: () => void;
  network: string;
  setNetwork: (network: NetworkType) => void;
  destinationAddress: DestinationAddress | null;
  setDestinationAddress: (destinationAddress: DestinationAddress) => void;
}) => {
  const initialValues = { network };
  const validationSchema = Yup.object().shape({
    network: Yup.string()
      .oneOf(Object.values(NetworkType))
      .required("Please select a network"),
  });

  const handleNetworkChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    const selectedNetwork = e.target.value;
    if (destinationAddress != null && selectedNetwork != network) {
      // The selection was changed by the user so clear any previous destination address that's not
      // applicable
      if (selectedNetwork == NetworkType.ACH) {
        setDestinationAddress({
          ...destinationAddress,
          address1: "",
          city: "",
          state: "",
          postalCode: "",
        });
      }
    }
    setFieldValue("network", selectedNetwork);
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        setNetwork(values.network);
        onFormSubmit();
      }}
    >
      {({ errors, setFieldValue }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography>
                In this demo you can test an experience for sending funds from a
                Treasury financial account to an external 3rd party US bank
                account. Depending on the network type, timing for funds to be
                available may vary.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                You can set the status of the transaction before sending the
                payment for demo purposes. Do not forget to check the Financial
                Account balance afterwards!
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormLabel htmlFor="network">Network</FormLabel>
              <Field
                as={RadioGroup}
                aria-label="network"
                name="network"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleNetworkChange(e, setFieldValue)
                }
              >
                <FormControlLabel
                  value={NetworkType.ACH}
                  control={<Radio />}
                  label="ACH"
                />
                <FormControlLabel
                  value={NetworkType.US_DOMESTIC_WIRE}
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
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const CollectingDestinationAddressForm = ({
  formRef,
  onFormSubmit,
  network,
  destinationAddress,
  setDestinationAddress,
}: {
  formRef: RefObject<FormikProps<FormikValues>>;
  onFormSubmit: () => void;
  network: string;
  destinationAddress: DestinationAddress | null;
  setDestinationAddress: (destinationAddress: DestinationAddress) => void;
}) => {
  let initialValues = destinationAddress || {
    name: "",
    routingNumber: "",
    accountNumber: "",
    amount: "",
    accountNotes: "",
  };

  const requiredFieldsValidationSchema = {
    name: Yup.string().required("Name is required"),
    routingNumber: Yup.string().required("Routing Number is required"),
    accountNumber: Yup.string().required("Account Number is required"),
    amount: Yup.number().required("Amount is required").min(0),
  };

  let validationSchema = Yup.object().shape(requiredFieldsValidationSchema);

  if (network === NetworkType.US_DOMESTIC_WIRE) {
    const conditionalInitialValues = destinationAddress
      ? {
          address1: destinationAddress.address1,
          city: destinationAddress.city,
          state: destinationAddress.state,
          postalCode: destinationAddress.postalCode,
        }
      : {
          address1: "",
          city: "",
          state: "",
          postalCode: "",
        };

    initialValues = { ...initialValues, ...conditionalInitialValues };

    const conditionalAddressValidationSchema = Yup.object().shape({
      address1: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      postalCode: Yup.string().required("Postal code is required"),
    });

    validationSchema = validationSchema.concat(
      conditionalAddressValidationSchema,
    );
  }

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const destinationAddress: DestinationAddress = {
      name: values.name,
      routingNumber: values.routingNumber,
      accountNumber: values.accountNumber,
      amount: values.amount,
      accountNotes: values.accountNotes,
    };

    if (network === NetworkType.US_DOMESTIC_WIRE) {
      destinationAddress.address1 = values.address1;
      destinationAddress.city = values.city;
      destinationAddress.state = values.state;
      destinationAddress.postalCode = values.postalCode;
    }

    setDestinationAddress(destinationAddress);
    onFormSubmit();
    setSubmitting(false);
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
            <Grid item xs={12}>
              <Field
                as={TextField}
                name="name"
                required
                label="Name"
                fullWidth
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>
            {network === NetworkType.US_DOMESTIC_WIRE && (
              <>
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
                    label="State"
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
              </>
            )}
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                name="routingNumber"
                required
                label="Routing Number"
                fullWidth
                error={touched.routingNumber && Boolean(errors.routingNumber)}
                helperText={touched.routingNumber && errors.routingNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                name="accountNumber"
                required
                label="Account Number"
                fullWidth
                error={touched.accountNumber && Boolean(errors.accountNumber)}
                helperText={touched.accountNumber && errors.accountNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                name="amount"
                type="number"
                required
                step="0.01"
                label="Amount"
                fullWidth
                error={touched.amount && Boolean(errors.amount)}
                helperText={touched.amount && errors.amount}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                name="accountNotes"
                label="Account Notes (Optional)"
                fullWidth
                error={touched.accountNotes && Boolean(errors.accountNotes)}
                helperText={touched.accountNotes && errors.accountNotes}
              />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const ConfirmingTransferForm = ({
  formRef,
  onFormSubmit,
  network,
  destinationAddress,
  transactionResult,
  setTransactionResult,
  sendingErrorText,
}: {
  formRef: RefObject<FormikProps<FormikValues>>;
  onFormSubmit: () => void;
  network: string;
  destinationAddress: DestinationAddress | null;
  transactionResult: TransactionResult;
  setTransactionResult: (transactionResult: TransactionResult) => void;
  sendingErrorText: string;
}) => {
  if (!destinationAddress) {
    throw new Error("Destination address is required");
  }

  const transactionResultOptions: { [key: string]: string } = {};
  for (const key in TransactionResult) {
    const value = TransactionResult[key as keyof typeof TransactionResult];
    transactionResultOptions[key] = value;
  }

  const initialValues = { transactionResult };

  const validationSchema = Yup.object().shape({
    transactionResult: Yup.string()
      .oneOf(Object.values(TransactionResult))
      .required("Transaction result is required"),
  });

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setTransactionResult(values.transactionResult);
    onFormSubmit();
    setSubmitting(false);
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <Grid container spacing={3}>
            {sendingErrorText !== "" && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error">
                  {sendingErrorText}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="subtitle2">Name</Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {destinationAddress.name}
                </Typography>
              </Box>
            </Grid>
            {network === NetworkType.US_DOMESTIC_WIRE && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Street address</Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {destinationAddress.address1}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">City</Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {destinationAddress.city}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">State</Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {destinationAddress.state}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">ZIP / Postal code</Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {destinationAddress.postalCode}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Routing Number</Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {destinationAddress.routingNumber}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Account Number</Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {destinationAddress.accountNumber}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Amount</Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {destinationAddress.amount}
                </Typography>
              </Box>
            </Grid>
            {destinationAddress.accountNotes != "" && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Account Notes</Typography>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {destinationAddress.accountNotes}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="subtitle2">Transaction Result</Typography>
                <Field as={Select} name="transactionResult" sx={{ mt: 1 }}>
                  {(
                    Object.keys(TransactionResult) as Array<
                      keyof typeof TransactionResult
                    >
                  ).map((option) => (
                    <MenuItem key={option} value={TransactionResult[option]}>
                      {option}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Alert color="primary" severity="info">
                  Setting the transaction result is for demo purposes only (See{" "}
                  <Link
                    target="_blank"
                    href="https://stripe.com/docs/api/treasury/outbound_payments/test_mode_fail"
                    underline="none"
                  >
                    docs{" "}
                    <SvgIcon fontSize="small" sx={{ verticalAlign: "top" }}>
                      <ArrowTopRightOnSquareIcon />
                    </SvgIcon>
                  </Link>
                  )
                </Alert>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const NotifyingCompletionForm = ({
  network,
  destinationAddress,
  transactionResult,
}: {
  network: string;
  destinationAddress: DestinationAddress | null;
  transactionResult: TransactionResult;
}) => {
  if (!destinationAddress) {
    throw new Error("Destination address is required");
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Alert severity="success">
            Successfully sent an outbound payment to {destinationAddress.name}{" "}
            with an expected result of {transactionResult}.
          </Alert>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">Name</Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {destinationAddress.name}
          </Typography>
        </Box>
      </Grid>
      {network === NetworkType.US_DOMESTIC_WIRE && (
        <>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Street address</Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {destinationAddress.address1}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">City</Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {destinationAddress.city}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">State</Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {destinationAddress.state}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">ZIP / Postal code</Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {destinationAddress.postalCode}
              </Typography>
            </Box>
          </Grid>
        </>
      )}
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2">Routing Number</Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {destinationAddress.routingNumber}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2">Account Number</Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {destinationAddress.accountNumber}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">Amount</Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {destinationAddress.amount}
          </Typography>
        </Box>
      </Grid>
      {destinationAddress.accountNotes != "" && (
        <Grid item xs={12}>
          <Typography variant="subtitle2">Account Notes</Typography>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {destinationAddress.accountNotes}
            </Typography>
          </Box>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="subtitle2">Transaction Result</Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {transactionResult}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

const SendMoneyWizardDialog = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [current, send] = useMachine(stateMachine);

  const [network, setNetwork] = useState("");
  const [destinationAddress, setDestinationAddress] =
    useState<DestinationAddress | null>(null);
  const [transactionResult, setTransactionResult] = useState<TransactionResult>(
    DEFAULT_TRANSACTION_RESULT,
  );

  const handleReset = () => {
    setNetwork("");
    setDestinationAddress(null);
    setTransactionResult(DEFAULT_TRANSACTION_RESULT);
    setSendingErrorText("");
    send({ type: "RESET" });
  };

  const handleOpen = () => {
    handleReset();
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const handleNext = () => {
    send({ type: "NEXT" });
  };

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const selectingNetworkFormRef = useRef<FormikProps<FormikValues>>(null);
  const handleSubmitSelectingNetworkForm = () => {
    const form = selectingNetworkFormRef.current;
    if (form) {
      form.submitForm();
    }
  };

  const collectingDestinationAddressFormRef =
    useRef<FormikProps<FormikValues>>(null);
  const handleSubmitCollectingDestinationAddressForm = () => {
    const form = collectingDestinationAddressFormRef.current;
    if (form) {
      form.submitForm();
    }
  };

  const confirmingTransferFormRef = useRef<FormikProps<FormikValues>>(null);
  const handleSubmitConfirmingTransferForm = () => {
    const form = confirmingTransferFormRef.current;
    if (form) {
      form.submitForm();
    }
  };

  const [isSending, setIsSending] = useState(false);
  const [sendingErrorText, setSendingErrorText] = useState("");
  const handleSendTransfer = async () => {
    try {
      setSendingErrorText("");
      setIsSending(true);
      if (destinationAddress === null) {
        throw new Error(
          "Destination address is null. Check to make sure it's set before submitting.",
        );
      }

      const body = {
        name: destinationAddress.name,
        routing_number: destinationAddress.routingNumber,
        account_number: destinationAddress.accountNumber,
        network: network,
        amount: destinationAddress.amount,
        line1: destinationAddress.address1,
        city: destinationAddress.city,
        state: destinationAddress.state,
        postalCode: destinationAddress.postalCode,
        notes: destinationAddress.accountNotes,
        transaction_result: transactionResult,
      };

      const response = await postApi("/api/send_money", body);
      const result = await extractJsonFromResponse(response);
      handleResult({
        result,
        onSuccess: () => {
          send({ type: "COMPLETE" });
        },
        onError: (error) => {
          setSendingErrorText((error as Error).message);
        },
      });
    } catch (error) {
      setSendingErrorText((error as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        Send money
      </Button>
      <Dialog open={showModal} onClose={handleClose}>
        <DialogTitle>Send money</DialogTitle>
        <Divider />
        <DialogContent>
          {current.matches("selectingNetwork") && (
            <SelectingNetworkForm
              formRef={selectingNetworkFormRef}
              onFormSubmit={handleNext}
              network={network}
              setNetwork={setNetwork}
              destinationAddress={destinationAddress}
              setDestinationAddress={setDestinationAddress}
            />
          )}
          {current.matches("collectingDestinationAddress") && (
            <CollectingDestinationAddressForm
              formRef={collectingDestinationAddressFormRef}
              onFormSubmit={handleNext}
              network={network}
              destinationAddress={destinationAddress}
              setDestinationAddress={setDestinationAddress}
            />
          )}
          {current.matches("confirmingTransfer") && (
            <ConfirmingTransferForm
              formRef={confirmingTransferFormRef}
              onFormSubmit={handleSendTransfer}
              network={network}
              destinationAddress={destinationAddress}
              transactionResult={transactionResult}
              setTransactionResult={setTransactionResult}
              sendingErrorText={sendingErrorText}
            />
          )}
          {current.matches("notifyingCompletion") && (
            <NotifyingCompletionForm
              network={network}
              destinationAddress={destinationAddress}
              transactionResult={transactionResult}
            />
          )}
        </DialogContent>
        <Divider />
        <DialogActions>
          {current.matches("selectingNetwork") && (
            <>
              <Button
                onClick={handleSubmitSelectingNetworkForm}
                variant="contained"
                color="primary"
              >
                Next
              </Button>
            </>
          )}
          {current.matches("collectingDestinationAddress") && (
            <>
              <Button onClick={handleBack} color="inherit">
                Back
              </Button>
              <Button
                onClick={handleSubmitCollectingDestinationAddressForm}
                variant="contained"
                color="primary"
              >
                Next
              </Button>
            </>
          )}
          {current.matches("confirmingTransfer") && (
            <>
              <Button onClick={handleBack} color="inherit">
                Back
              </Button>
              <Button
                onClick={handleSubmitConfirmingTransferForm}
                variant="contained"
                color="primary"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
            </>
          )}
          {current.matches("notifyingCompletion") && (
            <>
              <Button
                onClick={handleReset}
                variant="contained"
                color="secondary"
              >
                Send Another
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SendMoneyWizardDialog;
