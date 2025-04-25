import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  DialogTitle,
  Drawer,
  IconButton,
  SvgIcon,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { ReactNode, useState } from "react";

interface FloatingPaymentPanelProps {
  title: string;
  children: ReactNode;
  buttonText: string;
  buttonProps?: {
    variant?: "text" | "outlined" | "contained";
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    size?: "small" | "medium" | "large";
  };
}

const FloatingPaymentPanel = ({
  title,
  children,
  buttonText,
  buttonProps = {},
}: FloatingPaymentPanelProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => setOpen(true)}
      >
        {buttonText}
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
    </>
  );
};

export default FloatingPaymentPanel; 