import Link from 'next/link';
import React, {Component} from 'react';

const NavBar = ({
  session
}: any) => {
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
                stroke="currentColor"
                fill="white"
                viewBox="0 0 297 297"
                className="h-10 w-10 p-2"
              >
                <path
                  fill="#E95755"
                  d="M272.436,112.799c5.231,12.83,5.95,23.33,1.891,27.391c-1.71,1.71-4.58,2.579-8.53,2.579
				c-14.59,0-41.74-12.43-69.49-40.18c-16.43-16.42-29.109-34.399-35.71-50.63c-5.22-12.84-5.939-23.33-1.88-27.39
				c1.71-1.71,4.58-2.58,8.521-2.58c14.6,0,41.75,12.42,69.5,40.18C253.157,78.589,265.837,96.57,272.436,112.799z M237.027,102.879
				c3.63-3.62-2.62-15.74-13.94-27.07c-11.33-11.319-23.45-17.56-27.07-13.939c-3.63,3.63,2.61,15.75,13.94,27.07
				C221.277,100.269,233.397,106.509,237.027,102.879z"
                />
                <path
                  fill="#B85627"
                  d="M181.897,116.999c23.67,23.66,49.88,39.87,71.439,44.65c-18.22,15.56-48.37,35.01-88.47,39.199
				c-39.12,4.091-58.11,21.54-66.96,34.511l-33.5-33.5c12.91-8.95,30.2-28.2,33.66-68.011c3.489-40.18,23.31-70.449,39.13-88.63
				c0.989,4.57,2.48,9.38,4.529,14.41C149.327,78.32,163.597,98.69,181.897,116.999z"
                />
                <path
                  d="M291.06,104.872c-7.6-18.688-21.867-39.06-40.171-57.363c-28.46-28.46-60.609-46.141-83.9-46.141
		c-9.049,0-16.722,2.74-22.27,7.922c-6.41,4.834-60.708,47.871-67.199,122.547c-4.157,47.809-31.03,56.643-32.993,57.225
		c-3.599,0.822-6.338,3.5-7.372,7.05c-1.038,3.569,0.087,7.388,2.715,10.017l5.501,5.501l-6.37,6.37
		c-3.531-1.571-7.387-2.43-11.296-2.46c-0.075-0.001-0.149-0.001-0.224-0.001c-7.3,0-14.129,2.773-19.246,7.819
		c-10.86,10.697-10.996,28.242-0.307,39.106c4.518,4.597,10.362,7.416,16.686,8.098c0.57,6.123,3.171,12.094,7.809,16.809
		c5.183,5.27,12.105,8.201,19.491,8.258c0.073,0.002,0.145,0.002,0.216,0.002c7.304-0.002,14.183-2.821,19.387-7.954
		c8.312-8.192,10.339-20.4,6.031-30.546l6.662-6.661l8.968,8.968c1.937,1.936,4.538,2.983,7.203,2.983
		c0.903,0,1.816-0.121,2.711-0.367c3.534-0.977,6.271-3.776,7.165-7.333c0.073-0.287,7.79-28.771,56.48-33.858
		c75.418-7.878,118.652-62.325,122.476-67.329C298.9,143.04,299.586,125.834,291.06,104.872z M236.484,61.914
		c16.427,16.425,29.107,34.407,35.707,50.633c5.221,12.837,5.944,23.331,1.887,27.388c-1.712,1.713-4.581,2.582-8.527,2.582
		c-14.597,0-41.746-12.423-69.496-40.174c-16.426-16.425-29.105-34.407-35.705-50.635c-5.222-12.836-5.944-23.331-1.886-27.389
		c1.712-1.712,4.579-2.58,8.525-2.58C181.585,21.739,208.732,34.161,236.484,61.914z M57.299,262.859
		c2.816,2.863,2.78,7.487-0.083,10.31c-1.381,1.36-3.191,2.105-5.146,2.089c-1.94-0.015-3.76-0.787-5.123-2.174
		c-2.82-2.865-2.785-7.488,0.076-10.305c2.023-1.992,3.039-4.623,3.04-7.255c0.001-2.581-0.973-5.164-2.927-7.149
		c-3.946-4.01-10.394-4.061-14.403-0.114c-1.372,1.35-3.181,2.091-5.101,2.091c-0.021,0-0.04,0-0.059,0
		c-1.94-0.015-3.758-0.786-5.122-2.174c-2.819-2.865-2.784-7.49,0.083-10.314c1.718-1.693,3.819-1.956,4.955-1.956
		c0.021,0,0.039,0,0.057,0c2.08,0.016,4.091,0.857,5.518,2.309c1.905,1.936,4.504,3.032,7.221,3.044c0.014,0,0.027,0,0.042,0
		c2.701,0,5.292-1.071,7.203-2.982l12.246-12.245l10.031,10.031l-12.45,12.447C53.401,252.468,53.376,258.873,57.299,262.859z
		 M164.62,200.6c-39.127,4.088-58.112,21.538-66.965,34.504l-33.5-33.5c12.914-8.946,30.197-28.192,33.66-68.003
		c3.492-40.183,23.315-70.452,39.129-88.628c0.99,4.563,2.487,9.374,4.535,14.41c7.601,18.688,21.867,39.059,40.171,57.363
		c23.666,23.666,49.879,39.867,71.434,44.656C234.867,176.956,204.719,196.412,164.62,200.6z"
                />
                <path
                  fill="white"
                  d="M222.837,75.558c11.325,11.325,17.566,23.446,13.94,27.072s-15.747-2.615-27.072-13.94s-17.566-23.446-13.94-27.072
		C199.391,57.992,211.511,64.233,222.837,75.558z"
                />
              </svg>
              <h1 className="antialiased text-gray-50 font-mono font-thin leading-3 ">
                {' '}
                HomeMadeHam{' '}
              </h1>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link href="/dashboard">
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </a>
                </Link>

                <Link href="/cards">
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Cards
                  </a>
                </Link>

                <Link href="/financial_account">
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
