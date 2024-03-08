# Stripe Issuing: An Expense Management starter application

This sample demonstrates a basic web application with expense management features built on Stripe’s Issuing APIs.

<p align="center">
  <img width="715" alt="Issuing sample app card details screenshot" src="https://github.com/stripe-samples/issuing-treasury/blob/main/expense-management/public/assets/issuing-only-screenshot.jpeg" />
</p>

## Features

- Onboard and verify business customers 🔍
- Issue cards 💳
- Display full card numbers with PCI compliance 🔢
- Test funding an Issuing balance 🏦
- Simulate test payments ⚡
- Review transactions 📃

## Prerequisites

- Activate Stripe Issuing in test mode through this link: <https://dashboard.stripe.com/setup/issuing/activate?a=1>
- Obtain your Stripe API keys at <https://dashboard.stripe.com/test/apikeys>

## Deploy the sample app to the cloud

Click the button below to get started on [Vercel](https://vercel.com/docs). During setup, you will be asked to provide values for some environment variables. See information about [required environment variables](#environment-variables) below to learn more about the API keys and secrets you'll need to provide.

This starter app supports both UK and EU Issuing users: you can provide Stripe API keys for platforms based in _one or both_ of those regions. Most users will only issue in one region, so will need to provide only the `_UK` or `_EU` environment variables. Note that Vercel considers all environment variables for one-click deployments to be compulsory: use the string value `none` for the regional environment variables that you don't want to provide.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fstripe-samples%2Fissuing-treasury%2Fexpense-management&env=NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_UK,STRIPE_SECRET_KEY_UK,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_EU,STRIPE_SECRET_KEY_EU,NEXTAUTH_SECRET&project-name=expense-management&demo-title=Expense%20Management%20app&demo-description=A%20commercial%20pre-funded%20card&repository-name=expense-management&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D)

## Local development

You can also clone this repo and run it locally by following the steps below.

### Clone the repo

Clone this repo and then run these steps inside it.

    git clone https://github.com/stripe-samples/issuing-treasury.git && cd issuing-treasury/expense-management

### Node.js installation

Install the required Node.js runtime. You can install it directly from the [Node.js website](https://nodejs.org/en/download/releases)
but we recommend using a Node version manager. Most version managers can read the required version off of `.node-version`
and install it.

If you're using the `nodenv` Node version manager ([setup instructions for nodenv](https://github.com/nodenv/nodenv#installation)), use:

    nodenv install

If you're using the popular `nvm` Node version manager ([setup instructions for Node Version Manager](https://github.com/nvm-sh/nvm#installing-and-updating)), use:

    nvm install

### Dependency installation

Once Node.js is installed and activated, install the application's dependencies using:

    npm install

### Environment variables file setup <a name="environment-variables"></a>

Replicate `.env.example` as `.env` using:

    cp .env.example .env

Update `.env` to reflect:

- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable test mode [API key](https://dashboard.stripe.com/test/apikeys) (starts with `pk_test_...`).
- **STRIPE_SECRET_KEY**: Your Stripe secret test mode [API key](https://dashboard.stripe.com/test/apikeys) (starts with `sk_test_...`).
- **NEXTAUTH_SECRET**: For JWT encryption by NextAuth.js ([learn more](https://next-auth.js.org/configuration/options#nextauth_secret)). Use `openssl rand -base64 32` to obtain a new one.
- **NEXTAUTH_URL**: Your application URL, for local use you can keep the default "<http://localhost:3000>".
- **CONNECT_ONBOARDING_REDIRECT_URL**: Your application URL, for local use you can keep the default "<http://localhost:3000>".

### Database setup

On Mac, follow these instructions to install Postgres:

    brew install postgresql@14
    createuser -s postgres
    createdb "$(whoami)"

You'll find more about the why you need the `createuser` step [here](https://stackoverflow.com/a/15309551).

Next, create the database with:

    npx prisma migrate dev

If it errors out (perhaps due to permission issue running the Prisma CLI), simply run the included script:

    ./db/setup-database.postgres.sh

This script creates a local Postgres `expense_management` database.

### Application launch

After necessary setups, launch the application with `npm run dev`.

*Note: This application serves as an example and should not proceed to production deployment as it is.*

## Customizing your UI with the Devias Material UI theme

This sample uses the [free Devias UI kit](https://github.com/devias-io/material-kit-react) under an MIT license, which seamlessly integrates with Material UI and React.

You can easily customize aspects of the theme like the color palette by modifying the code in `/src/theme`.

To build a full-featured, production-ready application we recommend the [Devias Pro](https://material-kit-pro-react.devias.io/) version, which offers additional layouts, advanced React components, pre-built dashboards, and essential TypeScript support that ensures your code remains clean, robust, and scalable.
