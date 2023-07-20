import {parse} from 'cookie';
import {decode} from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const {app_auth} = parse(req.headers.cookie || '');
    const session = decode(app_auth);

    const StripeAccountId = session.accountId;

    const prices = await stripe.prices.list(
      {
        limit: 1,
        active: true,
        type: 'one_time',
      },
      {
        stripeAccount: StripeAccountId,
      }
    );

    let price;

    if (prices.data.length < 1) {
      price = await stripe.prices.create(
        {
          unit_amount: 1000,
          currency: 'usd',
          product_data: {
            name: 'Unit',
          },
        },
        {
          stripeAccount: StripeAccountId,
        }
      );
    } else {
      price = prices.data[0];
    }
    try {
      const paymentLink = await stripe.paymentLinks.create(
        {
          line_items: [
            {
              price: price.id,
              quantity: 1,
              adjustable_quantity: {enabled: true},
            },
          ],
        },
        {
          stripeAccount: StripeAccountId,
        }
      );
      return res.json({urlCreated: true, paymentLink: paymentLink.url});
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
