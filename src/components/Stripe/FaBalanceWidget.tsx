import React from 'react';

import {formatUSD} from '../../utils/format';

function FaBalanceWidget({financialAccount}: any) {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8 mt-4 mb-4">
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {/* Card */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {/*  Heroicon name: outline/scale */}
                  <svg
                    className="h-6 w-6 text-gray-400"
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
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Account balance
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {formatUSD(financialAccount.balance.cash.usd / 100)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-xs text-gray-400">Current Balance</div>
            </div>
          </div>
          {/* Card */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Outbound Pending
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {formatUSD(
                          financialAccount.balance.outbound_pending.usd / 100
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-xs text-gray-400">
                Funds reserved for pending outbound flows
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FaBalanceWidget;
