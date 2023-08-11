import { ClipboardIcon } from "@heroicons/react/20/solid";
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  SvgIcon,
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
      PaperProps={{ sx: { minWidth: 200 } }}
    >
      <Box
        sx={{
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="overline">Business Name</Typography>
        <Typography color="text.secondary" variant="body2">
          {session?.businessName}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2" noWrap>
          {session?.email}
          <IconButton
            onClick={() => navigator.clipboard.writeText(session?.email || "")}
            sx={{ p: 0, ml: 1.5 }}
          >
            <SvgIcon sx={{ width: "20px", height: "20px" }}>
              <ClipboardIcon />
            </SvgIcon>
          </IconButton>
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
