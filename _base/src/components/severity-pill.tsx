import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";

import { SeverityColor } from "src/types/severity-color";

export const SeverityPill = ({
  color = "primary",
  children,
  ...other
}: {
  color?: SeverityColor;
  children: React.ReactNode;
}) => {
  const theme = useTheme();

  const colorValue =
    theme.palette.mode === "dark"
      ? theme.palette[color].main
      : theme.palette[color].dark;

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: theme.palette[color].alpha12,
        borderRadius: 12,
        color: colorValue,
        cursor: "default",
        display: "inline-flex",
        flexGrow: 0,
        flexShrink: 0,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(12),
        lineHeight: 2,
        fontWeight: 600,
        justifyContent: "center",
        letterSpacing: 0.5,
        minWidth: 20,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
      {...other}
    >
      {children}
    </Box>
  );
};
