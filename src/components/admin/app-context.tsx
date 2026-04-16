'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { UserRole, RoleMeta, canAccessAdminView, canImpersonate } from '@/lib/rbac';
import type { AuthSession } from '@/lib/auth-helpers';

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
  | 'sms-templates'
  | 'support-tickets'
  | 'help-center';

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
  role: UserRole;
  roles?: string[];
  // Customer-specific fields (optional, used for customer role)
  phone?: string;
  plan?: string;
  sms_balance?: number;
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
  // RBAC additions
  canAccessView: (viewId: ViewId) => boolean;
  canImpersonateCustomers: () => boolean;
  getRoleMeta: () => { label: string; description: string; color: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==================== SESSION STORAGE KEY ====================
const SESSION_KEY = 'sdasms_session';

function saveSession(user: AdminUser) {
  if (typeof window === 'undefined') return;
  try {
    const session = {
      userId: user.id,
      uid: user.uid,
      email: user.email,
      is_admin: user.is_admin,
      role: user.role,
      roles: user.roles || [],
      savedAt: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage may be unavailable
  }
}

function loadSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Session expires after 24 hours
    if (Date.now() - session.savedAt > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return {
      id: session.userId,
      uid: session.uid,
      email: session.email,
      first_name: '',
      last_name: '',
      is_admin: session.is_admin,
      avatar: null,
      status: 'active',
      role: session.role || (session.is_admin ? 'admin' : 'customer_owner'),
      roles: session.roles || [],
    };
  } catch {
    return null;
  }
}

function clearSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// ==================== MAP EMAIL → ROLE (for demo users) ====================
const emailRoleMap: Record<string, UserRole> = {
  'admin@admin.com': 'super_admin',
  'support@admin.com': 'support_admin',
  'billing@admin.com': 'billing_admin',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Customer', 'Sending']);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [impersonatedCustomer, setImpersonatedCustomer] = useState<CustomerUser | null>(null);

  // Restore session on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setUser(saved);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

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
        const role: UserRole = emailRoleMap[email] || (u.is_admin ? 'admin' : 'customer_owner');
        const fullUser: AdminUser = {
          id: u.id,
          uid: u.uid,
          first_name: u.first_name || u.firstName,
          last_name: u.last_name || u.lastName,
          email: u.email,
          is_admin: u.is_admin || u.isAdmin,
          avatar: u.avatar || null,
          status: u.status,
          role,
          roles: u.roles || [role],
          phone: u.phone || undefined,
          plan: u.plan || undefined,
          sms_balance: u.sms_balance ?? undefined,
        };
        setUser(fullUser);
        setIsAuthenticated(true);
        saveSession(fullUser);
        return true;
      }
      return false;
    } catch {
      // Fallback to hardcoded demo users
      const demoUsers: Record<string, { pw: string; user: AdminUser }> = {
        'admin@admin.com': {
          pw: 'password123',
          user: { id: 1, uid: 'admin-001', first_name: 'Super', last_name: 'Admin', email: 'admin@admin.com', is_admin: true, avatar: null, status: 'active', role: 'super_admin', roles: ['super_admin'] },
        },
        'support@admin.com': {
          pw: 'password123',
          user: { id: 2, uid: 'admin-002', first_name: 'Support', last_name: 'Manager', email: 'support@admin.com', is_admin: true, avatar: null, status: 'active', role: 'support_admin', roles: ['support_admin'] },
        },
        'billing@admin.com': {
          pw: 'password123',
          user: { id: 3, uid: 'admin-003', first_name: 'Billing', last_name: 'Admin', email: 'billing@admin.com', is_admin: true, avatar: null, status: 'active', role: 'billing_admin', roles: ['billing_admin'] },
        },
        'john@acmecorp.com': {
          pw: 'customer123',
          user: { id: 10, uid: 'c-001', first_name: 'John', last_name: 'Smith', email: 'john@acmecorp.com', is_admin: false, avatar: null, status: 'active', role: 'customer_owner', phone: '+1 555-0101', plan: 'Enterprise', sms_balance: 45000 },
        },
        'sarah@globaltech.com': {
          pw: 'customer123',
          user: { id: 11, uid: 'c-002', first_name: 'Sarah', last_name: 'Johnson', email: 'sarah@globaltech.com', is_admin: false, avatar: null, status: 'active', role: 'customer_owner', phone: '+1 555-0102', plan: 'Business', sms_balance: 22000 },
        },
        'emma@euromail.com': {
          pw: 'customer123',
          user: { id: 12, uid: 'c-003', first_name: 'Emma', last_name: 'Williams', email: 'emma@euromail.com', is_admin: false, avatar: null, status: 'active', role: 'customer_admin', phone: '+44 7700-0401', plan: 'Enterprise', sms_balance: 67000 },
        },
      };

      const demo = demoUsers[email];
      if (demo && demo.pw === password) {
        setUser(demo.user);
        setIsAuthenticated(true);
        saveSession(demo.user);
        return true;
      }
      return false;
    }
  }, []);

  const socialLogin = useCallback(async (provider: 'google' | 'facebook' | 'github'): Promise<boolean> => {
    const newUser: AdminUser = {
      id: Date.now(),
      uid: `social-${provider}-${Date.now()}`,
      first_name: provider.charAt(0).toUpperCase() + provider.slice(1),
      last_name: 'User',
      email: `user@${provider}.com`,
      is_admin: false,
      avatar: null,
      status: 'active',
      role: 'customer_owner',
    };
    setUser(newUser);
    setIsAuthenticated(true);
    saveSession(newUser);
    return true;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    if (data.password !== data.password_confirm) return false;
    if (!data.first_name || !data.email || !data.password) return false;

    const newUser: AdminUser = {
      id: Date.now(),
      uid: `user-${Date.now()}`,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      is_admin: false,
      avatar: null,
      status: 'active',
      role: 'customer_owner',
      phone: data.phone,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    saveSession(newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setImpersonatedCustomer(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    clearSession();
  }, []);

  const loginAsCustomer = useCallback((customer: CustomerUser) => {
    if (!canImpersonate(user?.role || 'viewer')) return;
    setImpersonatedCustomer(customer);
  }, [user]);

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

  // RBAC: Check if current user role can access a view
  const canAccessView = useCallback((viewId: ViewId): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return canAccessAdminView(user.role, viewId);
  }, [user]);

  const canImpersonateCustomers = useCallback((): boolean => {
    if (!user) return false;
    return canImpersonate(user.role);
  }, [user]);

  const getRoleMeta = useCallback(() => {
    if (!user) return RoleMeta['viewer'];
    return RoleMeta[user.role] || RoleMeta['viewer'];
  }, [user]);

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
        canAccessView,
        canImpersonateCustomers,
        getRoleMeta,
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
