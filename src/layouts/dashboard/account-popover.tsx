import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";

export const AccountPopover = ({
  anchorEl,
  onClose,
  open,
}: {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}) => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    onClose?.();
    await signOut();
  };

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
          {session?.businessName}
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
