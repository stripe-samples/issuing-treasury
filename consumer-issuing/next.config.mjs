const isDevelopment = process.env.NODE_ENV === "development";

// We are setting the CSP headers as strictly as possible. There are a few notable exceptions being made:
// - We are allowing 'unsafe-eval' in the script-src directive in development only because we are using Next.js'
//   built-in support for React Fast Refresh. This is a temporary exception until Next.js supports a better
//   solution for Fast Refresh.
// - We are allowing 'unsafe-inline' in the style-src directive. This is a temporary exception until Next.js
//   supports a better solution.
// - We are allowing fonts.gstatic.com and fonts.googleapis.com in the font-src directive. We could host the
//   fonts ourselves, but it's easier to use Google Fonts and the risk is minimal. Feel free to host the fonts
//   yourself if you prefer and tighten up the font-src and style-src directives.
// - We are allowing js.stripe.com in the frame-src directive. This is required for Stripe Issuing Elements to work.
//
// Learn more about CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
// Learn more about Next.js security headers: https://nextjs.org/docs/pages/api-reference/next-config-js/headers#content-security-policy
//
// Also follow [this discussion](https://github.com/vercel/next.js/discussions/41473) about making Next.js have a
// strict CSP implementation which would make it easier to tighten these directives with a `nonce`.
const ContentSecurityPolicy = `
  default-src 'none';
  base-uri 'none';
  connect-src 'self';
  font-src 'self' fonts.gstatic.com;
  form-action 'self';
  frame-ancestors 'none';
  frame-src js.stripe.com;
  img-src 'self';
  script-src 'self' js.stripe.com ${isDevelopment ? "'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  upgrade-insecure-requests;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
