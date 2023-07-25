import { styled } from "@mui/material/styles";

const SeverityPillRoot = styled("span", {
  shouldForwardProp: (prop) => prop !== "ownerState",
})<{
  ownerState: {
    color: "primary" | "secondary" | "error" | "info" | "warning" | "success";
  };
}>(({ theme, ownerState }) => {
  const backgroundColor = theme.palette[ownerState.color].light;
  const color =
    theme.palette.mode === "dark"
      ? theme.palette[ownerState.color].main
      : theme.palette[ownerState.color].dark;

  return {
    alignItems: "center",
    backgroundColor,
    borderRadius: 12,
    color,
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
  };
});

export const SeverityPill = (props: {
  color?: "primary" | "secondary" | "error" | "info" | "warning" | "success";
  children: React.ReactNode;
}) => {
  const { color = "primary", children, ...other } = props;

  const ownerState = { color };

  return (
    <SeverityPillRoot ownerState={ownerState} {...other}>
      {children}
    </SeverityPillRoot>
  );
};
