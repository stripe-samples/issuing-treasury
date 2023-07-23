import "../styles/globals.css";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { parse } from "cookie";
import { NextComponentType, NextPageContext } from "next";
import { AppContext, AppProps } from "next/app";
import React from "react";

import { createTheme } from "../theme";
import createEmotionCache from "../utils/create-emotion-cache";
import { decode } from "../utils/jwt_encode_decode";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface SampleAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, any> & {
    getLayout?: (page: React.ReactNode) => React.ReactNode;
  };
  emotionCache?: EmotionCache;
}

export default function SampleApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: SampleAppProps) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
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
