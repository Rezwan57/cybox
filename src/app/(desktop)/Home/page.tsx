"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/desktop/header";
import Dock from "@/components/desktop/Dock";
import AppWindow from "@/components/desktop/AppWindow";
import Console from "../../apps/Console";
import FileManager from "../../apps/FileManager";
import EmailApp from "../../apps/EmailApp";
import BankApp from "../../apps/BankApp";
// import Browser from "../../apps/Browser";
import Settings from "../../apps/Settings";
import WhiteBoard from "../../apps/WhiteBoard";
import { AnimatePresence } from "framer-motion";

type AppName = 'Console' | 'File Manager' | 'Browser' | 'Mail' | 'Settings' | 'WhiteBoard' | 'Bank';


interface AppState {
  isOpen: boolean;
  isMinimized: boolean;
}

export default function Home() {
  const [apps, setApps] = useState<Record<string, AppState>>({
    Console: { isOpen: false, isMinimized: false },
    "File Manager": { isOpen: false, isMinimized: false },
    Mail: { isOpen: false, isMinimized: false },
    Bank: { isOpen: false, isMinimized: false },
    // Browser: { isOpen: false, isMinimized: false },
    Settings: { isOpen: false, isMinimized: false },
    WhiteBoard: { isOpen: false, isMinimized: false },
  });

  const openApp = (app: string) => {
    setApps((prev) => ({
      ...prev,
      [app]: { isOpen: true, isMinimized: false },
    }));
  };

  const closeApp = (app: string) => {
    setApps((prev) => ({
      ...prev,
      [app]: { ...prev[app], isOpen: false },
    }));
  };

  const minimizeApp = (app: string) => {
    setApps((prev) => ({
      ...prev,
      [app]: { ...prev[app], isMinimized: true },
    }));
  };

  const restoreApp = (app: string) => {
    setApps((prev) => ({
      ...prev,
      [app]: { ...prev[app], isMinimized: false },
    }));
  };
const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

// useEffect(() => {
//   const disableContextMenu = (e: MouseEvent) => e.preventDefault();
//   window.addEventListener('contextmenu', disableContextMenu);
//   return () => window.removeEventListener('contextmenu', disableContextMenu);
// }, []);

// const handleRightClick = (e: React.MouseEvent) => {
//   e.preventDefault();
//   setContextMenu({ x: e.clientX, y: e.clientY });
// };

// const closeMenu = () => {
//   setContextMenu(null);
// };

  return (
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

        {apps["File Manager"].isOpen && (
          <AppWindow
            title="File Manager"
            isMinimized={apps["File Manager"].isMinimized}
            onClose={() => closeApp("File Manager")}
            onMinimize={() => minimizeApp("File Manager")}
            onMaximize={() => restoreApp("File Manager")}
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

        {/* {apps["Browser"].isOpen && (
          <AppWindow
            title="Browser"
            isMinimized={apps["Browser"].isMinimized}
            onClose={() => closeApp("Browser")}
            onMinimize={() => minimizeApp("Browser")}
            onMaximize={() => restoreApp("Browser")}
          >
            <Browser />
          </AppWindow>
        )} */}

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

        {apps["WhiteBoard"].isOpen && (
          <AppWindow
            title="WhiteBoard"
            isMinimized={apps["WhiteBoard"].isMinimized}
            onClose={() => closeApp("WhiteBoard")}
            onMinimize={() => minimizeApp("WhiteBoard")}
            onMaximize={() => restoreApp("WhiteBoard")}
          >
            <WhiteBoard />
          </AppWindow>
        )}
      </main>
    </div>
  );
}
