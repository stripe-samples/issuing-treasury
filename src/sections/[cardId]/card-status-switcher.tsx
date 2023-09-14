import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Stripe from "stripe";

import {
  extractJsonFromResponse,
  handleResult,
  patchApi,
} from "src/utils/api-helpers";

function CardStatusSwitcher({
  cardId,
  cardStatus,
}: {
  cardId: string;
  cardStatus: Stripe.Issuing.Card.Status;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState("");
  const router = useRouter();

  const handleSwitchCardStatus = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setSubmitting(true);
    const newStatus = cardStatus === "active" ? "inactive" : "active";
    const response = await patchApi(`/api/cards/${cardId}/switch-card-status`, {
      newStatus: newStatus,
    });
    const result = await extractJsonFromResponse(response);
    handleResult({
      result,
      onSuccess: async () => {
        await router.push(`/cards/${cardId}`);
      },
      onError: (error) => {
        setErrorAlertText(`Error: ${error.message}`);
        setShowErrorAlert(true);
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  const handleErrorAlertClose = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setShowErrorAlert(false);
    setSubmitting(false);
  };

  return (
    <>
      {cardStatus != "canceled" ? (
        <>
          {cardStatus == "inactive" ? (
            <Button
              variant="contained"
              sx={{ whiteSpace: "nowrap" }}
              onClick={handleSwitchCardStatus}
              disabled={submitting}
            >
              {submitting ? "Activating Card..." : "Activate Card"}
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ whiteSpace: "nowrap" }}
              onClick={handleSwitchCardStatus}
              disabled={submitting}
            >
              {submitting ? "Deactivating Card..." : "Deactivate Card"}
            </Button>
          )}
          <Dialog
            open={showErrorAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Changing Card Status Error
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {errorAlertText}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleErrorAlertClose}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : null}
    </>
  );
}
export default CardStatusSwitcher;
