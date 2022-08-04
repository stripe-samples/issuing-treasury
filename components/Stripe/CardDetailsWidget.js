import React, {useEffect} from 'react';
import {useStripe, useElements} from '@stripe/react-stripe-js';
import {formatUSD} from '../../utils/format';

function CardDetailsWidget({accountId, cardId, cardDetails, currentSpend}) {
  const stripe = useStripe();
  const elements = useElements();
  const card = cardDetails;

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    const renderCard = async () => {
      const STYLE = {
        base: {
          color: 'white',
          fontSize: '14px',
          lineHeight: '24px',
        },
      };

      const nonceResult = await stripe.createEphemeralKeyNonce({
        issuingCard: cardId,
      });

      const ephemeralKey = await fetch('/api/get_card', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: cardId,
          nonce: nonceResult.nonce,
          accountId: accountId,
        }),
      }).then((r) => r.json());

      const cardResult = await stripe.retrieveIssuingCard(cardId, {
        ephemeralKeySecret: ephemeralKey.secret,
        nonce: nonceResult.nonce,
      });

      // Display the cardholder's name
      const name = document.getElementById('cardholder-name');
      name.textContent = cardResult.issuingCard.cardholder.name;

      // Populate the raw card details
      const number = elements.create('issuingCardNumberDisplay', {
        issuingCard: cardId,
        style: STYLE,
      });
      number.mount('#card-number');

      const expiry = elements.create('issuingCardExpiryDisplay', {
        issuingCard: cardId,
        style: STYLE,
      });
      expiry.mount('#card-expiry');

      const cvc = elements.create('issuingCardCvcDisplay', {
        issuingCard: cardId,
        style: STYLE,
      });
      cvc.mount('#card-cvc');
    };

    renderCard();
  }, [stripe, elements]);

  return (
    <div
      id="details-container"
      className="max-w-6xl mx-auto sm:px-6 grid grid-cols-2 gap-4 mt-16"
    >
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

      <div id="cardinfo-container" className="col-span-1 grid grid-cols-2">
        <div id="billing-address" className="col-span-2">
          <h4 className="text-l font-bold leading-7 text-gray-700 sm:leading-9 ">
            Billing address
          </h4>

          <p className="text-gray-500">
            {' '}
            {card.cardholder.billing.address.line1}
          </p>
          <p className="text-gray-500">
            {' '}
            {card.cardholder.billing.address.line2}
          </p>
          <p className="text-gray-500">
            {' '}
            {card.cardholder.billing.address.city} -{' '}
            {card.cardholder.billing.address.state}{' '}
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
            {' '}
            {formatUSD(
              card.spending_controls.spending_limits[0].amount / 100,
            )}{' '}
            {card.spending_controls.spending_limits[0].interval}{' '}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardDetailsWidget;
