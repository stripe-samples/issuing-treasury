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

import FinancialProduct from "src/types/financial-product";

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
  // @if financialProduct==embedded-finance
  {
    title: "Financial account",
    path: "/financial-account",
    icon: (
      <SvgIcon fontSize="small">
        <BanknotesIcon />
      </SvgIcon>
    ),
    // @begin-exclude-from-subapps
    // Embedded Finance platforms use Treasury Financial Accounts[0]
    // to store money and fund payments on Issuing cards
    //
    // [0] https://stripe.com/docs/treasury/account-management/financial-accounts
    financialProducts: [FinancialProduct.EmbeddedFinance],
    // @end-exclude-from-subapps
  },
  // @endif
  // @if financialProduct==expense-management
  {
    title: "Top ups",
    path: "/top-ups",
    icon: (
      <SvgIcon fontSize="small">
        <BanknotesIcon />
      </SvgIcon>
    ),
    // @begin-exclude-from-subapps
    // Expense Management platforms do not use Treasury, and instead
    // fund payments on Issuing cards from Balances. These balances
    // can be topped up[0] via bank transfers
    //
    // [0] https://stripe.com/docs/issuing/adding-funds-to-your-card-program
    financialProducts: [FinancialProduct.ExpenseManagement],
    // @end-exclude-from-subapps
  },
  // @endif
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
