import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  DialogTitle,
  Drawer,
  IconButton,
  SvgIcon,
} from "@mui/material";
import Box from "@mui/material/Box";
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
        Generate test data
      </Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml={1}
          mt={1}
        >
          {title}
          <IconButton onClick={() => setOpen(false)}>
            <SvgIcon>
              <XMarkIcon />
            </SvgIcon>
          </IconButton>
        </DialogTitle>
        <Box maxWidth={400} px={4}>
          {children}
        </Box>
      </Drawer>
    </Box>
  );
};

export default FloatingTestPanel;
