import { serialize } from "cookie";

import { authenticateUser } from "../../utils/authentication";
import { createAccountOnboardingUrl } from "../../utils/stripe_helpers";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(404).end();
  }

  const {
    body: { name, email },
  } = req;
  try {
    // Check if user exists
    const { data: customers } = await stripe.customers.list({ email });
    if (customers.length) {
      return res.json({
        accountCreated: false,
        error: "Account already exists.",
      });
    }

    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
        treasury: { requested: true },
        card_issuing: { requested: true },
      },
    });

    // Create FA

    const financialAccount = await stripe.treasury.financialAccounts.create(
      {
        supported_currencies: ["usd"],
        features: {
          card_issuing: { requested: true },
          deposit_insurance: { requested: true },
          financial_addresses: { aba: { requested: true } },
          inbound_transfers: { ach: { requested: true } },
          intra_stripe_flows: { requested: true },
          outbound_payments: {
            ach: { requested: true },
            us_domestic_wire: { requested: true },
          },
          outbound_transfers: {
            ach: { requested: true },
            us_domestic_wire: { requested: true },
          },
        },
      },
      { stripeAccount: account.id },
    );

    const customer = await stripe.customers.create({
      name,
      email,
      metadata: {
        accountId: account.id,
      },
    });

    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const user = await authenticateUser(email);

    const url = await createAccountOnboardingUrl(
      account.id,
      process.env.DEMO_HOST,
    );

    res.setHeader(
      "Set-Cookie",
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      serialize("app_auth", user.cookie, { path: "/", httpOnly: true }),
    );

    return res.json({ accountCreated: true, url: url });
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      accountCreated: false,
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      error: err.message,
    });
  }
}
