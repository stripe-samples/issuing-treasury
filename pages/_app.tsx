import '../styles/globals.css';
import Layout from '../components/Layout';
import {AppProps, AppContext} from 'next/app';
import Head from 'next/head';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider, EmotionCache} from '@emotion/react';
import {decode} from '../utils/jwt_encode_decode';
import theme from '../config/theme';
import createEmotionCache from '../config/createEmotionCache';

import {parse} from 'cookie';
import * as React from 'react';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface HomeMadeHamProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function HomeMadeHam({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: HomeMadeHamProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}

HomeMadeHam.getInitialProps = (context: AppContext) => {
  const cookie = parse(context.ctx.req?.headers.cookie ?? '');
  if ('app_auth' in cookie) {
    const session = decode(cookie.app_auth);
    return {
      pageProps: {session: session},
    };
  }

  return {
    pageProps: {},
  };
};
