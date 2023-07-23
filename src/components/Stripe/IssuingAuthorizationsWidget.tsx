import React from "react";

import { formatDateTime, formatUSD } from "../../utils/format";

function IssuingAuthorizationsWidget({ cardAuthorizations }: any) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-6">
      {cardAuthorizations.length > 0 ? (
        <div className="p-4">
          <div className="mt-4"></div>
          <div className="max-w-80% mx-auto px-4 py-2 sm:px-6 lg:px-8 max-h-64 overflow-y-auto">
            <div className="flex flex-col mt-2">
              <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last 4
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    id="cardAuthorizations_tbody"
                    className="bg-white divide-y divide-gray-200"
                  >
                    {cardAuthorizations.map(
                      (card_authorization: any, i: any) => (
                        <tr className="bg-white" key={i}>
                          <td className="max-w-0 w-full px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex">
                              <a className="group inline-flex space-x-2 truncate text-sm">
                                <svg
                                  className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <p className="text-gray-500 truncate group-hover:text-gray-900">
                                  {card_authorization.merchant_data.name}{" "}
                                  {card_authorization.id}
                                </p>
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 uppercase">
                            <span className="text-gray-500 font-medium">
                              {formatUSD(card_authorization.amount / 100)}{" "}
                              {card_authorization.currency}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 uppercase">
                            <span className="text-gray-500 font-medium">
                              {card_authorization.card.last4}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                            <div>
                              {formatDateTime(card_authorization.created)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                            <div>
                              {card_authorization.approved ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                  Declined
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg p-5">
          <span className="p-5">There are no issuing transactions.</span>
        </div>
      )}
    </div>
  );
}

export default IssuingAuthorizationsWidget;
