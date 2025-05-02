import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  SvgIcon,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "src/layouts/dashboard/account-popover";
import { Logo } from "src/components/logo";
import { items } from "src/layouts/dashboard/config";
import { isDemoMode } from "src/utils/demo-helpers";

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = ({ onNavOpen }: { onNavOpen: () => void }) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const accountPopover = usePopover();
  const { data: session } = useSession();
  const pathname = usePathname();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: isDemoMode() ? "#1B5E20" : "neutral.800",
          position: "sticky",
          top: 0,
          width: "100%",
          zIndex: (theme: Theme) => theme.zIndex.appBar,
        }}
      >
        <Stack spacing={1}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{
              minHeight: TOP_NAV_HEIGHT,
              px: 2,
            }}
          >
            <Stack alignItems="center" direction="row" spacing={2}>
              {!lgUp && (
                <IconButton onClick={onNavOpen} sx={{ color: "white" }}>
                  <SvgIcon fontSize="small">
                    <Bars3Icon />
                  </SvgIcon>
                </IconButton>
              )}
              <Box component="div" height={40} width={40}>
                <Logo />
              </Box>
              <Typography variant="h6" sx={{ color: "white" }}>
                Welcome, {session.businessName} to Llama Llama Credit!
              </Typography>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Button
                component="a"
                endIcon={
                  <SvgIcon fontSize="small">
                    <ArrowTopRightOnSquareIcon />
                  </SvgIcon>
                }
                href="https://github.com/stripe-samples/issuing-treasury/tree/main/consumer-issuing"
                target="_blank"
                variant="contained"
                color="secondary"
                sx={{ color: 'white' }}
              >
                View on GitHub
              </Button>
              <Avatar
                onClick={accountPopover.handleOpen}
                ref={accountPopover.anchorRef}
                sx={{
                  cursor: "pointer",
                  height: 40,
                  width: 40,
                }}
                src="/assets/avatars/avatar-anika-visser.png"
              />
            </Stack>
          </Stack>
          <Box sx={{ borderTop: 1, borderColor: "neutral.700", px: 2, py: 1 }}>
            <Stack direction="row" spacing={1}>
              {items.map((item) => {
                const active = item.path ? pathname === item.path : false;
                return (
                  <Button
                    key={item.title}
                    component={NextLink}
                    href={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: active ? "common.white" : "neutral.400",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};
