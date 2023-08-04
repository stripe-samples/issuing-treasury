import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { NextComponentType, NextPageContext } from "next";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import createEmotionCache from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";

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
  pageProps: { session, ...pageProps },
}: SampleAppProps) {
  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </SessionProvider>
    </CacheProvider>
  );
}
