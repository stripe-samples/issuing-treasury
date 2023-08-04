import { Box, Stack, Typography, Button, Alert } from "@mui/material";
import { serialize } from "cookie";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth/core/types";
import { signOut } from "next-auth/react";
import React, { ReactNode, useState } from "react";

import AuthLayout from "src/layouts/auth/layout";
import { withAuth } from "src/middleware/auth-middleware";
import { encode } from "src/utils/jwt_encode_decode";
import stripe from "src/utils/stripe-loader";
import { createAccountOnboardingUrl } from "src/utils/stripe_helpers";

export const getServerSideProps = withAuth(
  async (context: GetServerSidePropsContext, session: Session) => {
    const account = await stripe.accounts.retrieve(session.accountId);

    if (account?.requirements?.currently_due?.length ?? 0 > 1) {
      // Create the onboarding link and redirect
      const url = await createAccountOnboardingUrl(
        account.id,
        process.env.DEMO_HOST,
      );

      return {
        props: {
          url: url,
        },
      };
    } else {
      // Renew cookie
      session.requiresOnboarding = false;
      const cookie = encode(JSON.stringify(session));
      context.res.setHeader(
        "Set-Cookie",
        serialize("app_auth", cookie, { path: "/", httpOnly: true }),
      );
      return {
        redirect: { destination: "/", permanent: false },
      };
    }
  },
);

const Page = ({ url }: { url: string }) => {
  const [isContinuingOnboarding, setIsContinuingOnboarding] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleContinueOnboarding = async (e: any) => {
    e.preventDefault();
    window.location.replace(url);
    setIsContinuingOnboarding(true);
  };

  const handleLogout = async (e: any) => {
    e.preventDefault();
    await signOut();
    setIsLoggingOut(true);
  };

  return (
    <>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 550, px: 3, py: "100px", width: "100%" }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Finish onboarding</Typography>
          </Stack>
          <Stack spacing={3}>
            <Typography color="text.secondary" variant="body2">
              To have access to all features, please complete onboarding.
            </Typography>
            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              variant="contained"
              onClick={handleContinueOnboarding}
              disabled={isContinuingOnboarding}
            >
              Continue onboarding
            </Button>
            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              variant="contained"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              Log out
            </Button>
          </Stack>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={3}
          >
            <Alert color="primary" severity="info">
              Password field is illustrative and not verified
            </Alert>
          </Box>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default Page;
