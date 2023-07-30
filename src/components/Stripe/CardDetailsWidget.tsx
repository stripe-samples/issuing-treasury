import { useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect } from "react";

import { capitalize, formatUSD } from "src/utils/format";

function CardDetailsWidget({
  accountId,
  cardId,
  cardDetails,
  currentSpend,
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const card = cardDetails;

  useEffect(() => {
    if (!stripe || !elements || card.type == "physical") {
      return;
    }

    const renderCard = async () => {
      const STYLE = {
        base: {
          color: "white",
          fontSize: "14px",
          lineHeight: "24px",
        },
      };

      const nonceResult = await stripe.createEphemeralKeyNonce({
        issuingCard: cardId,
      });

      const ephemeralKeyResult = await fetch("/api/get_card", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: cardId,
          nonce: nonceResult.nonce,
          accountId: accountId,
        }),
      });

      const ephemeralKeyResponse = await ephemeralKeyResult.json();

      // Display the cardholder's name
      const name = document.getElementById("cardholder-name");
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      name.textContent = card.cardholder.name;

      // Populate the raw card details
      const number = elements.create("issuingCardNumberDisplay", {
        issuingCard: cardId,
        ephemeralKeySecret: ephemeralKeyResponse.secret,
        nonce: nonceResult.nonce,
        style: STYLE,
      });
      number.mount("#card-number");

      const expiry = elements.create("issuingCardExpiryDisplay", {
        issuingCard: cardId,
        ephemeralKeySecret: ephemeralKeyResponse.secret,
        nonce: nonceResult.nonce,
        style: STYLE,
      });
      expiry.mount("#card-expiry");

      const cvc = elements.create("issuingCardCvcDisplay", {
        issuingCard: cardId,
        ephemeralKeySecret: ephemeralKeyResponse.secret,
        nonce: nonceResult.nonce,
        style: STYLE,
      });
      cvc.mount("#card-cvc");
    };

    renderCard();
  }, [stripe, elements]);

  return (
    <div
      id="details-container"
      className="max-w-6xl mx-auto sm:px-6 grid grid-cols-2 gap-4 mt-16"
    >
      {card.type == "virtual" ? (
        <div id="card-container" className="col-span-1">
          <div id="card-back">
            <div id="card-details">
              <div id="cardholder-name" className="font-semibold text-lg"></div>
              <div id="card-number"></div>
              <div id="expiry-cvc-wrapper">
                <div id="expiry-wrapper">
                  <div className="font-semibold">EXP</div>
                  <div id="card-expiry"></div>
                </div>
                <div id="cvc-wrapper">
                  <div className="font-semibold">CVC</div>
                  <div id="card-cvc"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="card-container" className="col-span-1">
          <div id="card-back">
            <p className="text-white font-semibold text-sm pt-20 px-4 leading-4">
              Physical card details cannot be displayed.
            </p>
          </div>
        </div>
      )}

      <div id="cardinfo-container" className="col-span-1 grid grid-cols-2">
        <div id="cardinfo" className="col-span-2">
          <div id="status">
            <p className="text-gray-500">
              <strong className="text-l font-bold leading-7 text-gray-700 sm:leading-9 ">
                Status:{" "}
              </strong>

              {capitalize(card.status)}
            </p>
          </div>
          <div id="type">
            <p className="text-gray-500">
              <strong className="text-l font-bold leading-7 text-gray-700 sm:leading-9 ">
                Card Type: &nbsp;
              </strong>

              {capitalize(card.type)}
            </p>
          </div>
          <h4 className="text-l font-bold leading-7 text-gray-700 sm:leading-9 ">
            Billing address
          </h4>

          <p className="text-gray-500">
            {" "}
            {card.cardholder.billing.address.line1}
          </p>
          <p className="text-gray-500">
            {" "}
            {card.cardholder.billing.address.line2}
          </p>
          <p className="text-gray-500">
            {" "}
            {card.cardholder.billing.address.city} -{" "}
            {card.cardholder.billing.address.state}{" "}
            {card.cardholder.billing.address.postal_code}
          </p>
        </div>
        <div id="current-spend">
          <h4 className="text-l font-bold leading-7 text-gray-700 sm:leading-9 ">
            Current Spend
          </h4>

          <p className="text-gray-500"> {currentSpend}</p>
        </div>
        <div id="limit">
          <h4 className="text-l font-bold leading-7 text-gray-700 sm:leading-9">
            Limit
          </h4>
          <p className="text-gray-500">
            {" "}
            {formatUSD(
              card.spending_controls.spending_limits[0].amount / 100,
            )}{" "}
            {card.spending_controls.spending_limits[0].interval}{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardDetailsWidget;
