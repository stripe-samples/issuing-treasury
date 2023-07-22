import '../styles/globals.css';
import Layout from '../components/Layout';
import {AppProps, AppContext} from 'next/app';
import {decode} from '../utils/jwt_encode_decode';

import {parse} from 'cookie';
import * as React from 'react';

type HomeMadeHamProps = AppProps;

export default function HomeMadeHam({Component, pageProps}: HomeMadeHamProps) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
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
