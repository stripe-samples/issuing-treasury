import {
  Faker,
  // @if financialProduct==expense-management
  faker,
  fakerDE_AT,
  fakerFR_BE,
  fakerEL,
  fakerDE,
  fakerES,
  fakerFI,
  fakerFR,
  fakerHR,
  fakerEN_IE,
  fakerIT,
  fakerLV,
  fakerNL,
  fakerPT_PT,
  fakerSK,
  fakerEN_GB,
  // @endif
  // @if financialProduct==embedded-finance
  fakerEN_US,
  // @endif
} from "@faker-js/faker";

import { SupportedCountry } from "./account-management-helpers";

// This helper function is used to determine if the app is running in demo mode which we deploy at baas.stripe.dev
// To make it easier for you transition to a real production app, we've made it so that you can delete this code, all
// references to it, and logic guarded by it and the app will still work. The only thing that will change is that your
// app will start to behave like a real production app. For example, the Stripe Connect Onboarding forms will require
// filling out by your users.
export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
};

export const TOS_ACCEPTANCE = { date: 1691518261, ip: "127.0.0.1" };

export const LocalizedFakerMap: Record<SupportedCountry, unknown> = {
  // @if financialProduct==expense-management
  [SupportedCountry.AT]: fakerDE_AT,
  [SupportedCountry.BE]: fakerFR_BE,
  [SupportedCountry.CY]: fakerEL,
  [SupportedCountry.DE]: fakerDE,
  [SupportedCountry.EE]: faker,
  [SupportedCountry.ES]: fakerES,
  [SupportedCountry.FI]: fakerFI,
  [SupportedCountry.FR]: fakerFR,
  [SupportedCountry.GR]: fakerEL,
  [SupportedCountry.HR]: fakerHR,
  [SupportedCountry.IE]: fakerEN_IE,
  [SupportedCountry.IT]: fakerIT,
  [SupportedCountry.LT]: faker,
  [SupportedCountry.LU]: faker,
  [SupportedCountry.LV]: fakerLV,
  [SupportedCountry.MT]: faker,
  [SupportedCountry.NL]: fakerNL,
  [SupportedCountry.PT]: fakerPT_PT,
  [SupportedCountry.SI]: faker,
  [SupportedCountry.SK]: fakerSK,
  [SupportedCountry.UK]: fakerEN_GB,
  // @endif
  // @if financialProduct==embedded-finance
  [SupportedCountry.US]: fakerEN_US,
  // @endif
};

// These are a hardcoded list of company tax ID numbers for each country that Stripe will accept as a valid test number
// Stripe docs for test company tax ID numbers: https://stripe.com/docs/connect/testing#test-business-tax-ids
export const getStaticFakeCompanyTaxIdNumberByCountry = (
  country: SupportedCountry,
): string => {
  switch (country) {
    // @if financialProduct==expense-management
    case SupportedCountry.AT:
    case SupportedCountry.BE:
    case SupportedCountry.CY:
    case SupportedCountry.EE:
    case SupportedCountry.ES:
    case SupportedCountry.FI:
    case SupportedCountry.FR:
    case SupportedCountry.GR:
    case SupportedCountry.HR:
    case SupportedCountry.IE:
    case SupportedCountry.IT:
    case SupportedCountry.LT:
    case SupportedCountry.LU:
    case SupportedCountry.LV:
    case SupportedCountry.MT:
    case SupportedCountry.NL:
    case SupportedCountry.PT:
    case SupportedCountry.SI:
    case SupportedCountry.SK:
    case SupportedCountry.UK:
      return "000000000"; // All other EEA countries besides Germany
    case SupportedCountry.DE:
      return "HRA000000000"; // Germany
    // @endif
    // @if financialProduct==embedded-finance
    case SupportedCountry.US:
      return "000000000"; // United States
    // @endif
    default:
      throw new Error(
        `Fake phone number generation not implemented for country: ${country}`,
      );
  }
};

// These are a hardcoded list of fake phone numbers for each country that Stripe will accept as a valid test number
// Stripe docs for test phone numbers: https://docs.stripe.com/connect/testing#using-oauth
export const getStaticFakePhoneByCountry = (
  country: SupportedCountry,
): string => {
  const faker = LocalizedFakerMap[country] as Faker;

  switch (country) {
    // @if financialProduct==expense-management
    case SupportedCountry.AT:
      return faker.phone.number("+43(#)000 0000"); // Austria
    case SupportedCountry.BE:
      return faker.phone.number("+32(0)00 00 00 00"); // Belgium
    case SupportedCountry.CY:
      return faker.phone.number("+357(9)0 000 000"); // Cyprus
    case SupportedCountry.DE:
      return faker.phone.number("+49(0)0000 00000"); // Germany
    case SupportedCountry.EE:
      return faker.phone.number("+372 000 0000"); // Estonia
    case SupportedCountry.ES:
      return faker.phone.number("+34(91)000 0000"); // Spain
    case SupportedCountry.FI:
      return faker.phone.number("+358(0)00 000 0000"); // Finland
    case SupportedCountry.FR:
      return faker.phone.number("+33(0)00 00 00 00"); // France
    case SupportedCountry.GR:
      return faker.phone.number("+30(0)000 0000 000"); // Greece
    case SupportedCountry.HR:
      return faker.phone.number("+385 43 000 000"); // Croatia
    case SupportedCountry.IE:
      return faker.phone.number("+353(0)00 000 0000"); // Ireland
    case SupportedCountry.IT:
      return faker.phone.number("+39(000) 000 0000"); // Italy
    case SupportedCountry.LT:
      return faker.phone.number("+370(0)00 000000"); // Lithuania
    case SupportedCountry.LU:
      return faker.phone.number("+352 000 000"); // Luxeumburg
    case SupportedCountry.LV:
      return faker.phone.number("+371(2) 000 0000"); // Latvia
    case SupportedCountry.MT:
      return faker.phone.number("+356 0000 0000"); // Malta
    case SupportedCountry.NL:
      return faker.phone.number("+31 (06) 0000 0000"); // Netherland
    case SupportedCountry.PT:
      return faker.phone.number("+351 200 000 000"); // Portugal
    case SupportedCountry.SI:
      return faker.phone.number("+386(0)000 00 00"); // Slovenia
    case SupportedCountry.SK:
      return faker.phone.number("+386(0)000 00 00"); // Slovakia
    case SupportedCountry.UK:
      return faker.phone.number("07000000000"); // United Kingdom
    // @endif
    // @if financialProduct==embedded-finance
    case SupportedCountry.US:
      return faker.phone.number("000-000-0000"); // United States
    // @endif
    default:
      throw new Error(
        `Fake phone number generation not implemented for country: ${country}`,
      );
  }
};

export const getFakePhoneByCountry = (country: SupportedCountry): string => {
  const faker = LocalizedFakerMap[country] as Faker;

  switch (country) {
    // @if financialProduct==expense-management
    case SupportedCountry.AT:
      return faker.phone.number("+43(#)### ####"); // Austria
    case SupportedCountry.BE:
      return faker.phone.number("+32(#)## ## ## ##"); // Belgium
    case SupportedCountry.CY:
      return faker.phone.number("+357(9)# ### ###"); // Cyprus
    case SupportedCountry.DE:
      return faker.phone.number("+49(#)#### #####"); // Germany
    case SupportedCountry.EE:
      return faker.phone.number("+372 ### ####"); // Estonia
    case SupportedCountry.ES:
      return faker.phone.number("+34(91)### ####"); // Spain
    case SupportedCountry.FI:
      return faker.phone.number("+358(#)## ### ####"); // Finland
    case SupportedCountry.FR:
      return faker.phone.number("+33(#)## ## ## ##"); // France
    case SupportedCountry.GR:
      return faker.phone.number("+30(#)### #### ###"); // Greece
    case SupportedCountry.HR:
      return faker.phone.number("+385 43 ### ###"); // Croatia
    case SupportedCountry.IE:
      return faker.phone.number("+353(#)## ### ####"); // Ireland
    case SupportedCountry.IT:
      return faker.phone.number("+39(###) ### ####"); // Italy
    case SupportedCountry.LT:
      return faker.phone.number("+370(#)## ######"); // Lithuania
    case SupportedCountry.LU:
      return faker.phone.number("+352 ### ###"); // Luxeumburg
    case SupportedCountry.LV:
      return faker.phone.number("+371(2) ### ####"); // Latvia
    case SupportedCountry.MT:
      return faker.phone.number("+356 #### ####"); // Malta
    case SupportedCountry.NL:
      return faker.phone.number("+31 (06) #### ####"); // Netherland
    case SupportedCountry.PT:
      return faker.phone.number("+351 2## ### ###"); // Portugal
    case SupportedCountry.SI:
      return faker.phone.number("+386(#)### ## ##"); // Slovenia
    case SupportedCountry.SK:
      return faker.phone.number("+386(#)### ## ##"); // Slovakia
    case SupportedCountry.UK:
      return faker.phone.number("07#########"); // United Kingdom
    // @endif
    // @if financialProduct==embedded-finance
    case SupportedCountry.US:
      return faker.phone.number("###-###-####"); // United States
    // @endif
    default:
      throw new Error(
        `Fake phone number generation not implemented for country: ${country}`,
      );
  }
};

type FakeAddress = {
  address1: string;
  city: string;
  state: string;
  postalCode: string;
};

// These are a hardcoded list of addresses in each supported country so that we can test them each out for the demo
// Stripe docs for test addresses: https://stripe.com/docs/connect/testing#test-verification-addresses
export const getStaticFakeAddressByCountry = (
  country: SupportedCountry,
): FakeAddress => {
  switch (country) {
    // @if financialProduct==expense-management
    case SupportedCountry.AT:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.BE:
      return {
        address1: "address_full_match",
        city: "Brussel",
        postal_code: "1000",
      };
    case SupportedCountry.CY:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.DE:
      return {
        address1: "address_full_match",
        city: "Berlin",
        postal_code: "10115",
      };
    case SupportedCountry.EE:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.ES:
      return {
        address1: "address_full_match",
        city: "Madrid",
        postal_code: "28001",
      };
    case SupportedCountry.FI:
      return {
        address1: "address_full_match",
        city: "Helsinki",
        postal_code: "00100",
      };
    case SupportedCountry.FR:
      return {
        address1: "address_full_match",
        city: "Paris",
        postal_code: "75001",
      };
    case SupportedCountry.GR:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.HR:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.IE:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.IT:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.LT:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.LU:
      return {
        address1: "address_full_match",
        city: "Luxemburg",
        postal_code: "1111",
      };
    case SupportedCountry.LV:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.MT:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.NL:
      return {
        address1: "address_full_match",
        city: "Amsterdam",
        postal_code: "1008 DG",
      };
    case SupportedCountry.PT:
      return {
        address1: "address_full_match",
        city: "Lisbon",
        postal_code: "1000",
      };
    case SupportedCountry.SI:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.SK:
      return {
        address1: "address_full_match",
        city: "NOT AVAILABLE",
        postal_code: "NOT AVAILABLE",
      };
    case SupportedCountry.UK:
      return {
        address1: "address_full_match",
        city: "London",
        postal_code: "WC32 4AP",
      };
    // @endif
    // @if financialProduct==embedded-finance
    case SupportedCountry.US:
      return {
        address1: "address_full_match",
        city: "South San Francisco",
        state: "CA",
        postal_code: "94080",
      };
    // @endif
    default:
      throw new Error(
        `Fake address generation not implemented for country: ${country}`,
      );
  }
};

export const getFakeAddressByCountry = (
  country: SupportedCountry,
): FakeAddress => {
  const faker = LocalizedFakerMap[country] as Faker;

  switch (country) {
    // @if financialProduct==expense-management
    case SupportedCountry.AT:
    case SupportedCountry.BE:
    case SupportedCountry.CY:
    case SupportedCountry.DE:
    case SupportedCountry.EE:
    case SupportedCountry.ES:
    case SupportedCountry.FI:
    case SupportedCountry.FR:
    case SupportedCountry.GR:
    case SupportedCountry.HR:
    case SupportedCountry.IE:
    case SupportedCountry.IT:
    case SupportedCountry.LT:
    case SupportedCountry.LU:
    case SupportedCountry.LV:
    case SupportedCountry.MT:
    case SupportedCountry.NL:
    case SupportedCountry.PT:
    case SupportedCountry.SI:
    case SupportedCountry.SK:
    case SupportedCountry.UK:
      return {
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.county(),
        postalCode: faker.location.zipCode(),
      };
    // @endif
    // @if financialProduct==embedded-finance
    case SupportedCountry.US:
      return {
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode("#####"),
      };
    // @endif
    default:
      throw new Error(
        `Fake address generation not implemented for country: ${country}`,
      );
  }
};
