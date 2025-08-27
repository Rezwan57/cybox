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
import Browser from "../../apps/Browser";
import Settings from "../../apps/Settings";
import WhiteBoard from "../../apps/WhiteBoard";
import TaskApp from "../../apps/TaskApp";
import CybStore from "../../apps/CybStore";
import CrackerApp from "../../apps/CrackerApp";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/Context/AuthContext"; // Import useAuth
import { NotificationProvider } from "@/Context/NotificationContext";
import { AppContext } from "@/Context/AppWrapper";

type AppName = 'Console' | 'Files' | 'Browser' | 'Mail' | 'Settings' | 'WhiteBoard' | 'Bank' | 'Task' | 'CybStore' | 'Cracker';

export default function Home() {
  const { user } = useAuth(); // Get the user from the context
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null; // or a loading spinner
  }

  const { apps, openApp, closeApp, minimizeApp, restoreApp } = appContext;

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
          {apps["Console"].isOpen && (
            <AppWindow
              title="Console"
              isMinimized={apps["Console"].isMinimized}
              onClose={() => closeApp("Console")}
              onMinimize={() => minimizeApp("Console")}
              onMaximize={() => restoreApp("Console")}
            >
              <Console />
            </AppWindow>
          )}

          {apps["Files"].isOpen && (
            <AppWindow
              title="Files"
              isMinimized={apps["Files"].isMinimized}
              onClose={() => closeApp("Files")}
              onMinimize={() => minimizeApp("Files")}
              onMaximize={() => restoreApp("Files")}
            >
              <FileManager />
            </AppWindow>
          )}

          {apps["Mail"].isOpen && (
            <AppWindow
              title="Mail"
              isMinimized={apps["Mail"].isMinimized}
              onClose={() => closeApp("Mail")}
              onMinimize={() => minimizeApp("Mail")}
              onMaximize={() => restoreApp("Mail")}
            >
              <EmailApp />
            </AppWindow>
          )}

          {apps["Bank"].isOpen && (
            <AppWindow
              title="Bank"
              isMinimized={apps["Bank"].isMinimized}
              onClose={() => closeApp("Bank")}
              onMinimize={() => minimizeApp("Bank")}
              onMaximize={() => restoreApp("Bank")}
            >
              <BankApp />
            </AppWindow>
          )}

          {apps["Browser"].isOpen && (
            <AppWindow
              title="Browser"
              isMinimized={apps["Browser"].isMinimized}
              onClose={() => closeApp("Browser")}
              onMinimize={() => minimizeApp("Browser")}
              onMaximize={() => restoreApp("Browser")}
            >
              <Browser />
            </AppWindow>
          )}

          {apps["Settings"].isOpen && (
            <AppWindow
              title="Settings"
              isMinimized={apps["Settings"].isMinimized}
              onClose={() => closeApp("Settings")}
              onMinimize={() => minimizeApp("Settings")}
              onMaximize={() => restoreApp("Settings")}
            >
              <Settings />
            </AppWindow>
          )}

          

          {apps["Task"].isOpen && (
            <AppWindow
              title="Task"
              isMinimized={apps["Task"].isMinimized}
              onClose={() => closeApp("Task")}
              onMinimize={() => minimizeApp("Task")}
              onMaximize={() => restoreApp("Task")}
            >
              <TaskApp />
            </AppWindow>
          )}

          {apps["CybStore"].isOpen && (
          <AppWindow
            title="CybStore"
            isMinimized={apps["CybStore"].isMinimized}
            onClose={() => closeApp("CybStore")}
            onMinimize={() => minimizeApp("CybStore")}
            onMaximize={() => restoreApp("CybStore")}
          >
            <CybStore />
          </AppWindow>
        )}

        {apps["MD5 Cracker"].isOpen && (
          <AppWindow
            title="MD5 Cracker"
            isMinimized={apps["MD5 Cracker"].isMinimized}
            onClose={() => closeApp("MD5 Cracker")}
            onMinimize={() => minimizeApp("MD5 Cracker")}
            onMaximize={() => restoreApp("MD5 Cracker")}
          >
            <CrackerApp />
          </AppWindow>
        )}
        </main>
      </div>
    </NotificationProvider>
  );
}
