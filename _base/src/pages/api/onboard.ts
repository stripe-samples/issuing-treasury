import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { apiResponse } from "src/types/api-response";
import FinancialProduct from "src/types/financial-product";
import {
  CountryConfigMap,
  SupportedCountry,
} from "src/utils/account-management-helpers";
import { handlerMapping } from "src/utils/api-helpers";
import {
  getFiscalYearEnd,
  isDemoMode,
  TOS_ACCEPTANCE,
} from "src/utils/demo-helpers";
import { createAccountOnboardingUrl } from "src/utils/onboarding-helpers";
import { getSessionForServerSide } from "src/utils/session-helpers";
import stripeClient from "src/utils/stripe-loader";
import validationSchemas from "src/utils/validation-schemas";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: onboard,
  });

const onboard = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const {
    email,
    stripeAccount,
    country,
    // @begin-exclude-from-subapps
    financialProduct,
    // @end-exclude-from-subapps
  } = session;
  const { accountId, platform } = stripeAccount;

  const {
    businessName,
    skipOnboarding,
  }: { businessName: string; skipOnboarding?: boolean } = req.body;

  let validationSchema;
  if (isDemoMode()) {
    validationSchema = validationSchemas.business.withOnbardingSkip;
  } else {
    validationSchema = validationSchemas.business.default;
  }

  try {
    await validationSchema.validate(
      { businessName, skipOnboarding },
      { abortEarly: false },
    );
  } catch (error) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: (error as Error).message },
      }),
    );
  }

  const onboardingData: Stripe.AccountUpdateParams = {
    business_profile: { name: businessName },
    // TODO: Only update the fields during the demo that are outstanding to speed things up
    // FOR-DEMO-ONLY: We're using fake data for illustrative purposes in this demo. The fake data will be used to bypass
    // showing the Stripe Connect Onboarding forms. In a real application, you would not do this so that you can collect
    // the real KYC data from your users.
    ...(isDemoMode() && {
      business_type: "individual",
      business_profile: {
        name: businessName,
        // Merchant category code for "computer software stores" (https://fs.fldfs.com/iwpapps/pcard/docs/MCCs.pdf)
        mcc: "5734",
        product_description: "Some demo product",
        url: "https://some-company.com",
        annual_revenue: {
          amount: 0,
          currency: CountryConfigMap[country].currency,
          fiscal_year_end: getFiscalYearEnd(),
        },
        estimated_worker_count: 1,
      },
      company: {
        name: businessName,
        // Fake business TIN: https://stripe.com/docs/connect/testing#test-business-tax-ids
        tax_id: "000000000",
      },
      individual: {
        address: {
          // This value causes the address to be verified in testmode: https://stripe.com/docs/connect/testing#test-verification-addresses
          line1: "address_full_match",
          // @if financialProduct==embedded-finance
          ...(country === SupportedCountry.US && {
            city: "South San Francisco",
            state: "CA",
            postal_code: "94080",
          }),
          // @endif
          // @if financialProduct==expense-management
          ...(country === SupportedCountry.UK && {
            city: "London",
            postal_code: "WC32 4AP",
          }),
          // @endif
          country: country.toString(),
        },
        // These values together cause the DOB to be verified in testmode: https://stripe.com/docs/connect/testing#test-dobs
        dob: {
          day: 1,
          month: 1,
          year: 1901,
        },
        email: email,
        first_name: "John",
        last_name: "Smith",
        // Fake phone number: https://docs.stripe.com/connect/testing#using-oauth
        phone: "000-000-0000",
      },
      ...(skipOnboarding && { tos_acceptance: TOS_ACCEPTANCE }),
      // Faking Terms of Service acceptances
      settings: {
        card_issuing: {
          tos_acceptance: TOS_ACCEPTANCE,
        },
        // @begin-exclude-from-subapps
        ...(financialProduct == FinancialProduct.EmbeddedFinance && {
          // @end-exclude-from-subapps
          // @if financialProduct==embedded-finance
          treasury: {
            tos_acceptance: TOS_ACCEPTANCE,
          },
          // @endif
          // @begin-exclude-from-subapps
        }),
        // @end-exclude-from-subapps
      },
    }),
  };

  const stripe = stripeClient(platform);
  await stripe.accounts.update(accountId, onboardingData);

  // FOR-DEMO-ONLY: We're going to check if the user wants to skip the onboarding process. If they do, we'll redirect to
  // the home page. In a real application, you would not allow this bypass so that you can collect the real KYC data
  // from your users.
  if (isDemoMode() && skipOnboarding) {
    return res
      .status(200)
      .json(apiResponse({ success: true, data: { redirectUrl: "/" } }));
  }

  // This is the Connect Onboarding URL that will be used to collect KYC information from the user
  const onboardingUrl = await createAccountOnboardingUrl(stripeAccount);

  return res
    .status(200)
    .json(apiResponse({ success: true, data: { redirectUrl: onboardingUrl } }));
};

export default handler;
