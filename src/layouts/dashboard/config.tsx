import {
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { SvgIcon } from "@mui/material";

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
    title: "Authorizations",
    path: "/authorizations",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Financial Account",
    path: "/financial_account",
    icon: (
      <SvgIcon fontSize="small">
        <BanknotesIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Test Data",
    path: "/test-data",
    icon: (
      <SvgIcon fontSize="small">
        <WrenchScrewdriverIcon />
      </SvgIcon>
    ),
  },
];
