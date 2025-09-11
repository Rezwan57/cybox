'use client';
import React, { useState } from "react";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/core";
import { useAuth, User } from "@/Context/AuthContext";
import Home from "./Home/page"; // Import the Home component

// The Login Form Component
const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const user = await invoke<User>("login", { 
        name: username.trim(), 
        password: password 
      });
      login(user);
    } catch (err) {
      console.error("Login error:", err);
      setError(typeof err === 'string' ? err : "Incorrect username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-no-repeat bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/wallpaper/Wallpaper.png"
          alt="Background"
          fill
          className="object-cover blur-3xl opacity-50"
          priority
        />
      </div>
      <div className="relative z-10 w-full max-w-md px-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-8 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
            <p className="text-gray-300">Sign in to your Cybox</p>
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-primary/50 px-4 py-3 rounded-full bg-black/40 text-white text-lg placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-primary/50 px-4 py-3 rounded-full bg-black/40 text-white text-lg placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-3 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            <button 
              type="button" 
              onClick={() => window.location.href = '/create-account'}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Page() {
  const { user } = useAuth();

  return <>{user ? <Home /> : <LoginForm />}</>;
}
