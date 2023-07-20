import '../styles/globals.css';
import Layout from '../components/Layout';
import {decode} from '../utils/jwt_encode_decode';

import {parse} from 'cookie';
import React, {Component} from 'react';

function HomeMadeHam({
  Component,
  pageProps
}: any) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

HomeMadeHam.getInitialProps = (context: any) => {
  if ('cookie' in context.ctx.req.headers) {
    const cookie = parse(context.ctx.req.headers.cookie);
    if ('app_auth' in cookie) {
      const session = decode(cookie.app_auth);
      return {
        pageProps: {session: session},
      };
    }
  }

  return {
    pageProps: {},
  };
};

export default HomeMadeHam;
