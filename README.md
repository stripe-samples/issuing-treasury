# Stripe Issuing and Treasury: An Embedded Finance starter application

This sample demonstrates a basic web application with embedded finance features built on Stripe’s Issuing and Treasury APIs.

<p align="center">
  <img width="715" alt="CleanShot 2023-09-06 at 16 28 21@2x" src="https://github.com/stripe-samples/issuing-treasury/assets/103917180/5acecf09-d65d-499c-9171-eb187656dd2b">
</p>

## Demo

See the sample app live at <https://baas.stripe.dev>

If you choose not to skip onboarding with prefilled info, then follow these steps when redirected to the Stripe Connect Onboarding form:

- Enter “000 000 0000” for phone number and any fake email address
- Click “Use test code” when prompted for SMS verification
- Click “Skip this step” when prompted to verify your identity

## Features

- Onboard and verify business customers 🔍
- Issue cards 💳
- Display full card numbers with PCI compliance 🔢
- Create financial accounts 🏦
- Simulate test payments ⚡
- Review transactions 📃

For details of more features see the [Issuing and Treasury sample app documentation](https://site-admin.stripe.com/docs/treasury/examples/sample-app).

## Prerequisites

- Register for a Stripe account here: <https://dashboard.stripe.com/register>
- Activate Issuing and Treasury in test mode through this link: <https://dashboard.stripe.com/setup/treasury/activate?a=1>
- Obtain your Stripe API keys at <https://dashboard.stripe.com/test/apikeys>

## Deploy the web application on Render (no code)

You can immediately deploy this sample app to a unique, public URL (for example: `https://issuing-treasury-xyz1.onrender.com`) with no coding required by using Render. Follow these steps:

1. Click the button below to deploy the sample app to Render:

   [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/stripe-samples/issuing-treasury)

2. Create a free Render account when prompted if you don't already have one
3. On the Blueprints screen, enter the following:
   - **Blueprint Name**: Enter any name (i.e. "Demo") 
   - **Branch**: Select `main`
   - **Under Key / Value**:
     - **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Your publishable test mode [API key](https://dashboard.stripe.com/test/apikeys) (starts with `pk_test_...`)
     - **STRIPE_SECRET_KEY**: Your secret test mode [API key](https://dashboard.stripe.com/test/apikeys) (starts with `sk_test_...`))
4. Click the "Apply" button
5. Wait for Render to finish creating the services (this can take up to 5 minutes) and then click "issuing-treasury"

   <img width="375" alt="CleanShot 2023-09-06 at 16 30 05@2x" src="https://github.com/stripe-samples/issuing-treasury/assets/103917180/9b0c7831-8ebd-4f17-8016-f990828c6978">
6. On the next page, click your unique URL to open your deployment of the sample app

   <img width="395" alt="CleanShot 2023-09-06 at 16 30 45@2x" src="https://github.com/stripe-samples/issuing-treasury/assets/103917180/3082fdde-0f45-42d1-b442-7100b239ee11">

## Local development

You can also clone this repo and run it locally by following these steps:

### Dependency installation

Post cloning this repo, install the dependencies using:

    npm install

### .env File setup

Replicate `.env.example` as `.env` (in project root directory) using:

    cp .env.example .env

Update `.env` to reflect:

- **STRIPE_SECRET_KEY**: Your Stripe private key
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable key
- **NEXTAUTH_SECRET**: For JWT encryption by NextAuth.js ([learn more](https://next-auth.js.org/configuration/options#nextauth_secret)). Use `openssl rand -base64 32` to obtain a new one
- **CONNECT_ONBOARDING_REDIRECT_URL**: Your application host, for local use, use "<http://localhost:3000>"

### Database setup

On Mac, follow these instructions to install Postgres:

    brew install postgresql@14
    createuser -s postgres

You'll find more about the `createuser` step [here](https://stackoverflow.com/a/15309551).

Next, create the database with:

    npx prisma db push

If it errors out (perhaps due to permission issues), simply run the included script:

    ./db/setup-database.postgres.sh

This script creates a local Postgres `issuing_treasury` database.

### Application launch

After necessary setups, launch the application with `npm run dev`.

*Note: This application serves as an example and should not proceed to production deployment as it is.*

## Customizing your UI with the Devias Material UI theme

This sample uses the [free Devias UI kit](https://github.com/devias-io/material-kit-react) under an MIT license, which seamlessly integrates with Material UI and React.

You can easily customize aspects of the theme like the color palette by modifying the code in `/src/theme`.

To build a full-featured, production-ready application we recommend the [Devias Pro](https://material-kit-pro-react.devias.io/) version, which offers additional layouts, advanced React components, pre-built dashboards, and essential TypeScript support that ensures your code remains clean, robust, and scalable.

