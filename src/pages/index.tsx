import { parse } from "cookie";
import React from "react";

import { decode } from "../utils/jwt_encode_decode";

export async function getServerSideProps(context: any) {
  if ("cookie" in context.req.headers) {
    const cookie = parse(context.req.headers.cookie);
    if ("app_auth" in cookie) {
      let session;
      try {
        session = decode(cookie.app_auth);
      } catch (e) {
        console.log(e);
        return {
          redirect: {
            destination: "/auth/login",
          },
        };
      }
      // @ts-expect-error Remove after deployment succeeds
      if (session.requiresOnboarding) {
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
  } else {
    console.log("app_auth not in cookie");
  }
  return {
    redirect: {
      destination: "/auth/login",
    },
  };
}

// Sign in page
const Page = () => {
  return <div></div>;
};

export default Page;
