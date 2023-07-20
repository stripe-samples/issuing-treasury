import '../styles/globals.css';
import Layout from '../components/Layout';
import {decode} from '../utils/jwt_encode_decode';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'cook... Remove this comment to see the full error message
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
