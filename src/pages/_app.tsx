// import "../styles/globals.css";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { parse } from "cookie";
import { NextComponentType, NextPageContext } from "next";
import { AppContext, AppProps } from "next/app";
import React, { ReactNode } from "react";

import { AuthConsumer, AuthProvider } from "../contexts/auth-context";
import { useNProgress } from "../hooks/use-nprogress";
import { createTheme } from "../theme";
import createEmotionCache from "../utils/create-emotion-cache";
import { decode } from "../utils/jwt_encode_decode";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface SampleAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, ReactNode, EmotionCache> & {
    getLayout?: (page: React.ReactNode) => React.ReactNode;
  };
  emotionCache?: EmotionCache;
}

export default function SampleApp({
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
              auth.isLoading ? <></> : getLayout(<Component {...pageProps} />)
            }
          </AuthConsumer>
        </ThemeProvider>
      </AuthProvider>
    </CacheProvider>
  );
}

SampleApp.getInitialProps = (context: AppContext) => {
  const cookie = parse(context.ctx.req?.headers.cookie ?? "");
  if ("app_auth" in cookie) {
    const session = decode(cookie.app_auth);
    return {
      pageProps: { session: session },
    };
  }

  return {
    pageProps: {},
  };
};
