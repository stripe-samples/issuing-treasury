import React from "react";

import { formatDateTime, formatUSD } from "src/utils/format";

function FaTransactionsExtendedWidget({ faTransactions }: any) {
  return (
    <div className="mx-auto max-w-6xl mt-4 mb-4">
      <div className="py-4">
        <div className="mt-4"></div>
        <div className="mx-auto sm:px-6 max-h-[36rem] overflow-y-auto">
          <div className="flex flex-col mt-2">
            <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody
                  id="fa_transactions_tbody"
                  className="bg-white divide-y divide-gray-200"
                >
                  {faTransactions.map((transaction: any, i: any) => (
                    <tr className="bg-white" key={i}>
                      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                        <div> {formatDateTime(transaction.created)}</div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 uppercase">
                        <span className="text-gray-500 font-medium">
                          {formatUSD(transaction.amount / 100)}{" "}
                          {transaction.currency}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-left whitespace-nowrap text-sm text-gray-500 uppercase">
                        {transaction.flow_details[transaction.flow_type]
                          .hosted_regulatory_receipt_url ? (
                          <span className="text-gray-500 font-medium flex justify-between">
                            {transaction.flow_type}
                            <a
                              href={
                                transaction.flow_details[transaction.flow_type]
                                  .hosted_regulatory_receipt_url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                              </svg>
                            </a>
                          </span>
                        ) : (
                          <span className="text-gray-500 font-medium flex">
                            {transaction.flow_type}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500 text-clip">
                        <span className="text-gray-500 font-medium">
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500 text-clip">
                        <span className="text-gray-500 font-medium">
                          {transaction.description}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FaTransactionsExtendedWidget;
