import Link from 'next/link';
import React, {Component} from 'react';

const NavBar = ({session}: any) => {
  return (
    <nav className="bg-gray-800 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>

              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <svg
                width="27"
                height="25"
                viewBox="0 0 27 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.6877 15.3027C26.7762 14.6781 26.8206 14.0461 26.82 13.4116C26.8203 11.5399 26.4287 9.68901 25.6706 7.97789C24.9122 6.26648 23.8042 4.73297 22.4179 3.47571C21.0313 2.21874 19.3971 1.26544 17.6201 0.678081C15.8429 0.0904248 13.9628 -0.118771 12.1 0.0642015C10.2373 0.246876 8.43348 0.817544 6.80464 1.73956C5.17581 2.66157 3.75801 3.91406 2.64242 5.41687C1.52683 6.91969 0.738202 8.63945 0.32726 10.4656C-0.0837119 12.2914 -0.10788 14.1831 0.256276 16.0191L4.16901 10.6998L6.52321 10.1038V8.15788L8.69562 7.24899V13.051L9.78629 12.324L9.78631 9.2873L19.3879 6.8884L8.15327 19.5713H1.50788C2.44902 21.387 3.7924 22.9637 5.43551 24.1813V24.1039C5.37591 22.4738 10.1827 20.4802 15.4006 21.9285C16.857 22.3331 18.0901 22.7646 19.1474 23.1348L19.1506 23.1359C20.1469 23.4844 20.9865 23.778 21.7093 23.9429C23.3036 22.6898 24.5924 21.0905 25.4778 19.2661C25.9758 18.2398 26.3387 17.1578 26.5607 16.0462L19.347 8.17755L19.7863 7.77465L26.6877 15.3027ZM16.6701 14.4993H18.4819V16.3112H16.6701V14.4993ZM18.8455 14.4993H20.6574V16.3112H18.8455V14.4993ZM20.6574 16.6747H18.8455V18.4865H20.6574V16.6747ZM16.6701 16.6747H18.4819V18.4865H16.6701V16.6747Z"
                  fill="white"
                />
              </svg>
              <h1 className="antialiased text-gray-50 font-mono font-thin leading-3 ">
                {' '}
                HomeMadeHam{' '}
              </h1>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link legacyBehavior href="/dashboard">
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </a>
                </Link>

                <Link legacyBehavior href="/cards">
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Cards
                  </a>
                </Link>

                <Link legacyBehavior href="/financial_account">
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Financial Account
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <span className="text-gray-300  px-3  rounded-md text-sm font-medium">
              {session.customerName}
            </span>

            <button
              type="button"
              className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              onClick={async (e) => {
                e.preventDefault();
                const response = await fetch('/api/logout', {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                  },
                });
                window.location.replace('/signin');
              }}
            >
              <span className="sr-only">View notifications</span>

              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 490.3 490.3"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  fill="#FFFFFF"
                  d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
			s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
			c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
			C27.9,58.95,0,86.75,0,121.05z"
                />
                <path
                  fill="#FFFFFF"
                  d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
			c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
			C380.6,325.15,380.6,332.95,385.4,337.65z"
                />
              </svg>
            </button>

            <div className="ml-3 relative">
              <div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
            aria-current="page"
          >
            Dashboard
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
