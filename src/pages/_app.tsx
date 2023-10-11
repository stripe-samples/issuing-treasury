import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { NextComponentType, NextPageContext } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider, useSession } from "next-auth/react";
import React, { ReactElement } from "react";

import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import createEmotionCache from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

interface SampleAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, ReactElement, EmotionCache> & {
    getLayout?: (page: ReactElement) => ReactElement;
  };
  emotionCache?: EmotionCache;
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { session, ...pageProps },
}: SampleAppProps) {
  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Stripe Issuing and Treasury platform demo</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://baas.stripe.dev" />
        <meta
          property="og:title"
          content="Stripe Issuing and Treasury platform demo"
        />
        <meta
          property="og:description"
          content="This web app demonstrates Stripe Issuing and Treasury APIs in an end-to-end integration. Create an account with the demo platform to create cards, test purchases, and make and receive payments with a financial account."
        />
        <meta
          property="og:image"
          content="https://baas.stripe.dev/assets/issuing-treasury-sample-app.png"
        />
        <meta
          property="og:image:alt"
          content="Stripe Issuing and Treasury Platform Sample App Screenshot"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://baas.stripe.dev" />
        <meta
          name="twitter:title"
          content="Stripe Issuing and Treasury platform demo"
        />
        <meta
          name="twitter:description"
          content="This web app demonstrates Stripe Issuing and Treasury APIs in an end-to-end integration. Create an account with the demo platform to create cards, test purchases, and make and receive payments with a financial account."
        />
        <meta
          name="twitter:image"
          content="https://baas.stripe.dev/assets/issuing-treasury-sample-app.png"
        />
        <meta
          name="twitter:image:alt"
          content="Stripe Issuing and Treasury Platform Sample App Screenshot"
        />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContent>{getLayout(<Component {...pageProps} />)}</AppContent>
        </ThemeProvider>
      </SessionProvider>
    </CacheProvider>
  );
}

const AppContent = ({ children }: { children: ReactElement }) => {
  const { status } = useSession();

  return status === "loading" ? <SplashScreen /> : children;
};
