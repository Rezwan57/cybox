"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/desktop/header";
import Dock from "@/components/desktop/Dock";
import AppWindow from "@/components/desktop/AppWindow";
import Console from "../../apps/Console";
import FileManager from "../../apps/FileManager";
// import Mail from "../../apps/Mail";
// import Browser from "../../apps/Browser";
// import Settings from "../../apps/Settings";
// import Whiteboard from "../../apps/Whiteboard";
import { AnimatePresence } from "framer-motion";

type AppName = 'Console' | 'File Manager' | 'Browser' | 'Mail' | 'Settings' | 'Whiteboard'


interface AppState {
  isOpen: boolean;
  isMinimized: boolean;
}

export default function Home() {
  const [apps, setApps] = useState<Record<string, AppState>>({
    Console: { isOpen: false, isMinimized: false },
    "File Manager": { isOpen: false, isMinimized: false },
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

        {/* Add more apps here */}
      </main>
    </div>
  );
}
