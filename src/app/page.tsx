'use client';

import React from 'react';
import { AppProvider, useApp } from '@/components/admin/app-context';
import { LoginPage } from '@/components/admin/login-page';
import { RegisterPage } from '@/components/admin/register-page';
import { AppShell, AdminLoader } from '@/components/admin/app-shell';

function AppContent() {
  const { isAuthenticated, isLoading, authMode } = useApp();

  if (isLoading) {
    return <AdminLoader />;
  }

  if (!isAuthenticated) {
    return authMode === 'register' ? <RegisterPage /> : <LoginPage />;
  }

  return <AppShell />;
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
