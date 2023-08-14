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

## No-code deploy demo on Render.com

To deploy this sample application directly in Render, click on the button below. Once you log in or sign up, it will
initiate setup with a free database and web service instance. No coding required.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/stripe-samples/issuing-treasury)

When prompted, please provide:

- **Blueprint Name**: Enter any name (e.g., "Demo")
- **Under Key / Value**:
  - **STRIPE_SECRET_KEY**: Enter your Stripe testmode API key
  - **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Enter your Stripe testmode publishable key

After around 5 minutes, click on the "issuing-treasury" link to access your deployed web service's URL.

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

## Elevate Your Development with Devias Pro

The free Devias theme, licensed under MIT, played a vital role in the swift rewrite of this sample app. Beyond delivering an elegant UX, this theme seamlessly integrated with Material UI and React, enabling us to create a compelling and high-quality sample app.

While the free Devias theme was instrumental in the creation of this sample app, we recommend the Devias Pro version for developers aiming to build full-featured, production-ready applications.

Devias Pro goes above and beyond the capabilities of the free version, offering an extensive array of advanced components and features carefully crafted to expedite and enhance your development process. By upgrading to Devias Pro, you'll gain access to additional layouts, advanced React components, pre-built dashboards, and essential TypeScript support that ensures your code remains clean, robust, and scalable.

Explore and experience the benefits of Devias Pro [here](https://material-kit-pro-react.devias.io/).
