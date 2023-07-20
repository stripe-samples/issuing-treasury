import React, {useState} from 'react';

function CardholderUpdateWidget(props: any) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [accept, setAccept] = useState('false');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    if (accept != 'false') {
      const body = {
        cardholderId: props.cardholderId,
        firstName: props.firstName,
        lastName: props.lastName,
      };
      const response = await fetch('api/update_cardholder', {
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
      <button
        onClick={() => setShowModal(true)}
        id="update-cardholder-btn"
        type="button"
        className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm rounded-md text-white bg-accent-color hover:bg-accent-color-light "
      >
        Update Cardholder
      </button>

      {showModal ? (
        <>
          <div id="update-cardholder-modal">
            <div className="flex fixed z-50 inset-0 overflow-auto bg-black bg-opacity-50">
              <div className="relative p-8 bg-white m-auto rounded-md flex-col flex">
                <div
                  onClick={() => {
                    setShowModal(false);
                  }}
                  id="close-update-cardholder-modal"
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
                  Update Cardholder
                </h1>
                {error ? (
                  <div className="text-center pb-4 ">
                    <p className="text-red-600">{errorText}</p>
                  </div>
                ) : null}
                <form action="/api/update_cardholder" method="POST">
                  <div className="flex items-center mb-4">
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
                      <span>Update Cardholder</span>
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
export default CardholderUpdateWidget;
