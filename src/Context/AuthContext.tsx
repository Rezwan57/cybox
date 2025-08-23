'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the user object
export interface User {
  id: number;
  name: string;
  // You can add other non-sensitive user data here
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // *** ADDED FOR DEBUGGING ***
  useEffect(() => {
    console.log('[AuthContext] User state changed:', user);
  }, [user]);


  const login = (userData: User) => {
    console.log('[AuthContext] Calling login with user:', userData);
    setUser(userData);
  };

  const logout = () => {
    console.log('[AuthContext] Calling logout.');
    setUser(null);
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy context consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
