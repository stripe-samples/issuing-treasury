import React, {useState} from 'react';

function CardholderCreateWidget(props: any) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');
  const [accept, setAccept] = useState('false');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    if (
      firstName != '' &&
      lastName != '' &&
      email != '' &&
      address1 != '' &&
      city != '' &&
      addressState != '' &&
      postalCode != '' &&
      accept != 'false'
    ) {
      const body = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        address1: address1,
        city: city,
        state: addressState,
        postalCode: postalCode,
        country: country,
      };
      const response = await fetch('api/add_cardholder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        window.location.replace('/cards');
      } else {
        setSubmitted(false);
        const result = await response.json();
        setError(true);
        setErrorText(result.error);
      }
    } else {
      setErrorText('All fields are required.');
      setSubmitted(false);
      setError(true);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="p-6 mt-10 space-x-3 md:mt-0 md:ml-4 grid justify-items-end">
        <button
          onClick={() => setShowModal(true)}
          id="new-cardholder-btn"
          type="button"
          className="inline-flex items-center px-10 py-2.5 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-accent-color hover:bg-accent-color-light ml-2 mr-2"
        >
          New Cardholder{' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 pl-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {showModal ? (
        <>
          <div id="new-cardholder-modal">
            <div className="flex fixed z-50 inset-0 overflow-auto bg-black bg-opacity-50">
              <div className="relative p-8 bg-white w-full max-w-lg m-auto rounded-md flex-col flex">
                <div
                  onClick={() => {
                    setShowModal(false);
                  }}
                  id="close-new-cardholder-modal"
                  className="absolute w-10 p-4 rounded-full cursor-pointer top-0 right-10"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071Z"
                      fill="#494949"
                    ></path>
                  </svg>
                </div>
                <h1 className="font-bold text-lg m-auto pt-2 pb-4 mb-8">
                  Add a new cardholder
                </h1>
                {error ? (
                  <div className="text-center pb-4 ">
                    <p className="text-red-600">{errorText}</p>
                  </div>
                ) : null}
                <form action="/api/add_cardholder" method="POST">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => setFirstName(e.target.value)}
                      ></input>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => setLastName(e.target.value)}
                      ></input>
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => setEmail(e.target.value)}
                      ></input>
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Street address
                      </label>
                      <input
                        type="text"
                        name="address1"
                        id="address1"
                        className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => setAddress1(e.target.value)}
                      ></input>
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => setCity(e.target.value)}
                      ></input>
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => setAddressState(e.target.value)}
                      ></input>
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => setPostalCode(e.target.value)}
                      ></input>
                    </div>
                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <select
                        name="Country"
                        id="Country"
                        className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="US">United States</option>
                      </select>
                    </div>
                    <div className="col-span-1 text-right">
                      <input
                        type="checkbox"
                        name="accept-terms"
                        id="accept-terms"
                        className="mx-2"
                        onChange={(e) => {
                          if (accept == 'false') {
                            setAccept('true');
                          } else {
                            setAccept('false');
                          }
                        }}
                      ></input>
                    </div>
                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-gray-700">
                        This cardholder has agreed to the{' '}
                        <a
                          className="underline font-medium text-blue-700"
                          href="https://stripe.com/legal/issuing/celtic-authorized-user-terms"
                        >
                          Celtic Bank Authorized User Terms
                        </a>{' '}
                        and{' '}
                        <a
                          className="underline font-medium text-blue-700"
                          href="https://www.celticbank.com/privacy"
                        >
                          Celtic Bank Privacy Policy.
                        </a>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-8 w-full px-12 py-2 text-white bg-accent-color hover:bg-accent-color-light rounded-md flex-1 mr-2 text-center cursor-pointer "
                    onClick={handleSubmit}
                  >
                    {submitted ? (
                      <svg
                        role="status"
                        className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    ) : (
                      <span>Add cardholder</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
export default CardholderCreateWidget;
