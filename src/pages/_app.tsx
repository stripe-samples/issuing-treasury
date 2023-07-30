// import "../styles/globals.css";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { NextComponentType, NextPageContext } from "next";
import { AppProps } from "next/app";
import React, { ReactNode } from "react";

import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import createEmotionCache from "src/utils/create-emotion-cache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

interface SampleAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, ReactNode, EmotionCache> & {
    getLayout?: (page: React.ReactNode) => React.ReactNode;
  };
  emotionCache?: EmotionCache;
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: SampleAppProps) {
  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthConsumer>
            {(auth) =>
              auth.isLoading ? (
                <SplashScreen />
              ) : (
                getLayout(<Component {...pageProps} />)
              )
            }
          </AuthConsumer>
        </ThemeProvider>
      </AuthProvider>
    </CacheProvider>
  );
}
