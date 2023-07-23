import React from 'react';

import Header from './Header';
import Navbar from './Navbar';

const Layout = ({children}: any) => (
  <>
    {children.props.session ? (
      children.props.session.requiresOnboarding === false ? (
        <>
          <Header />
          <Navbar session={children.props.session} />
        </>
      ) : null
    ) : null}

    {children}
  </>
);

export default Layout;
