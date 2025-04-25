import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import { getPlatformStripeAccountForCountry } from "./utils/account-management-helpers";
import { hasOutstandingRequirements } from "./utils/onboarding-helpers";

export default withAuth(
  // This will only be called once the user is authorized
  async function middleware(req) {
    const token = req.nextauth.token;

    if (token == null) {
      throw new Error("JWT is missing in the request");
    }

    if (token.accountId == undefined) {
      throw new Error(
        "Pre-onboarding auth check: Stripe accountId is missing in the token",
      );
    }

    if (token.email == undefined) {
      throw new Error(
        "Pre-onboarding auth check: email field is missing in the token",
      );
    }

    if (token.requiresOnboarding == undefined) {
      throw new Error(
        "Pre-onboarding auth check: requiresOnboarding field is missing in the token",
      );
    }
    const accessingOnboarding =
      req.nextUrl.pathname === "/onboard" ||
      req.nextUrl.pathname === "/api/onboard";
    const stripeAccount = {
      accountId: token.accountId,
      platform: getPlatformStripeAccountForCountry(token.country),
    };
    const requiresOnboarding =
      token.requiresOnboarding &&
      (await hasOutstandingRequirements(stripeAccount));
    // If the user needs to onboard but they are trying to access other pages, redirect them to the onboarding page
    if (requiresOnboarding && !accessingOnboarding) {
      return NextResponse.redirect(new URL("/onboard", req.url));
    }
    // If the user doesn't need to onboard but they are trying to access the onboarding page, redirect them to the home page
    else if (!requiresOnboarding && accessingOnboarding) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect-js.stripe.com/v1.0/connect.js https://js.stripe.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data:;
      font-src 'self' https://fonts.gstatic.com;
      object-src 'none';
      frame-src https://connect-js.stripe.com https://js.stripe.com;
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
  `;
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
      .replace(/\s{2,}/g, " ")
      .trim();

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-nonce", nonce);

    requestHeaders.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue,
    );

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue,
    );

    return response;
  },
  {
    pages: {
      signIn: "/auth/login",
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (images, fonts, etc.)
     * - (auth|api)/register (registration page)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets|auth/register|api/register).*)",
  ],
};
