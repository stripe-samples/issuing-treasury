import { Color } from "@mui/material";
import * as React from "react";

declare module "@mui/material/Alert" {
  export interface AlertPropsColorOverrides {
    primary: true;
  }

  export interface AlertPropsVariantOverrides {
    standard: true;
  }

  export interface AlertPropsColor {
    primary?: true;
  }

  export interface AlertPropsVariant {
    standard?: true;
  }

  export interface AlertProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "variant"> {
    color?: Color | keyof AlertPropsColorOverrides;
    variant?: keyof AlertPropsVariantOverrides;
  }
}

declare module "@mui/material/styles" {
  export interface PaletteColor {
    lightest: string;
    light: string;
    main: string;
    dark: string;
    darkest: string;
    contrastText: string;
    alpha4: string;
    alpha8: string;
    alpha12: string;
    alpha30: string;
    alpha50: string;
  }
}
