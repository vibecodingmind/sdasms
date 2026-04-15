'use client';

import React from 'react';
import { AppProvider, useApp } from '@/components/admin/app-context';
import { LoginPage } from '@/components/admin/login-page';
import { RegisterPage } from '@/components/admin/register-page';
import { AppShell, AdminLoader } from '@/components/admin/app-shell';
import { CustomerProvider } from '@/components/customer/customer-context';
import { CustomerShell, CustomerLoader } from '@/components/customer/customer-shell';

function AppContent() {
  const { isAuthenticated, isLoading, authMode, user, theme, toggleTheme } = useApp();

  if (isLoading) {
    return <AdminLoader />;
  }

  if (!isAuthenticated) {
    return authMode === 'register' ? <RegisterPage /> : <LoginPage />;
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
