import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getPlatform } from "src/utils/platform";
import { getStripeSecretKey } from "src/utils/stripe-authentication";
import stripeClient from "src/utils/stripe-loader";
import validationSchemas from "src/utils/validation-schemas";
import { logApiRequest } from "src/utils/api-logger";

import { apiResponse } from "src/types/api-response";
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

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  handlerMapping(req, res, {
    POST: onboard,
  });

const onboard = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSessionForServerSide(req, res);
  const { email, stripeAccount, country } = session;
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

  const [firstName, ...lastNameParts] = businessName.split(" ");
  const lastName = lastNameParts.join(" ");

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
          line1: "354 Oyster Point Blvd",
          city: "South San Francisco",
          state: "CA",
          postal_code: "94080",
          country: "US",
        },
        // These values together cause the DOB to be verified in testmode: https://stripe.com/docs/connect/testing#test-dobs
        dob: {
          day: 1,
          month: 1,
          year: 1901,
        },
        email: email,
        first_name: firstName,
        last_name: lastName,
        // Fake phone number: https://docs.stripe.com/connect/testing#using-oauth
        phone: "000-000-0000",
      },
      ...(skipOnboarding && { tos_acceptance: TOS_ACCEPTANCE }),
      // Faking Terms of Service acceptances
      settings: {
        card_issuing: {
          tos_acceptance: TOS_ACCEPTANCE,
        },
      },
    }),
  };

  const stripe = stripeClient(platform);
  await stripe.accounts.update(accountId, onboardingData);

  // Create Issuing Program for the account
  // console.log("Creating issuing program with params:", {
  //   platform_program: process.env.PLATFORM_PROGRAM,
  //   is_default: "true"
  // });

  const createProgramResponse = await fetch("https://api.stripe.com/v1/issuing/programs", {
    method: "POST",
    headers: {
      "Stripe-Account": accountId,
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + getStripeSecretKey(platform),
      "Stripe-Version": "2025-03-31.basil;issuing_program_beta=v2"
    },
    body: new URLSearchParams({
      platform_program: process.env.PLATFORM_PROGRAM || "",
      is_default: "true"
    }),
  });

  // console.log("Issuing program creation response status:", createProgramResponse.status);
  const programResponseText = await createProgramResponse.text();
  // console.log("Issuing program creation response body:", programResponseText);

  // Log the issuing program creation request
  await logApiRequest(
    email,
    "https://api.stripe.com/v1/issuing/programs",
    "POST",
    {
      platform_program: process.env.PLATFORM_PROGRAM || "",
      is_default: true
    },
    JSON.parse(programResponseText)
  );

  if (!createProgramResponse.ok) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: "Failed to create issuing program" },
      }),
    );
  }

  // Create Credit Underwriting Record from the account
  const underwritingParams = {
    "application[purpose]": "credit_line_opening",
    "application[submitted_at]": Math.floor(Date.now() / 1000).toString(),
    "credit_user[name]": businessName,
    "credit_user[email]": email
  };

  // console.log("Creating underwriting record with params:", underwritingParams);

  const createUnderwritingResponse = await fetch("https://api.stripe.com/v1/issuing/credit_underwriting_records/create_from_application", {
    method: "POST",
    headers: {
      "Stripe-Account": accountId,
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + getStripeSecretKey(platform),
      "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
    },
    body: new URLSearchParams(underwritingParams),
  });

  // console.log("Underwriting record creation response status:", createUnderwritingResponse.status);
  
  let underwritingRecord;
  try {
    underwritingRecord = await createUnderwritingResponse.json();
    // console.log("Underwriting record creation response:", underwritingRecord);

    // Log the underwriting record creation request
    await logApiRequest(
      email,
      "https://api.stripe.com/v1/issuing/credit_underwriting_records/create_from_application",
      "POST",
      underwritingParams,
      underwritingRecord
    );
  } catch (error) {
    console.error("Error parsing underwriting record response:", error);
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: "Failed to parse credit underwriting record response" },
      }),
    );
  }

  if (!createUnderwritingResponse.ok) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: "Failed to create credit underwriting record from application" },
      }),
    );
  }

  if (!underwritingRecord || !underwritingRecord.id) {
    console.error("Invalid underwriting record response:", underwritingRecord);
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: "Invalid credit underwriting record response" },
      }),
    );
  }

  // Report the underwriting decision
  const decisionParams = {
    decided_at: Math.floor(Date.now() / 1000).toString(),
    "decision[type]": "credit_limit_approved",
    "decision[credit_limit_approved][amount]": "2000"
  };

  const reportDecisionResponse = await fetch(`https://api.stripe.com/v1/issuing/credit_underwriting_records/${underwritingRecord.id}/report_decision`, {
    method: "POST",
    headers: {
      "Stripe-Account": accountId,
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + getStripeSecretKey(platform),
      "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
    },
    body: new URLSearchParams(decisionParams),
  });

  const decisionResponse = await reportDecisionResponse.json();

  // Log the underwriting decision request
  await logApiRequest(
    email,
    `https://api.stripe.com/v1/issuing/credit_underwriting_records/${underwritingRecord.id}/report_decision`,
    "POST",
    decisionParams,
    decisionResponse
  );

  if (!reportDecisionResponse.ok) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: "Failed to report credit underwriting decision" },
      }),
    );
  }

  // Check capability status before activating Credit Policy
  // console.log("Checking capability status for card_issuing_consumer_revolving_credit_card_celtic");
  
  const POLL_INTERVAL = 2000; // 2 seconds
  const MAX_ATTEMPTS = 30; // 1 minute total
  let attempts = 0;
  let capabilityStatus;

  while (attempts < MAX_ATTEMPTS) {
    const capabilityResponse = await fetch(`https://api.stripe.com/v1/accounts/${accountId}/capabilities/card_issuing_consumer_revolving_credit_card_celtic`, {
      method: "GET",
      headers: {
        "Stripe-Account": accountId,
        Authorization: "Bearer " + getStripeSecretKey(platform),
        "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1;issuing_program_beta=v2"
      }
    });

    console.log(`Capability check attempt ${attempts + 1}/${MAX_ATTEMPTS} response status:`, capabilityResponse.status);
    
    try {
      capabilityStatus = await capabilityResponse.json();
      // console.log("Capability status:", capabilityStatus);
      
      if (capabilityStatus.status === "active") {
        console.log("Capability is now active, proceeding with Credit Policy activation");
        break;
      }
      
      if (!capabilityResponse.ok) {
        return res.status(400).json(
          apiResponse({
            success: false,
            error: { 
              message: "Failed to check capability status",
              details: capabilityStatus?.error?.message || "Unknown error"
            },
          }),
        );
      }
    } catch (error) {
      console.error("Error parsing capability status response:", error);
      return res.status(400).json(
        apiResponse({
          success: false,
          error: { message: "Failed to parse capability status response" },
        }),
      );
    }

    attempts++;
    if (attempts < MAX_ATTEMPTS) {
      // console.log(`Capability not yet active, waiting ${POLL_INTERVAL}ms before next check...`);
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }
  }

  if (attempts >= MAX_ATTEMPTS) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { 
          message: "Capability did not become active within the expected time",
          details: "Timed out waiting for capability to become active"
        },
      }),
    );
  }

  // Poll for Credit Policy presence
  // console.log("Checking for Credit Policy presence");
  attempts = 0;
  let creditPolicy;

  while (attempts < MAX_ATTEMPTS) {
    const creditPolicyResponse = await fetch(`https://api.stripe.com/v1/issuing/credit_policy`, {
      method: "GET",
      headers: {
        "Stripe-Account": accountId,
        Authorization: "Bearer " + getStripeSecretKey(platform),
        "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1;issuing_program_beta=v2"
      }
    });

    // console.log(`Credit Policy check attempt ${attempts + 1}/${MAX_ATTEMPTS} response status:`, creditPolicyResponse.status);
    
    try {
      const response = await creditPolicyResponse.json();
      // console.log("Credit Policy response:", response);
      
      if (response.object === "issuing.credit_policy") {
        console.log("Credit Policy is present, proceeding with activation");
        creditPolicy = response;
        break;
      }
      
      // console.log("No Credit Policy found yet, will retry...");
    } catch (error) {
      console.error("Error parsing Credit Policy response:", error);
      return res.status(400).json(
        apiResponse({
          success: false,
          error: { message: "Failed to parse Credit Policy response" },
        }),
      );
    }

    attempts++;
    if (attempts < MAX_ATTEMPTS) {
      // console.log(`Credit Policy not yet present, waiting ${POLL_INTERVAL}ms before next check...`);
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }
  }

  if (attempts >= MAX_ATTEMPTS) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { 
          message: "Credit Policy did not become available within the expected time",
          details: "Timed out waiting for Credit Policy to become available"
        },
      }),
    );
  }

  // Activate the Credit Policy for the account
  const creditPolicyParams = {
    status: "active",
    credit_limit_amount: "2000",
    credit_limit_currency: "usd",
    credit_period_interval: "day",
    credit_period_interval_count: "1",
    days_until_due: "0"
  };

  // console.log("Activating credit policy with params:", creditPolicyParams);

  const creditPolicyResponse = await fetch("https://api.stripe.com/v1/issuing/credit_policy", {
    method: "POST",
    headers: {
      "Stripe-Account": accountId,
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + getStripeSecretKey(platform),
      "Stripe-Version": "2024-04-10;issuing_credit_beta=v1;issuing_underwritten_credit_beta=v1"
    },
    body: new URLSearchParams(creditPolicyParams),
  });

  // console.log("Credit policy activation response status:", creditPolicyResponse.status);
  let creditPolicyResponseBody;
  try {
    creditPolicyResponseBody = await creditPolicyResponse.json();
    // console.log("Credit policy activation response:", creditPolicyResponseBody);

    // Log the credit policy activation request
    await logApiRequest(
      email,
      "https://api.stripe.com/v1/issuing/credit_policy",
      "POST",
      creditPolicyParams,
      creditPolicyResponseBody
    );
  } catch (error) {
    console.error("Error parsing credit policy response:", error);
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { message: "Failed to parse credit policy response" },
      }),
    );
  }

  if (!creditPolicyResponse.ok) {
    return res.status(400).json(
      apiResponse({
        success: false,
        error: { 
          message: "Failed to activate credit policy",
          details: creditPolicyResponseBody?.error?.message || "Unknown error"
        },
      }),
    );
  }

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
