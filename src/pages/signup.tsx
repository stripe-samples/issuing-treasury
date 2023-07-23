import { parse } from "cookie";
import React from "react";

import SignupWidget from "../components/Stripe/SignUpWidget";
import { decode } from "../utils/jwt_encode_decode";

export async function getServerSideProps(context: any) {
  if ("cookie" in context.req.headers) {
    const cookie = parse(context.req.headers.cookie);
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
          destination: "/overview",
        },
      };
    }
  }
  return {
    props: {},
  };
}

const Page = () => {
  return (
    <div>
      <SignupWidget />
    </div>
  );
};

export default Page;
