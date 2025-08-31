"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { FiBell, FiWifi, FiVolume2, FiSettings, FiLock } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { IoPower } from "react-icons/io5";
import Calendar from "react-calendar";
import { useAuth } from "../../Context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [time, setTime] = useState(moment().format("h:mm a"));
  const [showCalendar, setShowCalendar] = useState(false);
  const [appWindow, setAppWindow] = useState(null);
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format("h:mm A, dddd D MM YYYY"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ("__TAURI_IPC__" in window) {
      console.log("Running in Tauri");
      import("@tauri-apps/api/window").then(({ appWindow }) => {
        setAppWindow(appWindow);
      });
    } else {
      console.warn("Not running inside Tauri.");
    }
  }, []);

  // const handleFullScreen = async () => {
  //   if (!appWindow) {
  //     console.warn("Tauri appWindow not available.");
  //     return;
  //   }

  //   try {
  //     const currentState = await appWindow.isFullscreen();
  //     console.log("Current fullscreen:", currentState);
  //     await appWindow.setFullscreen(!currentState);
  //     setIsFullScreen(!currentState);
  //   } catch (error) {
  //     console.error("Failed to toggle fullscreen:", error);
  //   }
  // };

  const handleShowCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const togglePowerMenu = () => {
    setShowPowerMenu(!showPowerMenu);
  };

  return (
    <header className="header flex justify-between">
      <div>
        <h1>Dashboard</h1>
      </div>

      <span
          className="text-sm bg-opacity-p rounded-sm px-2 cursor-pointer"
          onClick={handleShowCalendar}
        >
          {time}
          {showCalendar && (
            <div className="absolute top-8 left-0 bg-black border border-primary w-auto">
              <Calendar className="h-full w-full bg-opacity-p backdrop-blur" />
            </div>
          )}
        </span>

      <div className="relative flex items-center gap-4">
        <span className="flex items-center gap-[5px] text-sm text-primary">
          <FaUserAlt className="text-[12px]"/> {user?.name || 'Guest'}
        </span>

        {/* <button onClick={handleFullScreen} className="cursor-pointer">
          {isFullScreen ? <BiExitFullscreen /> : <BiFullscreen />}
        </button> */}

        <div className="relative">
          <IoPower onClick={togglePowerMenu} className="cursor-pointer" />
          {showPowerMenu && (
            <div className="absolute right-0 mt-2 bg-black border-primary backdrop-blur-3xl rounded-xl shadow-lg w-50 p-1">
              <button onClick={logout} className="w-full text-left rounded-md block px-4 py-2 text-sm text-teal-400 hover:bg-teal-900">
                Logout
              </button>
              <button className="w-full text-left rounded-md block px-4 py-2 text-sm text-teal-400 hover:bg-teal-900 mt-1">
                Quit
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;