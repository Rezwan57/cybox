"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/core";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    
    // Validation
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }
    
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    
    try {
      const isVerified = await invoke("verify_user", { 
        name: username.trim(), 
        password: password 
      });
      
      if (isVerified) {
        localStorage.setItem("currentUser", username.trim());
        router.push("/Home");
      } else {
        setError("Incorrect username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(`Authentication failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push('/create-account');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-no-repeat bg-cover bg-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/wallpaper/wallpaper.png"
          alt="Background"
          fill
          className="object-cover blur-3xl opacity-50"
          priority
        />
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md px-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 p-8 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Username Input */}
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

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-primary/50 px-4 py-3 rounded-full bg-black/40 text-white text-lg placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-3 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            
            <button 
              type="button" 
              onClick={handleCreateAccount}
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-3 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Create New Account
            </button>
          </div>

          {/* Additional Options */}
          <div className="text-center mt-2">
            <button
              type="button"
              className="text-primary hover:text-primary/80 text-sm underline transition-colors duration-200"
              onClick={() => {
                // Add forgot password functionality here
                alert("Forgot password functionality to be implemented");
              }}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
