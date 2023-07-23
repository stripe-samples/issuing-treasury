import React, { useState } from "react";

function PayoutWidget(props: any) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [gotUrl, setGotUrl] = useState(false);
  const [url, setUrl] = useState("");
  const [availableBalance, setAvailableBalance] = useState(
    props.availableBalance,
  );
  const [hasExternalAccount, setHasExternalAccount] = useState(
    props.hasExternalAccount,
  );

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8 ">
      <div className="pt-4 max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-dark-gray-900">
            Create Payout{" "}
          </h2>
          <p className="text-justify mt-6 max-w-2xl text-base text-dark-gray-500">
            In order to enable payouts, you need to set your Financial Account
            as the external account for your Connected Account.
          </p>
          <p className="text-justify mt-6 max-w-2xl text-base text-dark-gray-500">
            If you haven&rsquo;t done it yet, by pressing the &quot;Add
            Financial Account as External Account&quot; button the Financial
            Account will be set as an external account, and a manual payouts
            will be enabled.
          </p>
          <p className="text-justify mt-6 max-w-2xl text-base text-dark-gray-500">
            Platforms have the abilty to setup automatic payouts with different
            schedules. You can dive deep into this topic on{" "}
            <a
              href="https://stripe.com/docs/treasury/moving-money/payouts"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              this page
            </a>
            .
          </p>
          <p className="text-justify mt-6 max-w-2xl text-base text-dark-gray-500">
            Currently your connected account has an{" "}
            <a
              href="https://stripe.com/docs/connect/account-balances"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Available Balance
            </a>{" "}
            of{" "}
            <strong className="bold">
              {formatter.format(availableBalance / 100)}
            </strong>
            .
          </p>
        </div>
        <div className="rounded-md shadow-sm">
          {error ? (
            <div className="p-2 text-center ">
              <p className="text-red-600">{errorText}</p>
            </div>
          ) : null}
          <div className="p-4 content-center">
            {hasExternalAccount ? (
              <button
                id="create-payout"
                type="button"
                className="relative flex justify-center items-center w-full p-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent-color hover:bg-accent-color-light active:ring-2 active:ring-offset-2 active:ring-light-red-900"
                onClick={async (e) => {
                  e.preventDefault();
                  setSubmitted(true);
                  const response = await fetch("api/create_payout", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  });
                  const responseData = await response.json();
                  if (responseData.success === true) {
                    setAvailableBalance(0);
                    setSubmitted(false);
                  } else {
                    setSubmitted(false);
                    setError(true);
                    setErrorText(responseData.error);
                  }
                }}
              >
                {" "}
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
                  <span> Create Payout </span>
                )}
              </button>
            ) : (
              <div>
                <button
                  id="create-addFA"
                  type="button"
                  className="relative flex justify-center items-center w-full p-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent-color hover:bg-accent-color-light active:ring-2 active:ring-offset-2 active:ring-light-red-900"
                  onClick={async (e) => {
                    e.preventDefault();
                    setSubmitted(true);
                    const response = await fetch("api/add_external_account", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    });
                    const responseData = await response.json();
                    if (responseData.externalAcctAdded === true) {
                      setHasExternalAccount(true);
                      setSubmitted(false);
                    } else {
                      setSubmitted(false);
                      setError(true);
                      setErrorText(responseData.error);
                    }
                  }}
                >
                  {" "}
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
                    <span> Add Financial Account as External Account </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayoutWidget;
