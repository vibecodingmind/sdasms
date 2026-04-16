'use client';

import React from 'react';
import { AppProvider, useApp } from '@/components/admin/app-context';
import { LoginPage } from '@/components/admin/login-page';
import { RegisterPage } from '@/components/admin/register-page';
import { AppShell, AdminLoader } from '@/components/admin/app-shell';
import { CustomerProvider } from '@/components/customer/customer-context';
import { CustomerShell, CustomerLoader } from '@/components/customer/customer-shell';

function AppContent() {
  const { isAuthenticated, isLoading, authMode, user, theme, toggleTheme, impersonatedCustomer } = useApp();

  if (isLoading) {
    return <AdminLoader />;
  }

  if (!isAuthenticated) {
    return authMode === 'register' ? <RegisterPage /> : <LoginPage />;
  }

  // If admin is impersonating a customer, show customer shell
  if (impersonatedCustomer) {
    const impersonatedUser = {
      id: impersonatedCustomer.id,
      uid: impersonatedCustomer.uid,
      first_name: impersonatedCustomer.first_name,
      last_name: impersonatedCustomer.last_name,
      email: impersonatedCustomer.email,
      is_admin: false,
      avatar: null,
      status: impersonatedCustomer.status || 'active',
      role: 'customer_owner' as const,
      phone: impersonatedCustomer.phone || '',
      plan: impersonatedCustomer.plan || '',
      sms_balance: impersonatedCustomer.sms_balance || 0,
    };
    return (
      <CustomerProvider user={impersonatedUser} theme={theme} toggleTheme={toggleTheme}>
        <CustomerShell />
      </CustomerProvider>
    );
  }

  // Route based on user role
  if (user?.is_admin) {
    return <AppShell />;
  }

  // Customer panel — inherit theme and toggle from AppContext
  return (
    <CustomerProvider user={user} theme={theme} toggleTheme={toggleTheme}>
      <CustomerShell />
    </CustomerProvider>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
