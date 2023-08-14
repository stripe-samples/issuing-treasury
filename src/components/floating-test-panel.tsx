import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { Button, Drawer, Stack, SvgIcon } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/system/useTheme";
import React, { ReactNode } from "react";

const FloatingTestPanel = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: {
          xs: theme.spacing(2),
          sm: theme.spacing(6),
        },
        right: {
          xs: theme.spacing(2),
          sm: theme.spacing(6),
        },
      }}
    >
      <Button
        variant="contained"
        startIcon={
          <SvgIcon fontSize="small">
            <PlusCircleIcon />
          </SvgIcon>
        }
        onClick={() => setOpen(true)}
      >
        Generate Test Data
      </Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Stack spacing={3} maxWidth={400} p={3}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {children}
        </Stack>
      </Drawer>
    </Box>
  );
};

export default FloatingTestPanel;
