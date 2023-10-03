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

For details of more features see the [Issuing and Treasury sample app documentation](https://stripe.com/docs/financial-services/demo-app).

## Guide

Check out our detailed Stripe docs [here](https://stripe.com/docs/financial-services/demo-app?ui=make-your-own-copy#create-a-copy-of-the-issuing-and-treasury-demo-app)
for getting started developing with the demo.

## Local development

You can also clone this repo and run it locally by following these steps:

### Cloning and setting up secrets

Follow [these instructions](https://stripe.com/docs/financial-services/demo-app?ui=make-your-own-copy&make-your-own-copy-tabs=demo-app-repo#create-a-copy-of-the-issuing-and-treasury-demo-app)
for setting up the repo locally, ensuring your Stripe platform account has Issuing and Treasury active, and setting up
the Stripe test secrets keys.

Once you've set that up, resume following these instructions here.

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

