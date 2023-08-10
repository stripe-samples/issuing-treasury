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

import { fetchApi } from "src/utils/api-helpers";

function CardStatusSwitcher({
  cardId,
  cardStatus,
}: {
  cardId: string;
  cardStatus: Stripe.Issuing.Card.Status;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState("");
  const router = useRouter();

  const handleSwitchCardStatus = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    try {
      e.preventDefault();
      setSubmitted(true);
      const newStatus = cardStatus === "active" ? "inactive" : "active";
      const body = {
        cardId: cardId,
        newStatus: newStatus,
      };
      const response = await fetchApi("/api/switch_card_status", body);
      const data = await response.json();
      if (response.ok) {
        router.reload();
      } else if (data.error) {
        setErrorAlertText(data.error);
        setShowErrorAlert(true);
      } else {
        throw new Error("Something went wrong");
      }
      setSubmitted(false);
    } catch (error) {
      setErrorAlertText((error as Error).message);
      setShowErrorAlert(true);
    }
  };

  const handleErrorAlertClose = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setShowErrorAlert(false);
    setSubmitted(false);
  };

  return (
    <>
      {cardStatus != "canceled" ? (
        <>
          <Button
            variant="contained"
            sx={{ whiteSpace: "nowrap" }}
            onClick={handleSwitchCardStatus}
            disabled={submitted}
          >
            {cardStatus == "inactive"
              ? submitted
                ? "Activating Card..."
                : "Activate Card"
              : submitted
              ? "Deactivating Card..."
              : "Deactivate Card"}
          </Button>
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
