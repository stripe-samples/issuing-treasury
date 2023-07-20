
import { parse } from 'cookie';
import { decode } from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { app_auth } = parse(req.headers.cookie || '');
    const session = decode(app_auth);
    try {
      const StripeAccountId = session.accountId;
      const cardId = req.body.card_id;
      const {new_status} = req.body;
      let status = new_status == 'active' ? 'active' : 'inactive';
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
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        error: err.message,
      });
    }
  }
  else {
    res.status(400).json({ error: 'Bad Request' });
  }
}
