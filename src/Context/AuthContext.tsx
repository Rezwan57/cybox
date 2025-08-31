'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface User {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  features: string | null;
  icon_path: string | null;
  version: string | null;
  developer: string | null;
  release_date: string | null;
  is_important: boolean | null;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  purchasedServices: Service[];
  purchaseService: (service: Service) => Promise<void>;
  fetchPurchasedServices: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [purchasedServices, setPurchasedServices] = useState<Service[]>([]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setPurchasedServices([]); 
  };

  const fetchPurchasedServices = useCallback(async () => {
    if (user) {
      try {
        const serviceIds = await invoke<number[]>('get_user_services', { userId: user.id });
        const allServices = await invoke<Service[]>('get_all_services');
        const userServices = allServices.filter(s => serviceIds.includes(s.id));
        setPurchasedServices(userServices);
      } catch (error) {
        console.error("Failed to fetch purchased services:", error);
      }
    }
  }, [user]);

  const purchaseService = async (service: Service) => {
    if (!user || service.price === null) {
      throw new Error("User not logged in or service has no price.");
    }
    try {
      await invoke('purchase_service', {
        userId: user.id,
        serviceId: service.id,
        price: service.price,
      });
      // Add the newly purchased service to the list
      setPurchasedServices(prev => [...prev, service]);
    } catch (error) {
      console.error("Purchase failed:", error);
      throw error; // Re-throw to be caught in the component
    }
  };
  
  // Fetch services when user logs in
  useEffect(() => {
    if (user) {
      fetchPurchasedServices();
    }
  }, [user, fetchPurchasedServices]);

  const value = { 
    user, 
    login, 
    logout, 
    purchasedServices, 
    purchaseService,
    fetchPurchasedServices 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
