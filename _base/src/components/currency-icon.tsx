import {
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  CurrencyPoundIcon,
} from "@heroicons/react/24/solid";
import { SvgIcon } from "@mui/material";

const CurrencyIcon = (props: { currency: string }) => {
  const { currency } = props;
  let icon;

  if (currency == "usd") {
    icon = <CurrencyDollarIcon />;
  } else if (currency == "gbp") {
    icon = <CurrencyPoundIcon />;
  } else if (currency == "eur") {
    icon = <CurrencyEuroIcon />;
  }

  return <SvgIcon>{icon}</SvgIcon>;
};

export default CurrencyIcon;
