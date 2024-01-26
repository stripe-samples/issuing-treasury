import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import { hasOutstandingRequirements } from "./utils/onboarding-helpers";
import { getPlatform } from "./utils/platform";

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
      platform: getPlatform(token.country),
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

    return NextResponse.next();
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
