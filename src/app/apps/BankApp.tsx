"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAuth, User } from "@/Context/AuthContext";

interface BankAccount {
  id: number;
  user_id: number;
  balance: number;
  account_number: string;
  card_number: string;
  cvc: string;
  expiry_date: string;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  created_at: string;
}

const BankDashboard = () => {
  const { user, logout } = useAuth();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      invoke<BankAccount>("get_bank_details", { userId: user.id })
        .then(setAccount)
        .catch(console.error);

      invoke<Transaction[]>("get_transactions", { userId: user.id })
        .then(setTransactions)
        .catch(console.error);
    }
  }, [user]);

  if (!account) {
    return <div>Loading...</div>; // Or a more sophisticated loading state
  }

  return (
    <div className="w-full text-white px-10 py-5">
      <div className="flex justify-between items-center">
        <Image
          src="/Bank/BankLogo.png"
          alt="Logo"
          width={128}
          height={128}
          className="p-5 w-60"
        />
        <div className="text-right">
          <p className="text-lg">
            Welcome,{" "}
            <span className="font-bold text-primary">{user?.name}</span>
          </p>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex justify-between px-7 py-2">
        <div className="flex flex-col mr-4">
          <p className="text-lg">Account Balance</p>
          <p className="text-4xl font-bold text-primary">
            P {account.balance.toFixed(2)}
          </p>
          <h3 className="text-primary font-semibold mb-2">Account Details</h3>
          <p>Account Number: {account.account_number}</p>
        </div>

        <div className="w-80 flex flex-col justify-start gap-10 bg-gradient-to-tl from-teal-600 to-teal-200 rounded-xl aspect-[75/45] p-5 hover:scale-105 transition-transform duration-600">
          {/* <h3 className="text-primary font-semibold mb-2">Card Details</h3> */}
          <img
            src="/Bank/BankLogoBlack.svg"
            alt="Bank Card"
            className="w-30 h-auto object-cover"
          />
          <div className="flex flex-col gap-1 px-2  text-black text-shadow-black select-text">
            <p className="text-xl font-bold">{account.card_number.match(/.{1,4}/g)?.join(' ')}</p>
            <p className="font-bold">CVC: {account.cvc}</p>
            <p className="font-bold">Exp Date: {account.expiry_date}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="rounded-lg"></div>
      </div>

      <div className="mt-6">
        <h3 className="text-primary font-semibold mb-2">Transaction History</h3>
        <ul className="text-sm max-h-40 overflow-y-auto space-y-1">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className={`flex justify-between ${
                tx.amount < 0 ? "text-red-400" : "text-green-400"
              }`}
            >
              <span>{tx.description}</span>
              <span>
                {tx.amount < 0 ? "-" : "+"}P {Math.abs(tx.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// The Login screen view
const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const user = await invoke<User>("login", { name: username, password });
      login(user); // Set user in global context on success
    } catch (err) {
      setError(typeof err === "string" ? err : "An unknown error occurred");
    }
  };

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
};

// The main BankApp component that decides which view to show
export default function BankApp() {
  const { user } = useAuth();

  return user ? <BankDashboard /> : <LoginScreen />;
}
