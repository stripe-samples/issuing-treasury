// @ts-expect-error TS(7016): Could not find a declaration file for module 'cook... Remove this comment to see the full error message
import {parse} from 'cookie';
import {decode} from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const {app_auth} = parse(req.headers.cookie || '');
    const session = decode(app_auth);
    try {
      const StripeAccountId = session.accountId;

      const balance = await stripe.balance.retrieve({
        stripeAccount: StripeAccountId,
      });

      const payout = await stripe.payouts.create(
        {
          amount: balance.available[0].amount,
          currency: 'usd',
        },
        {stripeAccount: StripeAccountId},
      );

      return res.json({success: true});
    } catch (err) {
      return res.status(401).json({
        urlCreated: false,
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        error: err.message,
      });
    }
  } else {
    res.status(400).json({error: 'Bad Request'});
  }
}
