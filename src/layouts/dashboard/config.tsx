import {
  CreditCardIcon,
  BanknotesIcon,
  CogIcon,
  ChartBarIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import {SvgIcon} from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/dashboard',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Cardholders',
    path: '/cardholders',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Cards',
    path: '/cards',
    icon: (
      <SvgIcon fontSize="small">
        <CreditCardIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Financial Account',
    path: '/financial_account',
    icon: (
      <SvgIcon fontSize="small">
        <BanknotesIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
];
