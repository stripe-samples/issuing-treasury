import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { items } from "src/layouts/dashboard/config";
import { SideNavItem } from "src/layouts/dashboard/side-nav-item";
// @begin-exclude-from-subapps
import FinancialProduct from "src/types/financial-product";

const validNavigationItem = (
  item: {
    title: string;
    path: string;
    icon: React.ReactNode;
    financialProducts?: FinancialProduct[];
  },
  financialProduct: FinancialProduct,
) => {
  if (item.financialProducts) {
    if (!item.financialProducts.includes(financialProduct)) {
      return false;
    }
  }

  return true;
};
// @end-exclude-from-subapps

export const SideNav = (props: { onClose: () => void; open: boolean }) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }

  // @begin-exclude-from-subapps
  const { financialProduct } = session;
  // @end-exclude-from-subapps

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ p: 3 }} spacing={3}>
          <Box component={NextLink} href="/" height={40} width={40}>
            <Logo />
          </Box>
          <Box width="100%">
            <Typography color="inherit" variant="subtitle1">
              {session.businessName}
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              // @begin-exclude-from-subapps
              if (validNavigationItem(item, financialProduct)) {
                // @end-exclude-from-subapps
                const active = item.path ? pathname === item.path : false;

                return (
                  <SideNavItem
                    active={active}
                    icon={item.icon}
                    key={item.title}
                    path={item.path}
                    title={item.title}
                  />
                );
                // @begin-exclude-from-subapps
              }
              // @end-exclude-from-subapps
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        {/* FOR-DEMO-ONLY: You can remove this for an actual application */}
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
          textAlign="center"
        >
          <Typography color="neutral.100" variant="subtitle2">
            Stripe BaaS platform demo
          </Typography>
          <Typography color="neutral.600" variant="subtitle2">
            Data, financial activity and cards are fictitious and for testing
            purposes only. You should not input personal information.
          </Typography>
          {/* @begin-exclude-from-subapps */}
          {financialProduct === FinancialProduct.EmbeddedFinance && (
            // @end-exclude-from-subapps
            // @if financialProduct==embedded-finance
            <Button
              component="a"
              endIcon={
                <SvgIcon fontSize="small">
                  <ArrowTopRightOnSquareIcon />
                </SvgIcon>
              }
              fullWidth
              href="https://github.com/stripe-samples/issuing-treasury/tree/main/embedded-finance"
              sx={{ mt: 2 }}
              target="_blank"
              variant="contained"
              color="secondary"
            >
              View on GitHub
            </Button>
            // @endif
            // @begin-exclude-from-subapps
          )}
          {/* @end-exclude-from-subapps */}
          {/* @begin-exclude-from-subapps */}
          {financialProduct === FinancialProduct.ExpenseManagement && (
            // @end-exclude-from-subapps
            // @if financialProduct==expense-management
            <Button
              component="a"
              endIcon={
                <SvgIcon fontSize="small">
                  <ArrowTopRightOnSquareIcon />
                </SvgIcon>
              }
              fullWidth
              href="https://github.com/stripe-samples/issuing-treasury/tree/main/expense-management"
              sx={{ mt: 2 }}
              target="_blank"
              variant="contained"
              color="secondary"
            >
              View on GitHub
            </Button>
            // @endif
            // @begin-exclude-from-subapps
          )}
          {/* @end-exclude-from-subapps */}
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};
