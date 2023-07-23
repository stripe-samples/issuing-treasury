import React, {useState} from 'react';

import {formatDateTime} from '../../utils/format';

import CardholderUpdateWidget from './CardholderUpdateWidget';

function CardHolderWidget({cardholders}: any) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {cardholders.length > 0 ? (
        <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cardholder Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cardholder Email
                </th>
                <th className="hidden px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:block">
                  Created
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th></th>
              </tr>
            </thead>
            <tbody
              id="cardholders_tbody"
              className="bg-white divide-y divide-gray-200"
            >
              {cardholders.map((cardholder: any, i: any) => (
                <tr className="bg-white" key={i}>
                  <td className="max-w-0 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex">
                      {cardholder.individual ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                          />
                        </svg>
                      )}
                      <p className="text-gray-500 truncate group-hover:text-gray-900 ml-5">
                        {cardholder.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                    <div>{cardholder.email}</div>
                  </td>
                  <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <time dateTime="2020-07-11">
                        {formatDateTime(cardholder.created)}
                      </time>
                    </div>
                  </td>
                  <td className="hidden px-6 py-4 whitespace-nowrap text-sm text-gray-500 md:block text-right">
                    {cardholder.individual ? (
                      <form action="/api/issue_card" method="POST">
                        <input
                          type="hidden"
                          id="cardholderid"
                          name="cardholderid"
                          value={cardholder.id}
                        ></input>
                        <select
                          name="card_type"
                          id="card_type"
                          className="mt-1 p-2 mx-2 border w-40 shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="virtual">Virtual</option>
                          <option value="physical">Physical</option>
                        </select>

                        <button
                          type="submit"
                          className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm rounded-md text-white bg-accent-color hover:bg-accent-color-light "
                        >
                          Issue Card
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
                      </form>
                    ) : (
                      <CardholderUpdateWidget cardholderId={cardholder.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* New cardholder modal */}
    </div>
  );
}
export default CardHolderWidget;
