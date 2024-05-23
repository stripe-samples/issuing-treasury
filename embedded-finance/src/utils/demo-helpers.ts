import { Faker, fakerEN_US } from "@faker-js/faker";

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
  [SupportedCountry.US]: fakerEN_US,
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
    case SupportedCountry.US:
      return {
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode("#####"),
      };
    default:
      throw new Error(
        `Fake address generation not implemented for country: ${country}`,
      );
  }
};
