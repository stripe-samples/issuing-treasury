import { Box, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { TopNav } from "src/layouts/dashboard/top-nav";
import { GoogleMapsProvider } from "src/components/google-maps-provider";

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
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
  const { data: session } = useSession();
  const router = useRouter();

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

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <>
      <Head>
        <title>Stripe BaaS platform demo</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <GoogleMapsProvider>
        <TopNav onNavOpen={() => setOpenNav(true)} />
        <LayoutRoot>
          <LayoutContainer>{children}</LayoutContainer>
        </LayoutRoot>
      </GoogleMapsProvider>
    </>
  );
};

export default Layout;
