import {parse} from 'cookie';
import {decode} from '../../utils/jwt_encode_decode';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const {app_auth} = parse(req.headers.cookie || '');
    const session = decode(app_auth);
    try {
      const StripeAccountId = session.accountId;

      const financialAccounts = await stripe.treasury.financialAccounts.list(
        {expand: ['data.financial_addresses.aba.account_number']},
        {
          stripeAccount: StripeAccountId,
        }
      );

      const financialAccount = financialAccounts.data[0];

      await stripe.accounts.createExternalAccount(StripeAccountId, {
        external_account: {
          object: 'bank_account',
          country: 'US',
          currency: 'usd',
          account_number:
            financialAccount.financial_addresses[0].aba.account_number,
          routing_number:
            financialAccount.financial_addresses[0].aba.routing_number,
        },
      });

      return res.json({externalAcctAdded: true});
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
