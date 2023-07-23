import { parse } from "cookie";
import React from "react";

import SigninWidget from "../components/Stripe/SignInWidget";
import { decode } from "../utils/jwt_encode_decode";

export async function getServerSideProps(context: any) {
  if ("cookie" in context.req.headers) {
    const cookie = parse(context.req.headers.cookie);
    // Return to dashboard if cookie exists
    if (Object.keys(cookie)[0] === "app_auth") {
      const session = decode(cookie.app_auth);
      if (session.requiresOnboarding === true) {
        return {
          redirect: {
            destination: "/onboard",
          },
        };
      }

      return {
        redirect: {
          destination: "/dashboard",
        },
      };
    }
  }
  return {
    props: {},
  };
}

const Signin = () => {
  return (
    <div>
      <SigninWidget />
    </div>
  );
};

export default Signin;
