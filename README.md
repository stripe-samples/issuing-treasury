
## Example Stripe Issuing and Treasury integration demonstrating Embedded Finance

This demo is an application that allows you to quickly experiment with an Embedded Finance experience using Stripe Issuing & Treasury APIs.

With this application, you can:

- Sign up for a Stripe [Custom connect](https://stripe.com/docs/connect/custom-accounts) Account and for a Stripe Treasury Financial Account
- Onboard using [Connect Onboarding](https://stripe.com/docs/connect/connect-onboarding) for Custom accounts
- Display the Financial Account Balance
- Display a chart to quickly visualize funds coming in and coming out
- Display a transaction report
- Create a cardholder and issue a card, using the Financial Account as the source of funds
- Display the issued card information in a compliant manner by leveraging Stripe Elements
- Display the Financial Account's Routing and Account numbers
- Send money from the Financial Account, either using ACH or Wire Transfers

In addition to these functions, there is also a *Test Data* section that will help platforms understanding the different mechanisms to fund Financial Accounts by:

- Simulating receiving a Transfer from an external account to a Financial Account.
- Creating a PaymentLink and then, paying out funds from the Connected Account balance to the Financial Account Balance.
<!-- You can watch a recorded live stream about this demo [here](https://www.youtube.com/watch?v=2MiMFJ9c4t8). -->

## Requirements

**A Stripe account**: You can sign up for a Stripe account here: https://dashboard.stripe.com/register
**Onboard to Issuing and Treasury**:
  * Issuing: [Instant Testmode](https://dashboard.stripe.com/setup/issuing/activate)
  * Treasury: [Please contact sales](https://go.stripe.global/treasury-inquiry)
**Stripe API keys**: Available in your Stripe dashboard here: https://dashboard.stripe.com/test/apikeys

## Installation instructions

### Installing the dependencies

After cloning this repo, install the dependencies.

    $ npm install

### Populating your .env file

Copy the `.env.example` file on the root of your project to `.env`:

    $ cp .env.example .env

Edit your new `.env` file and update the required information:

- **STRIPE_SECRET_KEY**: Your Stripe private key.
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable key.
- **NEXTAUTH_SECRET**: Used to encrypt the NextAuth.js JWT ([learn more](https://next-auth.js.org/configuration/options#nextauth_secret)). You can use `openssl rand -base64 32` to generate a new one.
- **DEMO_HOST**: The host where your application will run (if local you can use `"http://localhost:3000"`)

### Setting up the database

On a Mac, follow these instructions to install Postgres:

    $ brew install postgresql@14
    $ createuser -s postgres

You can learn more about the `createuser` step [here](https://stackoverflow.com/a/15309551).

Now you need to create the database:

    $ npx prisma db push

If this fails for any reasons such as permissions being denied, there's an included idempotent script you can run:

    $ ./db/setup-database.postgres.sh

This will create a `issuing_treasury` database in your local Postgres instance.

### Running the application

In order to run the application, after you installed the dependencies and created the `.env` file run the following command:

```bash
npm run dev
```

*Notice: This application is intended to be an example, and it should not be run in production as is.*
