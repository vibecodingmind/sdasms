'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type ViewType = 'dashboard' | 'campaigns' | 'contacts' | 'groups' | 'templates' | 'sending-servers' | 'sms-routes' | 'sender-ids' | 'reports' | 'billing' | 'settings';

export interface User {
  id: number;
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  smsUnit: number;
  isAdmin: boolean;
  isCustomer: boolean;
  avatar?: string | null;
  dltEntityId?: string | null;
  dltTelemarketerId?: string | null;
  timezone?: string | null;
  createdAt?: string | Date;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentView: ViewType;
  sidebarOpen: boolean;
  setCurrentView: (view: ViewType) => void;
  setSidebarOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
    setCurrentView('dashboard');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        currentView,
        sidebarOpen,
        setCurrentView,
        setSidebarOpen,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
