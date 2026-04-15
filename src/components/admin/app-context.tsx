'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type ViewId =
  | 'dashboard'
  | 'compose-sms'
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
  | 'theme-customizer'
  | 'sms-templates';

interface RegisterData {
  account_type: 'personal' | 'organization';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  organization_type: string;
  tax_number: string;
  address: string;
  city: string;
  country: string;
  password: string;
  password_confirm: string;
}

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

interface CustomerUser {
  id: number;
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  plan: string;
  sms_balance: number;
  status: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  impersonatedCustomer: CustomerUser | null;
  currentView: ViewId;
  sidebarOpen: boolean;
  expandedMenus: string[];
  theme: 'light' | 'dark';
  authMode: 'login' | 'register';
  login: (email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'facebook' | 'github') => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  setCurrentView: (view: ViewId) => void;
  toggleSidebar: () => void;
  toggleMenu: (menu: string) => void;
  toggleTheme: () => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  loginAsCustomer: (customer: CustomerUser) => void;
  exitImpersonation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Customer', 'Sending']);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [impersonatedCustomer, setImpersonatedCustomer] = useState<CustomerUser | null>(null);

  // Apply dark class to html element on theme change
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        const u = data.user;
        setUser({
          id: u.id,
          uid: u.uid,
          first_name: u.first_name || u.firstName,
          last_name: u.last_name || u.lastName,
          email: u.email,
          is_admin: u.is_admin || u.isAdmin,
          avatar: u.avatar || null,
          status: u.status,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      // Fallback to hardcoded admin if API fails
      if (email === 'admin@admin.com' && password === 'password123') {
        setUser({
          id: 1,
          uid: 'admin-001',
          first_name: 'Super',
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
    }
  }, []);

  const socialLogin = useCallback(async (provider: 'google' | 'facebook' | 'github'): Promise<boolean> => {
    // Mock social login
    setUser({
      id: Date.now(),
      uid: `social-${provider}-${Date.now()}`,
      first_name: provider.charAt(0).toUpperCase() + provider.slice(1),
      last_name: 'User',
      email: `user@${provider}.com`,
      is_admin: false,
      avatar: null,
      status: 'active',
    });
    setIsAuthenticated(true);
    return true;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    // Mock register — accepts any valid data
    if (data.password !== data.password_confirm) return false;
    if (!data.first_name || !data.email || !data.password) return false;
    setUser({
      id: Date.now(),
      uid: `user-${Date.now()}`,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      is_admin: false,
      avatar: null,
      status: 'active',
    });
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setImpersonatedCustomer(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  }, []);

  const loginAsCustomer = useCallback((customer: CustomerUser) => {
    setImpersonatedCustomer(customer);
  }, []);

  const exitImpersonation = useCallback(() => {
    setImpersonatedCustomer(null);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleMenu = useCallback((menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? [] : [menu]
    );
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        impersonatedCustomer,
        currentView,
        sidebarOpen,
        expandedMenus,
        theme,
        authMode,
        login,
        socialLogin,
        register,
        logout,
        setCurrentView,
        toggleSidebar,
        toggleMenu,
        toggleTheme,
        setAuthMode,
        loginAsCustomer,
        exitImpersonation,
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
