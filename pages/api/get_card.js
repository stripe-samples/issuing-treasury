import qs from 'qs';
import axios from 'axios';

export default async function handler(req, res) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  let account = await stripe.accounts.retrieve(req.body.accountId);
  let cardId = req.body.cardId;
  let nonce = req.body.nonce;

  async function getEphemeralKey(account, cardId, nonce) {
    const data = qs.stringify({
      issuing_card: cardId,
      nonce: nonce,
    });
    const config = {
      method: 'POST',
      url: 'https://api.stripe.com/v1/ephemeral_keys',
      headers: {
        'Stripe-Version': '2020-03-02',
        'Stripe-Account': account.id,
        Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY,
      },
      data: data,
    };
    try {
      const result = await axios(config);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  const ephemeralKey = await getEphemeralKey(account, cardId, nonce);

  //Check if we have a result
  if (ephemeralKey) {
    res.status(200).send(ephemeralKey.data);
  } else {
    res.status(500).json({statusCode: 500, message: 'Error'});
  }
}
