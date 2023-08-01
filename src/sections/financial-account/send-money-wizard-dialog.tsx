import { Dialog, DialogTitle, Divider, Button } from "@mui/material";
import { useMachine } from "@xstate/react";
import React from "react";

import stateMachine from "src/sections/financial-account/send-money-wizard-state-machine";

const SendMoneyWizardDialog = () => {
  const [open, setOpen] = React.useState(false);

  const [current, send] = useMachine(stateMachine);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNext = () => {
    send("NEXT");
  };

  const handleBack = () => {
    send("BACK");
  };

  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        Send Money
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        id="new-cardholder-modal"
      >
        <DialogTitle>Send Money</DialogTitle>
        <Divider />
      </Dialog>
    </>
  );
};

export default SendMoneyWizardDialog;
