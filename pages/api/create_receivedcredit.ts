import {parse} from 'cookie';
import {decode} from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const {app_auth} = parse(req.headers.cookie || '');
    const session = decode(app_auth);
    try {
      const StripeAccountId = session.accountId;

      //Get financial accounts for the Connected Account
      const financialAccounts = await stripe.treasury.financialAccounts.list(
        {expand: ['data.financial_addresses.aba.account_number']},
        {stripeAccount: StripeAccountId}
      );
      const financialAccount = financialAccounts.data[0];

      const receivedCredit =
        await stripe.testHelpers.treasury.receivedCredits.create(
          {
            amount: 50000,
            currency: 'usd',
            financial_account: financialAccount.id,
            network: 'ach',
          },
          {stripeAccount: StripeAccountId}
        );
      return res.json({receivedCredit: receivedCredit.id});
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
