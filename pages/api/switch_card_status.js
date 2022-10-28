import { parse } from 'cookie';
import { decode } from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { app_auth } = parse(req.headers.cookie || '');
    const session = decode(app_auth);
    try {
      const StripeAccountId = session.accountId;
      const cardId = req.body.card_id;
      let status = "";
      if (req.body.new_status == 'active') {
        status = 'active';
      } else {
        status =
          'inactive';
      }
      const result = await stripe.issuing.cards.update(
        cardId,
        { status: status }, { stripeAccount: StripeAccountId },

      );
      return res.status(200).json({
        success: true,        
      });

    } catch (err) {
      return res.status(401).json({
        success: false,
        error: err.message,
      });
    }
  }
  else {
    res.status(400).json({ error: 'Bad Request' });
  }
}
