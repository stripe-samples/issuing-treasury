import { parse } from 'cookie';
import { decode } from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { app_auth } = parse(req.headers.cookie || '');
    const session = decode(app_auth);

    const StripeAccountId = session.accountId;

    const financialAccounts = await stripe.treasury.financialAccounts.list({
      stripeAccount: StripeAccountId,
    });

    const financialAccount = financialAccounts.data[0];
    const cardholder = await stripe.issuing.cardholders.retrieve(
      req.body.cardholderid,
      { stripeAccount: StripeAccountId },

    );

    if (req.body.card_type == 'physical') {

      const card = await stripe.issuing.cards.create(
        {
          cardholder: req.body.cardholderid,
          financial_account: financialAccount.id,
          currency: 'usd',
          shipping: {
            name: cardholder.name,
            service: 'standard',
            type: 'individual',
            address: {
              line1: cardholder.billing.address.line1, 
              state:  cardholder.billing.address.state, 
              city:  cardholder.billing.address.city, 
              postal_code:  cardholder.billing.address.postal_code,
              country:  cardholder.billing.address.country ,
            },
          },
          type: 'physical',
          status: 'inactive',
        },
        { stripeAccount: StripeAccountId },
      );
    }
    else {

      const card = await stripe.issuing.cards.create(
        {
          cardholder: req.body.cardholderid,
          financial_account: financialAccount.id,
          currency: 'usd',
          type: 'virtual',
          status: 'active',
        },
        { stripeAccount: StripeAccountId },
      );

    }
    res.redirect('/cards');
  } else {
    res.status(400).json({ error: 'Bad Request' });
  }
}
