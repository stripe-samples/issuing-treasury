import {parse} from 'cookie';
import {decode} from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {app_auth} = parse(req.headers.cookie || '');
    const session = decode(app_auth);
    const StripeAccountId = session.accountId;
    try {
      const cardholder = await stripe.issuing.cardholders.create(
        {
          type: 'individual',
          name: req.body.firstName + ' ' + req.body.lastName,
          email: req.body.email,
          billing: {
            address: {
              city: req.body.city,
              line1: req.body.address1,
              state: req.body.state,
              postal_code: req.body.postalCode,
              country: req.body.country,
            },
          },
        },
        {
          stripeAccount: StripeAccountId,
        },
      );
      return res.json({ok: true});
    } catch (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
  } else {
    res.status(400).json({error: 'Bad Request'});
  }
}
