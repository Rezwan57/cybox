import { createContext, useContext, ReactNode } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface DBContextType {
    execute: (sql: string, params?: any[]) => Promise<any>;
}

const DBContext = createContext<DBContextType | undefined>(undefined);

export const DBProvider = ({ children }: { children: ReactNode }) => {
    const execute = async (sql: string, params: any[] = []) => {
        try {
            const result = await invoke('execute_sql', { sql, params });
            return JSON.parse(result as string);
        } catch (error) {
            console.error("Database execution error:", error);
            throw error;
        }
    };

    return (
        <DBContext.Provider value={{ execute }}>
            {children}
        </DBContext.Provider>
    );
};

export const useDB = () => {
    const context = useContext(DBContext);
    if (context === undefined) {
        throw new Error('useDB must be used within a DBProvider');
    }
    return context;
};