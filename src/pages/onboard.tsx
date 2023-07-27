import { parse, serialize } from "cookie";
import React from "react";

import OnboardWidget from "../components/Stripe/OnboardWidget";
import { decode, encode } from "../utils/jwt_encode_decode";
import stripe from "../utils/stripe-loader";
import { createAccountOnboardingUrl } from "../utils/stripe_helpers";

export async function getServerSideProps(context: any) {
  if ("cookie" in context.req.headers) {
    const cookie = parse(context.req.headers.cookie);
    if ("app_auth" in cookie) {
      const session = decode(cookie.app_auth);
      // @ts-expect-error Remove after deployment succeeds
      const StripeAccountID = session.accountId;
      const account = await stripe.accounts.retrieve(StripeAccountID);
      // Check if there are requirements due
      // @ts-expect-error Remove after deployment succeeds
      if (account.requirements.currently_due.length > 1) {
        // Create the onboarding link and redirect
        const url = await createAccountOnboardingUrl(
          account.id,
          process.env.DEMO_HOST,
        );
        return {
          props: {
            url: url,
          },
        };
      } else {
        // Renew cookie
        // @ts-expect-error Remove after deployment succeeds
        session.requiresOnboarding = false;
        // @ts-expect-error Remove after deployment succeeds
        const cookie = encode(session);
        context.res.setHeader(
          "Set-Cookie",
          serialize("app_auth", cookie, { path: "/", httpOnly: true }),
        );
        return {
          redirect: {
            destination: "/overview",
          },
        };
      }
    }
  }
  return {
    redirect: {
      destination: "/auth/login",
    },
  };
}

const Page = (props: any) => {
  return (
    <div>
      <OnboardWidget url={props.url} />
    </div>
  );
};

export default Page;
