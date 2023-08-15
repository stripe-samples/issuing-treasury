import {
  Box,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import NextLink from "next/link";
import { ReactNode } from "react";

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
      Welcome to Stripe Issuing & Treasury Platform Demo
    </Typography>
    <Typography color="neutral.500">
      Experience the power of Stripe&apos;s Issuing and Treasury APIs with our
      interactive demo app. Discover how easy it is to create virtual cards,
      manage funds, and streamline financial operations.
    </Typography>
    <Typography>
      Visit our{" "}
      <Link
        href="https://stripe.com/docs/financial-services"
        target="_blank"
        underline="none"
      >
        docs
      </Link>{" "}
      and view{" "}
      <Link
        href="https://github.com/stripe-samples/issuing-treasury"
        target="_blank"
        underline="none"
      >
        source code
      </Link>{" "}
      on GitHub
    </Typography>
  </Stack>
);

export default Layout;
