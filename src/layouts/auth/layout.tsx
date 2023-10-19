import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Card,
  CardContent,
  Fade,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import NextLink from "next/link";
import { ReactNode, useState } from "react";

import { Logo } from "src/components/logo";

const Layout = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      display="flex"
      flex="auto"
      flexDirection="column"
      alignItems="center"
      pt={20}
      sx={{
        backgroundColor: "neutral.50",
      }}
    >
      <TopLogoBar />
      <Box
        display="flex"
        width="100%"
        flexWrap="wrap"
        justifyContent="space-evenly"
        maxWidth={theme.spacing(169)}
      >
        <Box
          width="100%"
          display="flex"
          maxWidth={theme.spacing(65)}
          px={4}
          mb={4}
        >
          <Box flexGrow={1}>
            <WelcomeMessage />
          </Box>
        </Box>
        <Box
          width="100%"
          display="flex"
          maxWidth={theme.spacing(65)}
          px={4}
          mb={4}
        >
          <Box flexGrow={1}>
            <Card>
              <CardContent>{children}</CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
      <CookieBanner />
    </Box>
  );
};

const TopLogoBar = () => (
  <Box
    component="header"
    sx={{
      backgroundColor: "neutral.50",
      left: 0,
      p: 3,
      position: "fixed",
      top: 0,
      width: "100%",
    }}
  >
    <Box
      component={NextLink}
      href="/"
      sx={{
        display: "inline-flex",
        height: 32,
        width: 32,
      }}
    >
      <Logo />
    </Box>
  </Box>
);

const WelcomeMessage = () => (
  <Stack spacing={3}>
    <Typography variant="h4">
      Stripe Issuing and Treasury platform demo
    </Typography>
    <Typography color="neutral.500">
      This web app demonstrates Stripe Issuing and Treasury APIs in an
      end-to-end integration. Create an account with the demo platform to create
      cards, test purchases, and make and receive payments with a financial
      account.
    </Typography>
    <Typography>
      View our{" "}
      <Link
        href="https://stripe.com/docs/baas/start-integration/sample-app"
        target="_blank"
        underline="none"
      >
        docs
      </Link>{" "}
      and{" "}
      <Link
        href="https://github.com/stripe-samples/issuing-treasury"
        target="_blank"
        underline="none"
      >
        source code
      </Link>{" "}
      on GitHub.
    </Typography>
    <Typography>
      <Link href="https://stripe.com/privacy" target="_blank" underline="none">
        Stripe Privacy Policy & Terms apply
      </Link>
    </Typography>
  </Stack>
);

const CookieBanner = () => {
  const [acknowledgedCookieNotice, setAcknowledgedCookieNotice] = useState(
    localStorage.getItem("acknowledgedCookieNotice") === "true" || false,
  );

  const handleAcknowledgingCookieNotice = () => {
    setAcknowledgedCookieNotice(true);
    localStorage.setItem("acknowledgedCookieNotice", "true");
  };

  return (
    <>
      {!acknowledgedCookieNotice && (
        <Fade in={!acknowledgedCookieNotice}>
          <Box
            component="footer"
            sx={{
              backgroundColor: "neutral.100",
              left: 0,
              bottom: 0,
              p: 3,
              position: "fixed",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <Stack spacing={1} direction="row">
              <Box display="flex" alignItems="center" pl={1}>
                <Typography color="neutral.500">
                  This site uses necessary cookies to enable required functions
                  and features, such as login and account management services.
                </Typography>
              </Box>
              <IconButton onClick={handleAcknowledgingCookieNotice}>
                <SvgIcon>
                  <XMarkIcon />
                </SvgIcon>
              </IconButton>
            </Stack>
          </Box>
        </Fade>
      )}
    </>
  );
};

export default Layout;
