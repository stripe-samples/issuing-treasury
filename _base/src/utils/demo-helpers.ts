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

const localizedFakerMap: Record<SupportedCountry, unknown> = {
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

type FakeAddress = {
  address1: string;
  city: string;
  state: string;
  zipCode: string;
};

export const getFakeAddressByCountry = (
  country: SupportedCountry,
): FakeAddress => {
  const faker = localizedFakerMap[country] as Faker;

  switch (country) {
    // @if financialProduct==expense-management
    case SupportedCountry.UK:
      return {
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.county(),
        zipCode: faker.location.zipCode(),
      };
    // @endif
    // @if financialProduct==embedded-finance
    case SupportedCountry.US:
      return {
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode("#####"),
      };
    // @endif
    default:
      throw new Error(
        `Fake address generation not implemented for country: ${country}`,
      );
  }
};
