'use client';

import { useState, useEffect, createContext, useContext } from "react";
import StartingScreen from "../components/Screens/StartingScreen"; // Corrected typo
import { AuthProvider } from "./AuthContext";

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
    // Corrected the onFinished handler and the component name
    return <StartingScreen onFinished={() => setIsAppLoading(false)} />;
  }

  return (
    <AuthProvider>
      <AppContext.Provider value={{ points, setPoints }}>
        {children}
      </AppContext.Provider>
    </AuthProvider>
  );
}