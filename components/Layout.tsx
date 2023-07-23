import React from 'react';

import Header from './Header';
import Navbar from './Navbar';

const Layout = ({children}: any) => {
  return (
    <div>
      {children.props.session ? (
        children.props.session.requiresOnboarding === false ? (
          <div>
            <Header />
            <Navbar session={children.props.session} />
          </div>
        ) : null
      ) : null}

      {children}
    </div>
  );
};

export default Layout;
