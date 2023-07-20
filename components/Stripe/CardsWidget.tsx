import React from 'react';
import {formatDateTime, capitalize} from '../../utils/format';

function CardsWidget({cards}: any) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {cards.length > 0 ? (
        <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg mt-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Cardholder Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Last&nbsp;4
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:block">
                  Created
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody
              id="cards_tbody"
              className="bg-white divide-y divide-gray-200"
            >
              {cards.map((card: any, i: any) => (
                <tr className="bg-white" key={i}>
                  <td className="max-w-0 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <p className="text-gray-500 truncate group-hover:text-gray-900 ml-5">
                        {card.cardholder.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                    <span className="text-gray-500 font-medium">
                      {capitalize(card.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                    <span className="text-gray-500 font-medium">
                      {card.last4}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                    <time dateTime="2020-07-11">
                      {formatDateTime(card.created)}
                    </time>
                  </td>
                  <td className="hidden px-6 py-5 whitespace-nowrap text-sm text-gray-500 md:block text-right">
                    <div className="flex hover:text-gray-900 hover:underline">
                      <a
                        className="flex items-center"
                        href={'/card_details/' + card.id}
                      >
                        Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
export default CardsWidget;
