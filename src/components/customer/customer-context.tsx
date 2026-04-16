'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { UserRole, RoleMeta, canAccessCustomerView } from '@/lib/rbac';

export type CustomerViewId =
  | 'customer-dashboard'
  | 'account'
  | 'compose-sms'
  | 'contacts'
  | 'contact-groups'
  | 'all-messages'
  | 'sms-history'
  | 'sms-templates'
  | 'sender-ids'
  | 'billing'
  | 'support'
  | 'help-center'
  | 'settings'
  | 'campaign-builder'
  | 'campaigns'
  | 'blacklist'
  | 'automations'
  | 'developers'
  | 'reports'
  | 'team';

interface CustomerUserData {
  id: number;
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  plan: string;
  sms_balance: number;
  status: string;
  avatar: string | null;
  role: UserRole;
  parentCustomerId?: number; // for sub-users
}

interface CustomerContextType {
  customerUser: CustomerUserData | null;
  currentView: CustomerViewId;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  setCurrentView: (view: CustomerViewId) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  // RBAC additions
  canAccessView: (viewId: CustomerViewId) => boolean;
  getRoleMeta: () => { label: string; description: string; color: string };
  isOwner: () => boolean;
  canManageTeam: () => boolean;
  canManageBilling: () => boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({
  children,
  user,
  theme: inheritedTheme,
  toggleTheme: inheritedToggleTheme,
}: {
  children: ReactNode;
  user: { id: number; uid: string; first_name: string; last_name: string; email: string; is_admin: boolean; avatar: string | null; status: string; sms_balance?: number; plan?: string; phone?: string; role?: UserRole } | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}) {
  const [currentView, setCurrentView] = useState<CustomerViewId>('customer-dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const customerUser: CustomerUserData | null = user ? {
    id: user.id,
    uid: user.uid,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone || '',
    plan: user.plan || 'Starter',
    sms_balance: user.sms_balance || 0,
    status: user.status,
    avatar: user.avatar,
    role: user.role || 'customer_owner',
  } : null;

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // RBAC: Check if current customer role can access a view
  const canAccessView = useCallback((viewId: CustomerViewId): boolean => {
    if (!customerUser) return false;
    return canAccessCustomerView(customerUser.role, viewId);
  }, [customerUser]);

  const getRoleMeta = useCallback(() => {
    if (!customerUser) return RoleMeta['customer_member'];
    return RoleMeta[customerUser.role] || RoleMeta['customer_member'];
  }, [customerUser]);

  const isOwner = useCallback(() => {
    return customerUser?.role === 'customer_owner';
  }, [customerUser]);

  const canManageTeam = useCallback(() => {
    return customerUser?.role === 'customer_owner' || customerUser?.role === 'customer_admin';
  }, [customerUser]);

  const canManageBilling = useCallback(() => {
    return customerUser?.role === 'customer_owner';
  }, [customerUser]);

  return (
    <CustomerContext.Provider
      value={{
        customerUser,
        currentView,
        sidebarOpen,
        theme: inheritedTheme,
        setCurrentView,
        toggleSidebar,
        toggleTheme: inheritedToggleTheme,
        canAccessView,
        getRoleMeta,
        isOwner,
        canManageTeam,
        canManageBilling,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
