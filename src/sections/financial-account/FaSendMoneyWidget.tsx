import React, { useState } from "react";

import { formatUSD } from "src/utils/format";

function FaSendMoneyWidget() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [newTransfer, setNewTransfer] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStage, setModalStage] = useState("0");
  const [name, setName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("ach");
  const [transactionResult, setTransactionResult] = useState("pending");
  const descriptor = "FromPlatform";
  const [notes, setNotes] = useState("");
  const [city, setCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address1, setAddress1] = useState("");

  return (
    <div>
      <div>
        <button
          onClick={() => setShowModal(true)}
          id="send-money-btn"
          type="button"
          className="inline-flex items-center px-10 py-2.5 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-accent-color hover:bg-accent-color-light ml-2 mr-2"
        >
          Send Money
        </button>
      </div>
      {showModal ? (
        <form action="/api/send_money" method="POST">
          <>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              {modalStage == "0" ? (
                <>
                  <div id="sendmoney-modal" className="flex pt-4 pb-4 pl-4">
                    {/*Send Money part 1 */}
                    <div
                      className="flex fixed z-50 inset-0 overflow-auto bg-black bg-opacity-50"
                      id="sendmoney-modal-part1"
                    >
                      <div className="relative p-8 bg-white w-full max-w-lg m-auto rounded-md flex-col flex">
                        <div
                          id="close-sendmoney-modal"
                          className="absolute top-0 right-10 w-10 p-4 rounded-full cursor-pointer hover:text-gray-600"
                          onClick={() => {
                            // @ts-expect-error TS(2774): This condition will always return true since this ... Remove this comment to see the full error message
                            if (setTransferSuccess) {
                              // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                              window.location.reload(false);
                            }
                            setShowModal(false);
                            setModalStage("0");
                          }}
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
                        <h1 className="font-bold text-lg m-auto mb-2">
                          Send Money
                        </h1>
                        <div className="text-md py-2 mb-5">
                          <p className="py-2">
                            In this demo you can test an experience for sending
                            funds from a Treasury Financial Account to an
                            external 3rd party US bank account. Depending on the
                            network type, timing for funds to be available may
                            vary.
                          </p>
                          <p className="py-2">
                            You can set the status of the transaction before
                            sending the payment for demo purposes. Do not forget
                            to check the Financial Account balance afterwards!
                          </p>
                        </div>
                        <div className="bg-white">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                              <label
                                htmlFor="network"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Network
                              </label>
                              <div className="mt-2">
                                <div>
                                  <label className="block mt-1 p-2 text-sm font-medium text-gray-700">
                                    <input
                                      type="radio"
                                      className="form-radio"
                                      name="network"
                                      value="ach"
                                      onClick={(e) =>
                                        // @ts-expect-error TS(2339): Property 'value' does not exist on type 'EventTarg... Remove this comment to see the full error message
                                        setNetwork(e.target.value)
                                      }
                                    ></input>
                                    <span className="ml-2">ACH</span>
                                  </label>
                                  <label className="block mt-1 p-2 text-sm font-medium text-gray-700">
                                    <input
                                      type="radio"
                                      className="form-radio"
                                      name="network"
                                      value="us_domestic_wire"
                                      onClick={(e) =>
                                        // @ts-expect-error TS(2339): Property 'value' does not exist on type 'EventTarg... Remove this comment to see the full error message
                                        setNetwork(e.target.value)
                                      }
                                    ></input>
                                    <span className="ml-2">Wire Transfer</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            id="send-money-next-btn-1"
                            type="button"
                            className="mt-8 w-full px-12 py-2.5 text-white bg-accent-color hover:bg-accent-color-light rounded-md text-center font-medium cursor-pointer"
                            onClick={() => setModalStage("1")}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {/*Send Money part 2 */}
              {modalStage == "1" ? (
                <>
                  <div
                    className="flex fixed z-50 inset-0 overflow-auto bg-black bg-opacity-50"
                    id="sendmoney-modal-part2"
                  >
                    <div className="relative p-8 bg-white w-full max-w-lg m-auto rounded-md flex-col flex">
                      <div
                        id="close-sendmoney-modal2"
                        className="absolute top-0 right-10 w-10 p-4 rounded-full cursor-pointer hover:text-gray-600"
                        onClick={() => {
                          if (transferSuccess) {
                            // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                            window.location.reload(false);
                          }
                          setShowModal(false);
                          setModalStage("0");
                        }}
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
                      <h1 className="font-bold text-lg m-auto mb-2">
                        Send Money
                      </h1>
                      <div className="bg-white">
                        <div className="grid grid-cols-6 gap-4">
                          <div className="col-span-6">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              autoComplete="name"
                              className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          {network === "us_domestic_wire" ? (
                            <div className="col-span-6 grid grid-cols-4 gap-4">
                              <div className="col-span-4">
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

                              <div className="col-span-2">
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

                              <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                  State
                                </label>
                                <input
                                  type="text"
                                  name="state"
                                  id="state"
                                  className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  onChange={(e) =>
                                    setAddressState(e.target.value)
                                  }
                                ></input>
                              </div>

                              <div className="col-span-1 px-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Postal Code
                                </label>
                                <input
                                  type="text"
                                  name="postalCode"
                                  id="postalCode"
                                  className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  onChange={(e) =>
                                    setPostalCode(e.target.value)
                                  }
                                ></input>
                              </div>
                            </div>
                          ) : null}

                          <div className="col-span-6">
                            <label
                              htmlFor="routing_number"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Routing Number
                            </label>
                            <input
                              type="text"
                              name="routing_number"
                              id="routing_number"
                              autoComplete="routing_number"
                              placeholder="110000000"
                              className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              onChange={(e) => setRoutingNumber(e.target.value)}
                            ></input>
                          </div>
                          <div className="col-span-6">
                            <label
                              htmlFor="account_number"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Account Number
                            </label>
                            <input
                              type="text"
                              name="account_number"
                              id="account_number"
                              autoComplete="account_number"
                              placeholder="1234567890"
                              className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              onChange={(e) => setAccountNumber(e.target.value)}
                            ></input>
                          </div>

                          <div className="col-span-6">
                            <label
                              htmlFor="amount"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Amount
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  $
                                </span>
                              </div>
                              <input
                                type="number"
                                name="amount"
                                id="amount"
                                className="fmt-1 p-2 border block w-full pl-7 pr-4 shadow-sm sm:text-sm border-gray-300 rounded-md "
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => setAmount(e.target.value)}
                              ></input>
                            </div>
                          </div>
                          <div className="col-span-6">
                            <label
                              htmlFor="account_number"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Account Notes (Optional)
                            </label>
                            <input
                              type="text"
                              name="notes"
                              id="notes"
                              autoComplete="notes"
                              className="mt-1 p-2 border block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              onChange={(e) => setNotes(e.target.value)}
                            ></input>
                            <input
                              type="hidden"
                              name="descriptor"
                              id="descriptor"
                              value="FromPlatform"
                            ></input>
                          </div>
                        </div>
                      </div>
                      <button
                        id="send-money-next-btn-2"
                        type="button"
                        className="mt-8 w-full px-12 py-2.5 text-white bg-accent-color hover:bg-accent-color-light rounded-md text-center font-medium cursor-pointer"
                        onClick={() => setModalStage("2")}
                      >
                        Next
                      </button>
                      <button
                        id="send-money-back-btn-1"
                        type="button"
                        className="mt-4 w-full px-12 py-2.5 text-white bg-accent-color hover:bg-accent-color-light rounded-md text-center font-medium cursor-pointer"
                        onClick={() => setModalStage("0")}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {/*Confirmation */}
              {modalStage == "2" ? (
                <>
                  <div
                    className="flex fixed z-50 inset-0 overflow-auto bg-black bg-opacity-50"
                    id="sendmoney-modal-part3"
                  >
                    <div className="relative p-8 bg-white w-full max-w-lg m-auto rounded-md flex-col flex">
                      <div
                        id="close-sendmoney-modal3"
                        className="absolute top-0 right-10 w-10 p-4 rounded-full cursor-pointer  "
                        onClick={() => {
                          if (transferSuccess) {
                            // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                            window.location.reload(false);
                          }
                          setShowModal(false);
                          setModalStage("0");
                        }}
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
                      {error ? (
                        <div className="p-2 text-center ">
                          <p className="text-red-600">{errorText}</p>
                        </div>
                      ) : null}
                      {transferSuccess == true ? (
                        <div className="p-2 text-center ">
                          <p className="text-green-600">
                            Transaction successful.{" "}
                          </p>
                          <p className="text-green-600">
                            Please click &quot;Start Over&quot; to intiate a new
                            transfer.
                          </p>
                        </div>
                      ) : null}
                      <h1 className="font-bold text-lg m-auto mb-10">Review</h1>
                      <div className="bg-white">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="">
                            <label
                              htmlFor="name"
                              className="block font-bold text-gray-900"
                            >
                              Name
                            </label>
                            <span
                              className="mt-1 block w-full sm:text-sm"
                              id="review-name"
                            >
                              {name}
                            </span>
                          </div>

                          <div className="">
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
                              {routingNumber}
                            </span>
                          </div>

                          <div className="">
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
                              {accountNumber}
                            </span>
                          </div>
                          <div className="">
                            <label
                              htmlFor="amount"
                              className="block font-bold text-gray-900"
                            >
                              Amount
                            </label>
                            <span
                              className="mt-1 block w-full sm:text-sm"
                              id="review-amount"
                            >
                              {amount}
                            </span>
                          </div>
                          <div className="">
                            <label
                              htmlFor="amount"
                              className="block font-bold text-gray-900"
                            >
                              Network
                            </label>
                            <span
                              className="mt-1 block w-full sm:text-sm"
                              id="review-network"
                            >
                              {network}
                            </span>
                          </div>
                          <div className="">
                            <label
                              htmlFor="routing_number"
                              className="block font-bold text-gray-900"
                            >
                              Descriptor
                            </label>
                            <span
                              className="mt-1 block w-full sm:text-sm"
                              id="review-descriptor"
                            >
                              {descriptor}
                            </span>
                          </div>
                          {network === "us_domestic_wire" ? (
                            <div className="col-span-2">
                              <label
                                htmlFor="adress"
                                className="block font-bold text-gray-900"
                              >
                                Address
                              </label>
                              <span
                                className="mt-1 block w-full sm:text-sm"
                                id="review-notes"
                              >
                                {address1} , {city} - {addressState}{" "}
                                {postalCode}
                              </span>
                            </div>
                          ) : null}

                          <div className="">
                            <label
                              htmlFor="notes"
                              className="block font-bold text-gray-900"
                            >
                              Notes (Optional)
                            </label>
                            <span
                              className="mt-1 block w-full sm:text-sm"
                              id="review-notes"
                            >
                              {notes}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <label
                              htmlFor="transaction_result"
                              className="block font-bold text-gray-900"
                            >
                              Transaction Result
                              <div className="flex p-2 mt-1 mb-2 font-normal items-center border bg-gray-100 rounded-md">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-gray-500 mx-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <div className="text-sm text-gray-500">
                                  Setting the transaction result is for demo
                                  purposes only
                                </div>
                              </div>
                            </label>
                            <select
                              name="transaction_result"
                              id="transaction_result"
                              className="form-select mt-1 p-2 block w-full text-gray-900 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                              onChange={(e) =>
                                setTransactionResult(e.target.value)
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="post">Posted</option>
                              <option value="fail">Failed</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          {newTransfer == true ? (
                            <button
                              className="mt-8 w-full px-12 py-2.5 text-white bg-accent-color hover:bg-accent-color-light rounded-md text-center font-medium cursor-pointer"
                              onClick={() => {
                                // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                                setModalStage(0);
                                setError(false);
                                setErrorText("");
                                // @ts-expect-error TS(2345): Argument of type '"false"' is not assignable to pa... Remove this comment to see the full error message
                                setTransferSuccess("false");
                                setNewTransfer(false);
                              }}
                            >
                              <span> Start Over </span>
                            </button>
                          ) : (
                            <div>
                              <button
                                className="mt-8 w-full px-12 py-2.5 text-white bg-accent-color hover:bg-accent-color-light rounded-md text-center font-medium cursor-pointer"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  setSubmitted(true);
                                  if (name != "" && amount != "") {
                                    const body = {
                                      name: name,
                                      routing_number: routingNumber,
                                      account_number: accountNumber,
                                      network: network,
                                      amount: amount,
                                      line1: address1,
                                      city: city,
                                      state: addressState,
                                      postalCode: postalCode,
                                      notes: notes,
                                      transaction_result: transactionResult,
                                    };
                                    const response = await fetch(
                                      "api/send_money",
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type":
                                            "application/json;charset=utf-8",
                                        },
                                        body: JSON.stringify(body),
                                      },
                                    );
                                    const responseData = await response.json();
                                    if (responseData.success === true) {
                                      setSubmitted(false);
                                      setNewTransfer(true);
                                      setTransferSuccess(true);
                                    } else {
                                      setSubmitted(false);
                                      setError(true);
                                      setErrorText(responseData.error);
                                    }
                                  } else {
                                    setErrorText(
                                      "Name and Amount fields are required",
                                    );
                                    setSubmitted(false);
                                    setError(true);
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
                                  <span> Transfer </span>
                                )}
                              </button>
                              <button
                                id="send-money-back-btn-1"
                                type="button"
                                className="mt-4 w-full px-12 py-2.5 text-white bg-accent-color hover:bg-accent-color-light rounded-md text-center font-medium cursor-pointer"
                                onClick={() => {
                                  setModalStage("1");
                                }}
                              >
                                Back
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </>
        </form>
      ) : null}
    </div>
  );
}

export default FaSendMoneyWidget;
