"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Header from "@/components/desktop/header";
import Dock from "@/components/desktop/Dock";
import AppWindow from "@/components/desktop/AppWindow";
import Console from "../../apps/Console";
import FileManager from "../../apps/FileManager";
import EmailApp from "../../apps/EmailApp";
import BankApp from "../../apps/BankApp";
import Browser from "../../apps/Browser/page";
import Settings from "../../apps/Settings";
import TaskApp from "../../apps/TaskApp";
import CybStore from "../../apps/CybStore";
import CrackerApp from "../../apps/CrackerApp";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/Context/AuthContext"; // Import useAuth
import { NotificationProvider } from "@/Context/NotificationContext";
import { AppContext } from "@/Context/AppWrapper";

type AppName = 'Console' | 'Files' | 'Browser' | 'Mail' | 'Settings' | 'WhiteBoard' | 'Bank' | 'Task' | 'CybStore' | 'Cracker';

export default function Home() {
  const { user } = useAuth(); 
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { apps, openApp, closeApp, minimizeApp, restoreApp, windowStack, bringToFront } = appContext;

  const appComponents: { [key: string]: React.ReactNode } = {
    Console: <Console />,
    Files: <FileManager />,
    Mail: <EmailApp />,
    Bank: <BankApp />,
    Browser: <Browser />,
    Settings: <Settings />,
    Task: <TaskApp />,
    CybStore: <CybStore />,
    "MD5 Cracker": <CrackerApp />,
  };

  return (
    <NotificationProvider>
      <div
        className="fixed inset-0 flex items-start justify-center min-h-screen font-[family-name:var(--font-geist-sans)] overflow-hidden"
        style={{
          backgroundImage: `url(/wallpaper/Wallpaper.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          overflow: "hidden",
        }}
      >

        <main className="absolute inset-0 flex min-h-screen flex-col items-center justify-between p-2">
          <Header />
          <Dock
            onAppClick={openApp}
            openApps={Object.keys(apps).filter(
              (app) => apps[app as AppName].isOpen
            )}
          />

          {/* Render App Windows */}
          {Object.entries(apps).map(([appName, appState]) =>
            appState.isOpen && (
              <AppWindow
                key={appName}
                title={appName}
                isMinimized={appState.isMinimized}
                onClose={() => closeApp(appName)}
                onMinimize={() => minimizeApp(appName)}
                onMaximize={() => restoreApp(appName)}
                onFocus={() => bringToFront(appName)}
                zIndex={40 + windowStack.indexOf(appName)}
              >
                {appComponents[appName]}
              </AppWindow>
            )
          )}
        </main>
      </div>
    </NotificationProvider>
  );
}
