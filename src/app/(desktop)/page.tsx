"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === "admin" && password === "admin") {
      router.push("/Home");
    } else {
      alert("Incorrect username or password");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-no-repeat bg-cover bg-center">
      <img
        src="/wallpaper/wallpaper.jpg"
        alt="Logo"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-screen w-screen blur-md"
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 rounded-3xl  transform-gpu"
      >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-primary px-4 py-2 rounded-full bg-black/40 text-xl"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-primary px-4 py-2 rounded-full bg-black/40 text-xl"
          />
        <button type="submit" className="bg-primary text-black px-4 py-2 rounded-full cursor-pointer">Submit</button>
      </form>
    </div>
  );
}

