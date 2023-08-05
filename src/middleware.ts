import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // This will only be called once the user is authorized
  function middleware(req) {
    const token = req.nextauth.token;

    if (token == null) {
      throw new Error("JWT is missing in the request");
    }

    if (token.accountId == undefined) {
      throw new Error(
        "Pre-onboarding auth check: Stripe accountId is missing in the token",
      );
    }

    if (token.requiresOnboarding == undefined) {
      throw new Error(
        "Pre-onboarding auth check: requiresOnboarding field is missing in the token",
      );
    }

    const isOnOnboardingPage = req.nextUrl.pathname === "/onboard";
    if (token.requiresOnboarding && !isOnOnboardingPage) {
      return NextResponse.redirect(new URL("/onboard", req.url));
    } else if (!token.requiresOnboarding && isOnOnboardingPage) {
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
