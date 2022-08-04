import {parse} from 'cookie';
import {decode} from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {app_auth} = parse(req.headers.cookie || '');
    const session = decode(app_auth);

    const StripeAccountId = session.accountId;

    const financialAccounts = await stripe.treasury.financialAccounts.list({
      stripeAccount: StripeAccountId,
    });

    const financialAccount = financialAccounts.data[0];

    const card = await stripe.issuing.cards.create(
      {
        cardholder: req.body.cardholderid,
        financial_account: financialAccount.id,
        currency: 'usd',
        type: 'virtual',
        status: 'active',
      },
      {stripeAccount: StripeAccountId},
    );

    res.redirect('/cards');
  } else {
    res.status(400).json({error: 'Bad Request'});
  }
}
