'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppProvider, useApp } from '@/components/admin/app-context';
import { LoginPage } from '@/components/admin/login-page';
import { RegisterPage } from '@/components/admin/register-page';
import { AppShell, AdminLoader } from '@/components/admin/app-shell';
import { CustomerProvider } from '@/components/customer/customer-context';
import { CustomerShell, CustomerLoader } from '@/components/customer/customer-shell';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

// ==================== ERROR BOUNDARY ====================
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Something went wrong</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                An unexpected error occurred. This has been logged for review.
                Please try refreshing the page.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex justify-center gap-3">
              <Button
                onClick={this.handleReset}
                className="bg-[#D72444] hover:bg-[#C01E3A] text-white gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==================== APP CONTENT ====================
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
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
