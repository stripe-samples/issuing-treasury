import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@mui/material";
import { signOut } from "next-auth/react";
import { useCallback } from "react";

import { useAuthContext } from "src/contexts/auth-context";
import { useAuth } from "src/hooks/use-auth";

export const AccountPopover = ({
  anchorEl,
  onClose,
  open,
}: {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}) => {
  const auth = useAuth();
  const { user } = useAuthContext();

  const handleLogout = useCallback(() => {
    onClose?.();
    signOut();
  }, [onClose, auth]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.name}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </MenuList>
    </Popover>
  );
};
