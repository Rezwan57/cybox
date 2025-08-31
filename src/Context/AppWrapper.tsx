'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback  } from "react";
import { icons } from '@/data/icons';
import StartingScreen from "../components/Screens/StartingScreen"; // Corrected typo
import { AuthProvider, useAuth, Service } from "./AuthContext";
import { FileSystemProvider } from './FileSystemContext';

interface AppState {
  isOpen: boolean;
  isMinimized: boolean;
}

interface AppContextType {
  points: number;
  setPoints: (points: any) => void;
  apps: Record<string, AppState>;
  openApp: (app: string) => void;
  closeApp: (app: string) => void;
  minimizeApp: (app: string) => void;
  restoreApp: (app: string) => void;
  purchasedServices: Service[];
  refetchTasks?: () => void;
  triggerTaskUpdate: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, purchasedServices } = useAuth();
  const [points, setPoints] = useState(1000);
  const [apps, setApps] = useState<Record<string, AppState>>({
    Console: { isOpen: false, isMinimized: false },
    Files: { isOpen: false, isMinimized: false },
    Mail: { isOpen: false, isMinimized: false },
    Bank: { isOpen: false, isMinimized: false },
    Browser: { isOpen: false, isMinimized: false },
    Settings: { isOpen: false, isMinimized: false },
    WhiteBoard: { isOpen: false, isMinimized: false },
    Task: { isOpen: false, isMinimized: false },
    CybStore: { isOpen: false, isMinimized: false },
    "MD5 Cracker": { isOpen: false, isMinimized: false },
  });

  const openApp = (app: string) => {
    const service = purchasedServices.find(s => s.name === app);
    const isPurchasable = icons.find(i => i.name === app && !i.required);

    if (isPurchasable && !service) {
      // Open the CybStore instead
      setApps((prev) => ({
        ...prev,
        ["CybStore"]: { isOpen: true, isMinimized: false },
      }));
      return;
    }

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

  const [taskUpdateTrigger, setTaskUpdateTrigger] = useState(0);

  const triggerTaskUpdate = useCallback(() => {
    setTaskUpdateTrigger(prev => prev + 1);
  }, []);

  return (
    <AppContext.Provider value={{ points, setPoints, apps, openApp, closeApp, minimizeApp, restoreApp, purchasedServices, refetchTasks: undefined, triggerTaskUpdate }}>
      {children}
    </AppContext.Provider>
  );
}

export default function AppWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [hasShownLoading, setHasShownLoading] = useState(false);

  useEffect(() => {
    const loadingShown = sessionStorage.getItem('loadingShown');
    
    if (loadingShown === 'true') {
      setIsAppLoading(false);
      setHasShownLoading(true);
      return;
    }

    const initializeApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 7000));
        sessionStorage.setItem('loadingShown', 'true');
        setIsAppLoading(false);
        setHasShownLoading(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        sessionStorage.setItem('loadingShown', 'true');
        setIsAppLoading(false);
        setHasShownLoading(true);
      }
    };

    initializeApp();
  }, []);

  if (isAppLoading && !hasShownLoading) {
    return <StartingScreen onFinished={() => setIsAppLoading(false)} />;
  }


  return (
    <AuthProvider>
      <FileSystemProvider>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </FileSystemProvider>
    </AuthProvider>
  );
}