'use client';
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

const BankDashboard = () => {
  const { user, logout } = useAuth();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState([
    { id: 1, to: "Store", amount: 75.00 },
    { id: 2, to: "Task Rewards", amount: -25.00 }, // Negative for incoming
  ]);

  useEffect(() => {
    if (user) {
      invoke<BankAccount>('get_bank_details', { userId: user.id })
        .then(setAccount)
        .catch(console.error);

      // invoke('get_transactions', { userId: user.id })
      //   .then(setTransactions)
      //   .catch(console.error); 
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
            <p className="text-lg">Welcome, <span className="font-bold text-primary">{user?.name}</span></p>
            <button onClick={logout} className="text-sm text-gray-400 hover:text-white">Logout</button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg">Account Balance</p>
        <p className="text-4xl font-bold text-primary">P {account.balance.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="text-primary font-semibold mb-2">Account Details</h3>
          <p>Account Number: {account.account_number}</p>
        </div>
        <div>
          <h3 className="text-primary font-semibold mb-2">Card Details</h3>
          <p>Card Number: {account.card_number}</p>
          <p>CVC: {account.cvc}</p>
          <p>Expiry Date: {account.expiry_date}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-primary font-semibold mb-2">Transaction History</h3>
        <ul className="text-sm max-h-40 overflow-y-auto space-y-1">
          {transactions.map((tx) => (
            <li key={tx.id} className={tx.amount > 0 ? 'text-red-400' : 'text-green-400'}>
              {tx.amount > 0 ? "Sent" : "Received"} P {Math.abs(tx.amount).toFixed(2)} {tx.amount > 0 ? "to" : "from"} {tx.to}
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
      setError(typeof err === 'string' ? err : "An unknown error occurred");
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

