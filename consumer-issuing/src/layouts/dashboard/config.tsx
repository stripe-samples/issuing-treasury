import {
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  CogIcon,
  CommandLineIcon,
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
    title: "Card transactions",
    path: "/authorizations",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  // {
  //   title: "API Requests",
  //   path: "/api-requests",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CommandLineIcon />
  //     </SvgIcon>
  //   ),
  // },
  // {
  //   title: "Test data",
  //   path: "/test-data",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <WrenchScrewdriverIcon />
  //     </SvgIcon>
  //   ),
  // },
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
