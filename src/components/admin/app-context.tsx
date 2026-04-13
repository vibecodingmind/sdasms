'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ViewId =
  | 'dashboard'
  | 'customers'
  | 'subscription'
  | 'announcements'
  | 'plans'
  | 'currencies'
  | 'tax-setting'
  | 'sending-servers'
  | 'sender-id'
  | 'blacklist'
  | 'spam-words'
  | 'blocked-sender-id'
  | 'administrators'
  | 'admin-roles'
  | 'all-settings'
  | 'countries'
  | 'ai-setting'
  | 'language'
  | 'payment-gateways'
  | 'email-templates'
  | 'terms-of-use'
  | 'privacy-policy'
  | 'maintenance-mode'
  | 'update-application'
  | 'report-dashboard'
  | 'sms-history'
  | 'campaigns-report'
  | 'invoices'
  | 'theme-customizer';

interface AdminUser {
  id: number;
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  avatar: string | null;
  status: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  currentView: ViewId;
  sidebarOpen: boolean;
  expandedMenus: string[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentView: (view: ViewId) => void;
  toggleSidebar: () => void;
  toggleMenu: (menu: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Customer']);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Instant mock auth — no network delay
    if (email === 'admin@admin.com' && password === 'password123') {
      setUser({
        id: 1,
        uid: 'admin-001',
        first_name: 'Godlisten',
        last_name: 'Admin',
        email: 'admin@admin.com',
        is_admin: true,
        avatar: null,
        status: 'active',
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleMenu = useCallback((menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? [] : [menu]
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        currentView,
        sidebarOpen,
        expandedMenus,
        login,
        logout,
        setCurrentView,
        toggleSidebar,
        toggleMenu,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
