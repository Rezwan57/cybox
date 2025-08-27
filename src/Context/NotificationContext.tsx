'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationState {
  isOpen: boolean;
  message: string;
  points: number | null;
  onAction: (() => void) | null;
}

interface NotificationContextType {
  showNotification: (message: string, points: number, onAction: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: '',
    points: null,
    onAction: null,
  });

  const showNotification = (message: string, points: number, onAction: () => void) => {
    setNotification({ isOpen: true, message, points, onAction });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }));
    }, 5000);
  };

  const handleAction = () => {
    if (notification.onAction) {
      notification.onAction();
    }
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification.isOpen && (
        <div 
          className="fixed top-12 right-2 bg-neutral-950/20 backdrop-blur-md border border-teal-400 text-white p-4 rounded-lg shadow-lg cursor-pointer z-50"
          onClick={handleAction}
        >
          <p className="font-bold">{notification.message}</p>
          {notification.points && <p>You earned {notification.points} points!</p>}
          <p className="text-sm text-gray-400">Click to open Bank App</p>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
