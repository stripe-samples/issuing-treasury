import * as Yup from "yup";

import UseCase from "src/types/use_cases";

const cardholderBase = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  address1: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State / Province is required"),
  postalCode: Yup.string().required("ZIP / Postal code is required"),
  country: Yup.string().required("Country is required"),
  accept: Yup.boolean()
    .required("The terms of service and privacy policy must be accepted.")
    .oneOf([true], "The terms of service and privacy policy must be accepted."),
});

const cardholderWithSCA = cardholderBase.concat(
  Yup.object({
    phoneNumber: Yup.string().required("Phone number is required for SCA"),
  }),
);

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

const user = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string()
    .max(255)
    .required("Password is required")
    // check minimum characters
    .min(8, "Password must have at least 8 characters")
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  country: Yup.string().max(2).required("Country is required"),
  useCase: Yup.string().when("country", {
    is: "US",
    then: (schema) =>
      schema.oneOf(
        [UseCase.EmbeddedFinance],
        "This use case is not yet supported in the selected country",
      ),
    otherwise: (schema) =>
      schema.oneOf(
        [UseCase.ExpenseManagement],
        "This use case is not yet supported in the selected country",
      ),
  }),
});

const businessBase = Yup.object().shape({
  businessName: Yup.string().max(255).required("Business name is required"),
});

const businessWithOnboardingSkip = businessBase.concat(
  Yup.object().shape({
    skipOnboarding: Yup.boolean().required("Skip onboarding choice required"),
  }),
);

const card = Yup.object().shape({
  line1: Yup.string().required("Cardholder billing address is required"),
  city: Yup.string().required("Cardholder billing address city is required"),
  state: Yup.string().required("Cardholder billing address state is required"),
  postal_code: Yup.string().required(
    "Cardholder billing address postal code is required",
  ),
  country: Yup.string().required(
    "Cardholder billing address country is required",
  ),
});

const schemas = {
  business: {
    default: businessBase,
    withOnbardingSkip: businessWithOnboardingSkip,
  },
  card,
  cardholder: {
    default: cardholderBase,
    withSCA: cardholderWithSCA,
  },
  user,
};

export default schemas;
