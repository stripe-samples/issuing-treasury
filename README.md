## Example Stripe Treasury integration showing Embedded Finance


This demo is an application that allows you to quickly experiment with an
Embedded Finance experience.


With this application, you can:

- Sign up for a Stripe [Custom connect](https://stripe.com/docs/connect/custom-accounts) Account and for a Stripe Treasury Financial Account.

- Onboard using [Connect Onboarding](https://stripe.com/docs/connect/connect-onboarding) for Custom accounts.

- Display the Financial Account Balance.

- Display a chart to quickly visualize funds coming in and coming out.

- Display a transaction report.

- Create a cardholder and issue a card, using the Financial Account as the source of funds.

- Display the issued card information leveraging Stripe Elements.

- Display the Financial Account's Routing and Account numbers.

- Send money from the Financial Account, either using ACH or Wire Transfers.



In addition to these functions, there is also a *Test Mode only* section that will help platforms understanding the different mechanisms to fund Financial Accounts by:


- Simulating receiving a Transfer from an external account to a Financial Account.

- Creating a PaymentLink and then, paying out funds from the Connected Account balance to the Financial Account Balance.


You can watch a recorded live stream about this demo [here](https://www.youtube.com/watch?v=2MiMFJ9c4t8).


## Requirements



**A Stripe account**: You can sign up for a Stripe account here: https://dashboard.stripe.com/register

**Onboard to Treasury and Issuing**: [Please contact sales](https://go.stripe.global/treasury-inquiry).

**Stripe API Key**s: Available in your Stripe dashboard here: https://dashboard.stripe.com/test/apikeys



## Installation instructions



### Installing the dependencies


After cloning this repo, install the dependencies.



```bash
npm install
```



### Populating the .env file

Rename the .env.example file on the root of your project to .env

Edit your new .env file and add:

- **STRIPE_SECRET_KEY**: Your Stripe private key.
- **PUBLISHABLE_KEY**: Your Stripe publishable key.
- **SESSION_SECRET_KEY**: A string of at least 32 characters long.
- **DEMO_HOST**: The host where your application will run (if local you can use *http://localhost:3000* )

### Running the application

In order to run the application, after you installed the dependencies and created the .env file run the following command:

```bash
npm run dev
```

*Notice: This application is intended to be an example, and it should not be run in production as is.*
