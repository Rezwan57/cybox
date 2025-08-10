'use client'
import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "@/Context/AppWrapper";
import { useDB } from "@/Context/DBContext";

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
  const { points, setPoints } = useContext(AppContext);
  const { execute } = useDB();
  const [showPopup, setShowPopup] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("account");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dbData, setDbData] = useState<any>(null);

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

  const handleLogin = () => {
    if (username === "' OR '1'='1" && password === "' OR '1'='1") {
      setLoggedIn(true);
      setError("");
      return;
    }

    if (username === myInfo.username && password === "password") {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const detectUser = () => {
    const found = fakeAccounts.find(
      (acc) =>
        acc.accountNumber === recipientAcc && acc.sortCode === recipientSort
    );
    setRecipientUser(found ? found.username : "Unknown");
  };

  const handleSend = () => {
    const amt = parseFloat(amount);
    if (recipientUser === "Unknown" || isNaN(amt) || amt <= 0 || amt > points)
      return;

    setPoints((p: number) => p - amt);
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

  const createSampleUser = async () => {
    try {
      await execute("INSERT INTO accounts (name, balance) VALUES (?, ?)", ["Test User", 1000]);
      alert("Sample user created!");
    } catch (error) {
      console.error("Failed to create sample user:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const data = await execute("SELECT * FROM accounts");
      setDbData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  if (!loggedIn) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="bg-neutral-900/80 p-8 w-2/5 lg:1/5 rounded-xl shadow-lg text-center">
          <Image
            src="/Bank/BankLogo.png"
            alt="Logo"
            width={128}
            height={128}
            className="p-5 w-60 mx-auto"
          />
          <h1 className="text-md font-bold mb-4">Login to CyberBank</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 text-primary rounded-md bg-black mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-primary rounded-md bg-black mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-primary text-black px-4 py-2 rounded hover:opacity-90"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

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
          <span className="flex gap-2 text-4xl font-bold ">
            <p className="points text-white">P</p>
            <p className="text-primary">{points.toFixed(2)}</p>
          </span>

          <button
            onClick={() => setShowPopup(true)}
            className="max-w-xs w-full mt-6 bg-primary text-black px-4 py-2 rounded hover:opacity-90"
          >
            Send Money
          </button>

          
        </div>

        {/* Tabs */}
        <div className="mb-4 w-1/2">
          <div className="flex bg-neutral-800 p-[5px] rounded-xl">
            <button
              onClick={() => setActiveTab("account")}
              className={`p-2 w-full text-sm font-semibold transition-colors ${
                activeTab === "account"
                  ? "text-black bg-primary rounded-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveTab("card")}
              className={`p-2 w-full text-sm font-semibold transition-colors ${
                activeTab === "card"
                  ? "text-black bg-primary rounded-md"
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
                  <span className="text-primary font-semibold">
                    Username:
                  </span>{" "}
                  {myInfo.username}
                </p>
                <p>
                  <span className="text-primary font-semibold">
                    Account Number:
                  </span>{" "}
                  {myInfo.accountNumber}
                </p>
                <p>
                  <span className="text-primary font-semibold">
                    Sort Code:
                  </span>{" "}
                  {myInfo.sortCode}
                </p>
              </div>
            )}

            {activeTab === "card" && (
              <div className="bg-gradient-to-r from-primary to-cyan-500 aspect-[5/3] p-6 rounded-2xl h-50 space-y-2 shadow-lg flex flex-col justify-between items-end text-black">
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
          <div className="bg-neutral-800 text-primary text-center p-6 rounded-xl shadow-md w-full max-w-sm space-y-3">
            <h2 className="text-xl font-bold mb-4">Send Money</h2>
            <input
              type="text"
              placeholder="Account Number"
              value={recipientAcc}
              onChange={(e) => setRecipientAcc(e.target.value)}
              onBlur={detectUser}
              className="w-full px-3 py-2 text-primary rounded-md bg-black"
            />
            <input
              type="text"
              placeholder="Sort Code"
              value={recipientSort}
              onChange={(e) => setRecipientSort(e.target.value)}
              onBlur={detectUser}
              className="w-full px-3 py-2 text-primary rounded-md bg-black"
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
                className="w-full pl-8 pr-2 py-2 text-primary rounded-md bg-black"
              />
            </span>
            <div className="flex justify-between gap-2 pt-5">
              <button
                onClick={handleSend}
                className="flex-1 text-black bg-primary px-4 py-2 rounded font-semibold"
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

      {/* Transactions */}
          <div className="mt-6">
            <h3 className="text-primary font-semibold mb-2">
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
  );
}

