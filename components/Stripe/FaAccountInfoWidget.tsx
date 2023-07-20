import React, {useState} from 'react';

function FaAccountWidget({
  financialAccount
}: any) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div>
        <button
          onClick={() => setShowModal(true)}
          id="fa-details-btn"
          type="button"
          className="inline-flex items-center px-10 py-2.5 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-accent-color hover:bg-accent-color-light ml-2 mr-2"
        >
          View Financial Account Information
        </button>
      </div>

      {showModal ? (
        <>
          <div
            className="flex fixed z-50 inset-0 overflow-auto bg-black bg-opacity-50"
            id="fa-information-modal"
          >
            <div className="relative p-8 bg-white w-full max-w-lg m-auto rounded-md flex-col flex">
              <div
                onClick={() => setShowModal(false)}
                id="close-fa-information-modal"
                className="absolute top-0 right-10 w-10 p-4 rounded-full cursor-pointer"
              >
                <svg
                  className="hover:fill-gray-600"
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
              <h1 className="font-bold text-lg m-auto mb-10">
                Financial Account Information
              </h1>
              <div className="bg-white">
                <div className="grid grid-cols-1 gap-4 bg-gray-100 p-6 rounded-md">
                  <div>
                    <label
                      htmlFor="account_holder"
                      className="block font-bold text-gray-900"
                    >
                      Account Holder name
                    </label>
                    <span
                      className="mt-1 block w-full sm:text-sm"
                      id="review-routing_number"
                    >
                      {
                        financialAccount.financial_addresses[0].aba
                          .account_holder_name
                      }
                    </span>
                  </div>
                  <div>
                    <label
                      htmlFor="routing_number"
                      className="block font-bold text-gray-900"
                    >
                      Routing Number
                    </label>
                    <span
                      className="mt-1 block w-full sm:text-sm"
                      id="review-routing_number"
                    >
                      {
                        financialAccount.financial_addresses[0].aba
                          .routing_number
                      }
                    </span>
                  </div>
                  <div>
                    <label
                      htmlFor="account_number"
                      className="block font-bold text-gray-900"
                    >
                      Account Number
                    </label>
                    <span
                      className="mt-1 block w-full sm:text-sm"
                      id="review-account_number"
                    >
                      {
                        financialAccount.financial_addresses[0].aba
                          .account_number
                      }
                    </span>
                  </div>
                  <div>
                    <label
                      htmlFor="supported_networks"
                      className="block font-bold text-gray-900"
                    >
                      Supported Networks
                    </label>
                    {financialAccount.financial_addresses[0].supported_networks.map(
                      (network: any, i: any) => (
                        <div key={i}>
                          <span
                            className="mt-1 block w-full sm:text-sm"
                            id="review-account_number"
                          >
                            {network.toUpperCase().replace(/_/g, ' ')}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
export default FaAccountWidget;
