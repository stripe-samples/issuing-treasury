import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Link,
  Popover,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import { isDemoMode } from "src/utils/demo-helpers";

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
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const router = useRouter();

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
          {session.businessName}
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
          {session.email}
        </Typography>
        {(!isDemoMode() || router.query.debug) && (
          <Typography color="text.secondary" variant="body2" mt={1}>
            <Link
              href={`https://dashboard.stripe.com/${session.accountId}/test/issuing/overview`}
              target="_blank"
              underline="none"
            >
              {session.accountId}{" "}
              <SvgIcon fontSize="small" sx={{ verticalAlign: "top" }}>
                <ArrowTopRightOnSquareIcon />
              </SvgIcon>
            </Link>
          </Typography>
        )}
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
