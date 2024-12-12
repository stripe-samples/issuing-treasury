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

type FakeAddress = {
  address1: string;
  city: string;
  state: string;
  postalCode: string;
};

export const getFakePhoneByCountry = (country: SupportedCountry): string => {
  const faker = LocalizedFakerMap[country] as Faker;

  switch (country) {
    // @if financialProduct==expense-management
    case SupportedCountry.AT:
      return faker.phone.number("+43(#)### ####"); //Austria
    case SupportedCountry.BE:
      return faker.phone.number("+32(#)## ## ## ##"); //Belgium
    case SupportedCountry.CY:
      return faker.phone.number("+357(9)# ### ###"); //Cyprus
    case SupportedCountry.DE:
      return faker.phone.number("+49(#)#### #####"); //Germany
    case SupportedCountry.EE:
      return faker.phone.number("+372 ### ####"); //Estonia
    case SupportedCountry.ES:
      return faker.phone.number("+34(91)### ####"); //Spain
    case SupportedCountry.FI:
      return faker.phone.number("+358(#)## ### ####"); //Finland
    case SupportedCountry.FR:
      return faker.phone.number("+33(#)## ## ## ##"); //France
    case SupportedCountry.GR:
      return faker.phone.number("+30(#)### #### ###"); //Greece
    case SupportedCountry.HR:
      return faker.phone.number("+385 43 ### ###"); //Croatia
    case SupportedCountry.IE:
      return faker.phone.number("+353(#)## ### ####"); //Ireland
    case SupportedCountry.IT:
      return faker.phone.number("+39(###) ### ####"); //Italy
    case SupportedCountry.LT:
      return faker.phone.number("+370(#)## ######"); //Lithuania
    case SupportedCountry.LU:
      return faker.phone.number("+352 ### ###"); //Luxeumburg
    case SupportedCountry.LV:
      return faker.phone.number("+371(2) ### ####"); //Latvia
    case SupportedCountry.MT:
      return faker.phone.number("+356 #### ####"); //Malta
    case SupportedCountry.NL:
      return faker.phone.number("+31 (06) #### ####"); //Netherland
    case SupportedCountry.PT:
      return faker.phone.number("+351 2## ### ###"); //Portugal
    case SupportedCountry.SI:
      return faker.phone.number("+386(#)### ## ##"); //Slovenia
    case SupportedCountry.SK:
      return faker.phone.number("+386(#)### ## ##"); //Slovakia
    case SupportedCountry.UK:
      return faker.phone.number("07#########"); // UK phone number format
    // @endif
    // @if financialProduct==embedded-finance
    case SupportedCountry.US:
      return faker.phone.number("###-###-####"); // US phone number format
    // @endif
    default:
      throw new Error(
        `Fake phone number generation not implemented for country: ${country}`,
      );
  }
};

const euCountriesList = [
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
];

export const getFakeAddressByCountry = (
  country: SupportedCountry,
): FakeAddress => {
  const faker = LocalizedFakerMap[country] as Faker;

  let region = "US";
  if (euCountriesList.includes(country)) {
    region = "EU";
  } else if (country === "GB") {
    region = "UK";
  }

  switch (region) {
    // @if financialProduct==expense-management
    case "EU":
      return {
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.county(),
        postalCode: faker.location.zipCode(),
      };
    case "UK": //SupportedCountry.UK:
      return {
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.county(),
        postalCode: faker.location.zipCode(),
      };
    // @endif
    // @if financialProduct==embedded-finance
    case "US": //SupportedCountry.US:
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
