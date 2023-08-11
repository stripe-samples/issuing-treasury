# Stripe Issuing and Treasury: An Embedded Finance Example

This demo application enables users to work with an Embedded Finance experience, utilising Stripe's Issuing and Treasury APIs.

The application provides the following features:

- Creation of a Stripe [Custom connect](https://stripe.com/docs/connect/custom-accounts) Account and a Stripe Treasury Financial Account.
- Use of [Connect Onboarding](https://stripe.com/docs/connect/connect-onboarding) for Custom accounts setup.
- Financial Account balance display.
- Visualisation of incoming and outgoing funds via a chart.
- Transaction report display.
- Cardholder creation and card issuing, with the Financial Account serving as the funds source.
- Compliance-maintained card information display using Stripe Elements.
- Display of Financial Account's Routing and Account numbers.
- Money transfer from the Financial Account with ACH or Wire Transfers.

Additionally, a *Test Data* section helps to understand different mechanisms for funding Financial Accounts, by simulating the following:

- Transfer reception from an external account to a Financial Account.
- Creating a PaymentLink and then, paying out funds from the Connected Account balance to the Financial Account Balance.

## Prerequisites

- **A Stripe account**: Register for a Stripe account here: <https://dashboard.stripe.com/register>
- **Enable Issuing and Treasury in Stripe**:
  - Issuing: Use [Instant Testmode](https://dashboard.stripe.com/setup/issuing/activate)
  - Treasury: [Contact sales](https://go.stripe.global/treasury-inquiry)
- **Stripe API keys**: Obtain your keys via <https://dashboard.stripe.com/test/apikeys>

## Deploy demo on Render.com

To deploy this sample application directly in Render, click on the button below. It automatically logs into Render and
initiates setup with a free database and web service instance. No coding required.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/stripe-samples/issuing-treasury)

Upon prompt, please provide:

- **Blueprint Name**: Enter any name (e.g., "Demo")
- **Under Key / Value**:
  - **STRIPE_SECRET_KEY**: Enter your Stripe testmode API key
  - **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Enter your Stripe testmode publishable key

After around 5 minutes, click on the "issuing-treasury" link to access your deployed web service.

## Local Installation

### Dependency Installation

Post cloning this repo, install the dependencies using:

    npm install

### .env File Setup

Replicate `.env.example` as `.env` (in project root directory) using:

    cp .env.example .env

Update `.env` to reflect:

- **STRIPE_SECRET_KEY**: Your Stripe private key
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable key
- **NEXTAUTH_SECRET**: For JWT encryption by NextAuth.js ([learn more](https://next-auth.js.org/configuration/options#nextauth_secret)). Use `openssl rand -base64 32` to obtain a new one
- **CONNECT_ONBOARDING_REDIRECT_URL**: Your application host, for local use, use "<http://localhost:3000>"

### Database Setup

On Mac, follow these instructions to install Postgres:

    brew install postgresql@14
    createuser -s postgres

You'll find more about the `createuser` step [here](https://stackoverflow.com/a/15309551).

Next, create the database with:

    npx prisma db push

If it errors out (perhaps due to permission issues), simply run the included script:

    ./db/setup-database.postgres.sh

This script creates a local Postgres `issuing_treasury` database.

### Application Launch

After necessary setups, launch the application with `npm run dev`.

*Note: This application serves as an example and should not proceed to production deployment as it is.*

## Acknowledgment to Devias Theme

The Devias theme significantly contributed to the swift construction of this sample app. Besides providing an elegant display, Devias offers a streamlined integration with Material UI. The effective utilization of this free theme allowed us to deliver a high-quality and engaging sample app.

## Accelerating Development with Devias Pro

Although the free Devias theme was instrumental in building this sample application, for developers who are aiming for a full-featured, production-ready application, we recommend the Devias Pro version.

Devias Pro extends beyond the capacity of the free version, providing an extensive array of advanced components and features designed to expedite and enrich your development process. With Devias Pro, you gain access to additional layouts, advanced React components, and pre-built dashboards, not to mention TypeScript support that underpins clean, robust, and scalable code.

One of the key advantages of Devias Pro is its inclusion of Figma design files. These files empower developers to efficiently build complex user experiences with precision and consistency. The design resources and components available in Devias Pro are patterned after modern UX/UI best practices, providing a smooth, optimized user experience out of the box.

By choosing Devias Pro, you're not just getting a theme; you're getting a robust toolset designed to help you turn your ideas into fully fledged, industrial-strength applications faster. It's a springboard that propels your project from its inception to a production-ready state in less time.

We appreciate the pivotal role Devias themes have played in the development of this sample app, and wholeheartedly recommend a step up to Devias Pro for developers keen on accelerating their development cycles, improving the overall quality of their products, and delivering a top-tier user experience.

You can explore and experience the prodigious benefits of Devias Pro [here](https://material-kit-pro-react.devias.io/).
