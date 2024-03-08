import { Box, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { SideNav } from "src/layouts/dashboard/side-nav";
import { TopNav } from "src/layouts/dashboard/top-nav";
import FinancialProduct from "src/types/financial_product";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);

  // @begin-exclude-from-subapps
  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { financialProduct } = session;
  // @end-exclude-from-subapps

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname],
  );

  return (
    <>
      <Head>
        <title>BaaS Platform Demo</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>
          {children}
          <Box px={3} py={5} sx={{ backgroundColor: "neutral.50" }}>
            <Box mx="auto" maxWidth={800} textAlign="center">
              {/* @begin-exclude-from-subapps */}
              {financialProduct === FinancialProduct.EmbeddedFinance && (
                // @end-exclude-from-subapps
                // @if financialProduct==embedded-finance
                <Typography variant="body2" color="neutral.400">
                  Stripe Issuing and Treasury Platform Demo partners with Stripe
                  Payments Company for money transmission services and account
                  services with funds held at Example Bank, Member FDIC. Stripe
                  Issuing and Treasury Platform Demo Visa® Commercial Credit
                  cards are issued by Example Bank.{" "}
                  <Link
                    href="https://stripe.com/privacy"
                    target="_blank"
                    underline="none"
                  >
                    Stripe Privacy Policy & Terms apply
                  </Link>
                </Typography>
                // @endif
                // @begin-exclude-from-subapps
              )}
              {/* @end-exclude-from-subapps */}
              {/* @begin-exclude-from-subapps */}
              {financialProduct === FinancialProduct.ExpenseManagement && (
                // @end-exclude-from-subapps
                // @if financialProduct==expense-management
                <Typography variant="body2" color="neutral.400">
                  Stripe Issuing Platform Demo partners with Stripe Payments
                  Company for money transmission services and account services.
                  Stripe Issuing Platform Demo Visa® Commercial Credit cards
                  are issued by Example Bank.{" "}
                  <Link
                    href="https://stripe.com/privacy"
                    target="_blank"
                    underline="none"
                  >
                    Stripe Privacy Policy & Terms apply
                  </Link>
                </Typography>
                // @endif
                // @begin-exclude-from-subapps
              )}
              {/* @end-exclude-from-subapps */}
            </Box>
          </Box>
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};

export default Layout;
