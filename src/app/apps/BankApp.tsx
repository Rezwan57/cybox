"use client";
import Image from "next/image";
import React, { useState } from "react";

type Transaction = {
  id: number;
  type: "send" | "receive";
  amount: number;
  to: string;
  username: string;
};

const fakeAccounts = [
  {
    accountNumber: "11223344",
    sortCode: "04-00-27",
    username: "Rezwan Y",
  },
  {
    accountNumber: "87654321",
    sortCode: "11-22-33",
    username: "Alice M",
  },
  {
    accountNumber: "12345678",
    sortCode: "22-33-44",
    username: "Bob H",
  },
];

export default function BankApp() {
  const [balance, setBalance] = useState(4283.75);
  const [showPopup, setShowPopup] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("account");

  const myInfo = fakeAccounts[0];
  const cardInfo = {
    number: "4456 1122 9987 3344",
    expiry: "09/28",
    cvc: "778",
  };

  const [recipientAcc, setRecipientAcc] = useState("");
  const [recipientSort, setRecipientSort] = useState("");
  const [recipientUser, setRecipientUser] = useState("");
  const [amount, setAmount] = useState("");

  const detectUser = () => {
    const found = fakeAccounts.find(
      (acc) =>
        acc.accountNumber === recipientAcc && acc.sortCode === recipientSort
    );
    setRecipientUser(found ? found.username : "Unknown");
  };

  const handleSend = () => {
    const amt = parseFloat(amount);
    if (recipientUser === "Unknown" || isNaN(amt) || amt <= 0 || amt > balance)
      return;

    setBalance((b) => b - amt);
    setTransactions([
      {
        id: Date.now(),
        type: "send",
        amount: amt,
        to: recipientAcc,
        username: recipientUser,
      },
      ...transactions,
    ]);
    setRecipientAcc("");
    setRecipientSort("");
    setRecipientUser("");
    setAmount("");
    setShowPopup(false);
  };

  return (
    <div className="w-full text-white px-10 py-5">
      <div className="flex justify-center items-center mb-4">
        <Image
          src="/Bank/BankLogo.png"
          alt="Logo"
          width={128}
          height={128}
          className="p-5 w-60"
        />
      </div>

      <div className="flex justify-between items-start gap-10 mb-4">
        {/* Balance */}
        <div className="mb-4 space-y-2 w-1/2">
          <p className="text-lg">Account Balance</p>
          <p className="text-4xl font-bold text-green-400">
            £{balance.toFixed(2)}
          </p>

          <button
            onClick={() => setShowPopup(true)}
            className="max-w-xs w-full mt-6 bg-green-400 text-black px-4 py-2 rounded hover:opacity-90"
          >
            Send Money
          </button>

          {/* Transactions */}
          <div className="mt-6">
            <h3 className="text-green-400 font-semibold mb-2">
              Transaction History
            </h3>
            <ul className="text-sm max-h-40 overflow-y-auto space-y-1">
              {transactions.length === 0 && <li>No transactions yet.</li>}
              {transactions.map((tx) => (
                <li key={tx.id}>
                  - £{tx.amount.toFixed(2)} sent to {tx.username} ({tx.to})
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 w-1/2">
          <div className="flex bg-neutral-800 p-[5px] rounded-xl">
            <button
              onClick={() => setActiveTab("account")}
              className={`p-2 w-full text-sm font-semibold transition-colors ${
                activeTab === "account"
                  ? "text-black bg-green-400 rounded-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveTab("card")}
              className={`p-2 w-full text-sm font-semibold transition-colors ${
                activeTab === "card"
                  ? "text-black bg-green-400 rounded-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Card Details
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4 space-y-2">
            {activeTab === "account" && (
              <div className="space-y-2">
                <p>
                  <span className="text-green-400 font-semibold">
                    Username:
                  </span>{" "}
                  {myInfo.username}
                </p>
                <p>
                  <span className="text-green-400 font-semibold">
                    Account Number:
                  </span>{" "}
                  {myInfo.accountNumber}
                </p>
                <p>
                  <span className="text-green-400 font-semibold">
                    Sort Code:
                  </span>{" "}
                  {myInfo.sortCode}
                </p>
              </div>
            )}

            {activeTab === "card" && (
              <div className="bg-gradient-to-r from-green-400 to-cyan-500 aspect-[5/3] p-6 rounded-2xl h-50 space-y-2 shadow-lg flex flex-col justify-between items-end text-black">
                <span className="flex justify-between items-center w-full">
                  <p className="font-semibold">Debit Card</p>
                  <Image
                    src={"/Bank/BankLogoBlack.svg"}
                    alt="Visa Logo"
                    width={120}
                    height={120}
                  />
                </span>
                <p className="text-2xl font-bold mt-6">{cardInfo.number}</p>
                <span className="flex justify-between items-center w-full gap-2">
                  <p>{myInfo.username}</p>
                  <span className="flex gap-2">
                    <p className="text-sm">
                      <span className="font-semibold">Exp:</span>{" "}
                      {cardInfo.expiry}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">CVC:</span> {cardInfo.cvc}
                    </p>
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-green-500/30 backdrop-blur-3xl flex items-center justify-center z-50">
          <div className="bg-neutral-800 text-green-400 text-center p-6 rounded-xl shadow-md w-full max-w-sm space-y-3">
            <h2 className="text-xl font-bold mb-4">Send Money</h2>
            <input
              type="text"
              placeholder="Account Number"
              value={recipientAcc}
              onChange={(e) => setRecipientAcc(e.target.value)}
              onBlur={detectUser}
              className="w-full px-3 py-2 text-green-400 rounded-md bg-black"
            />
            <input
              type="text"
              placeholder="Sort Code"
              value={recipientSort}
              onChange={(e) => setRecipientSort(e.target.value)}
              onBlur={detectUser}
              className="w-full px-3 py-2 text-green-400 rounded-md bg-black"
            />
            {recipientAcc && recipientSort && (
              <p className="text-sm">
                Recipient:{" "}
                <span className="font-semibold">{recipientUser}</span>
              </p>
            )}

            <span className="relative w-full ">
              <p className="absolute transform translate-y-2 translate-x-3">£</p>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-2 py-2 text-green-400 rounded-md bg-black"
              />
            </span>
            <div className="flex justify-between gap-2 pt-5">
              <button
                onClick={handleSend}
                className="flex-1 text-black bg-green-400 px-4 py-2 rounded font-semibold"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-black text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
