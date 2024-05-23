import {
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  CurrencyPoundIcon,
} from "@heroicons/react/24/solid";
import { SvgIcon } from "@mui/material";

import { Currency } from "src/utils/account-management-helpers";

const currencyIconMap: Record<Currency, React.ReactNode> = {
  [Currency.USD]: <CurrencyDollarIcon />,
  [Currency.GBP]: <CurrencyPoundIcon />,
  [Currency.EUR]: <CurrencyEuroIcon />,
};

const CurrencyIcon = (props: { currency: Currency }) => {
  const { currency } = props;

  const icon = currencyIconMap[currency];

  return <SvgIcon>{icon}</SvgIcon>;
};

export default CurrencyIcon;
