import React from 'react';
import {formatUSD, formatDateTime} from '../../utils/format';

function FaTransactionsWidget({faTransactions}) {
  return (
    <div className="mx-auto max-w-6xl mt-4 mb-4">
      <div className="py-4">
        <div className="mt-4"></div>
        <div className="mx-auto sm:px-6 max-h-64 overflow-y-auto">
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
                  {faTransactions.map((transaction, i) => (
                    <tr className="bg-white" key={i}>
                      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                        <div> {formatDateTime(transaction.created)}</div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 uppercase">
                        <span className="text-gray-500 font-medium">
                          {formatUSD(transaction.amount / 100)}{' '}
                          {transaction.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500 uppercase">
                        <span className="text-gray-500 font-medium">
                          {transaction.flow_type}
                        </span>
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
export default FaTransactionsWidget;
