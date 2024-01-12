import {
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  CogIcon,
} from "@heroicons/react/24/solid";
import { SvgIcon } from "@mui/material";

import UseCase from "src/types/use_cases";

export const items = [
  {
    title: "Overview",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Cardholders",
    path: "/cardholders",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Cards",
    path: "/cards",
    icon: (
      <SvgIcon fontSize="small">
        <CreditCardIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Card authorizations",
    path: "/authorizations",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Financial account",
    path: "/financial_account",
    icon: (
      <SvgIcon fontSize="small">
        <BanknotesIcon />
      </SvgIcon>
    ),
    // Embedded Finance platforms use Treasury Financial Accounts[0]
    // to store money and fund payments on Issuing cards
    //
    // [0] https://stripe.com/docs/treasury/account-management/financial-accounts
    use_cases: [UseCase.EmbeddedFinance],
  },
  {
    title: "Top ups",
    path: "/top-ups",
    icon: (
      <SvgIcon fontSize="small">
        <BanknotesIcon />
      </SvgIcon>
    ),
    // Expense Management platforms do not use Treasury, and instead
    // fund payments on Issuing cards from Balances. These balances
    // can be topped up[0] via bank transfers
    //
    // [0] https://stripe.com/docs/issuing/adding-funds-to-your-card-program
    use_cases: [UseCase.ExpenseManagement],
  },
  {
    title: "Test data",
    path: "/test-data",
    icon: (
      <SvgIcon fontSize="small">
        <WrenchScrewdriverIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Settings",
    path: "/settings",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
];
