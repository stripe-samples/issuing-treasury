import React, { useState } from "react";

function CardStatusSwitchWidget({ cardId, cardStatus }: any) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSwitchCard = async (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    let newStatus = "active";
    if (cardStatus == "active") {
      newStatus = "inactive";
    }
    const body = {
      card_id: cardId,
      new_status: newStatus,
    };
    const response = await fetch("/api/switch_card_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    });
    const responseData = await response.json();
    if (responseData.success === true) {
      setSubmitted(false);
      window.location.reload();
    } else {
      setSubmitted(false);
      setError(true);
      setErrorText(responseData.error);
    }

    setSubmitted(false);
    setError(true);
  };

  return (
    <div>
      {cardStatus != "canceled" ? (
        <div>
          {error ? (
            <div className="p-2 text-center ">
              <p className="text-red-600">{errorText}</p>
            </div>
          ) : null}

          <button
            id="switch-card-status-btn"
            type="button"
            className="inline-flex items-center px-10 py-2.5 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-accent-color hover:bg-accent-color-light ml-2 mr-2"
            onClick={handleSwitchCard}
          >
            {cardStatus == "inactive" ? (
              <p> Activate Card </p>
            ) : (
              <p> Deactivate Card</p>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
export default CardStatusSwitchWidget;
