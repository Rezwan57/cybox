"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/core";

export default function Page() {
  const router = useRouter();

  const [deviceName, setDeviceName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!deviceName.trim()) {
      setError("Please enter a device name");
      return;
    }

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username.trim())) {
      setError("Username can only contain letters, numbers, hyphens, and underscores");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await invoke("create_account", { 
        request: {
          device_name: deviceName.trim(),
          name: username.trim(),
          password: password
        }
      });

      setSuccess("Account created successfully!");
      

      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (error) {
      console.error("Account creation error:", error);
      
      if (typeof error === 'string') {
        if (error.includes('Duplicate entry') || error.includes('unique')) {
          setError("Username already exists. Please choose a different username.");
        } else if (error.includes('connection')) {
          setError("Database connection error. Please try again later.");
        } else {
          setError(`Error: ${error}`);
        }
      } else {
        setError("An unexpected error occurred while creating your account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (isLoading) return;
    router.push("/");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-no-repeat bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/wallpaper/wallpaper.png"
          alt="Background"
          fill
          className="object-cover blur-3xl opacity-50"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 p-8 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Get start your Cyber Experience</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Device Name (e.g., My Laptop)"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full border-2 border-primary/50 px-4 py-3 rounded-full bg-black/40 text-white text-lg placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              disabled={isLoading}
              maxLength={50}
              autoComplete="off"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Username (letters, numbers, -, _)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-primary/50 px-4 py-3 rounded-full bg-black/40 text-white text-lg placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              disabled={isLoading}
              maxLength={30}
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-primary/50 px-4 py-3 rounded-full bg-black/40 text-white text-lg placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-2 border-primary/50 px-4 py-3 rounded-full bg-black/40 text-white text-lg placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button 
              type="submit" 
              disabled={isLoading || !!success}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-3 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : success ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Account Created!
                </div>
              ) : (
                "Create Account"
              )}
            </button>
            
            <button 
              type="button" 
              onClick={handleBack}
              disabled={isLoading}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
