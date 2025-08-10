'use client';

import { useState, useEffect, createContext, useContext } from "react";
import StaringScreen from "../components/Screens/StartingScreen";
import { DBProvider } from "./DBContext"; // Import DBProvider

export const AppContext = createContext({ points: 0, setPoints: (points: any) => {} });

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [hasShownLoading, setHasShownLoading] = useState(false);
  const [points, setPoints] = useState(1000);

  useEffect(() => {
    // Check if loading has been shown before in this session
    const loadingShown = sessionStorage.getItem('loadingShown');
    
    if (loadingShown === 'true') {
      // Skip loading animation if already shown
      setIsAppLoading(false);
      setHasShownLoading(true);
      return;
    }

    // App initialization logic - only run if loading hasn't been shown
    const initializeApp = async () => {
      try {
        // Add any Tauri initialization here if needed
        // await invoke('init_app');
        
        // Minimum loading time for animation (7 seconds)
        await new Promise(resolve => setTimeout(resolve, 7000));
        
        // Mark loading as shown for this session
        sessionStorage.setItem('loadingShown', 'true');
        setIsAppLoading(false);
        setHasShownLoading(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        // Show app anyway after error
        sessionStorage.setItem('loadingShown', 'true');
        setIsAppLoading(false);
        setHasShownLoading(true);
      }
    };

    initializeApp();
  }, []);

  // Show loading animation only if it hasn't been shown before
  if (isAppLoading && !hasShownLoading) {
    return <StaringScreen onFinished={function (): void {
      throw new Error("Function not implemented.");
    } } />;
  }

  return (
    <DBProvider>
      <AppContext.Provider value={{ points, setPoints }}>
        {children}
      </AppContext.Provider>
    </DBProvider>
  );
}