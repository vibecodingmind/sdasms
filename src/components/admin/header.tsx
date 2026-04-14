'use client';

import React from 'react';
import { Menu, Search, Bell, ChevronDown, Globe, Sun, Moon, PanelLeftClose, PanelLeft, LogOut, UserCheck, ShieldAlert } from 'lucide-react';
import { useApp } from './app-context';
import { Button } from '@/components/ui/button';

const viewLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  subscription: 'Subscriptions',
  announcements: 'Announcements',
  plans: 'Plans',
  currencies: 'Currencies',
  'tax-setting': 'Tax Setting',
  'sending-servers': 'Sending Servers',
  'sender-id': 'Sender ID',
  blacklist: 'Blacklist',
  'spam-words': 'Spam Words',
  'blocked-sender-id': 'Blocked Sender ID',
  administrators: 'Administrators',
  'admin-roles': 'Admin Roles',
  'all-settings': 'All Settings',
  countries: 'Countries',
  'ai-setting': 'AI Setting',
  language: 'Language',
  'payment-gateways': 'Payment Gateways',
  'email-templates': 'Email Templates',
  'terms-of-use': 'Terms of Use',
  'privacy-policy': 'Privacy Policy',
  'maintenance-mode': 'Maintenance Mode',
  'update-application': 'Update Application',
  'report-dashboard': 'Report Dashboard',
  'sms-history': 'SMS History',
  'campaigns-report': 'Campaigns',
  invoices: 'Invoices',
  'theme-customizer': 'Theme Customizer',
};

export function Header() {
  const {
    currentView, sidebarOpen, toggleSidebar, theme, toggleTheme,
    impersonatedCustomer, exitImpersonation, user
  } = useApp();

  const displayName = impersonatedCustomer
    ? `${impersonatedCustomer.first_name} ${impersonatedCustomer.last_name}`
    : `${user?.first_name || 'Super'} ${user?.last_name || 'Admin'}`;

  const displayEmail = impersonatedCustomer?.email || user?.email || 'admin@admin.com';

  const initials = impersonatedCustomer
    ? `${impersonatedCustomer.first_name.charAt(0)}${impersonatedCustomer.last_name.charAt(0)}`
    : 'SA';

  const avatarBg = impersonatedCustomer ? 'bg-orange-500' : 'bg-[#6366F1]';

  return (
    <>
      {/* Impersonation Banner */}
      {impersonatedCustomer && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-700/50 px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-800/60">
              <UserCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-amber-800 dark:text-amber-200 font-medium">Viewing as customer:</span>
              <span className="text-amber-900 dark:text-amber-100 font-semibold">
                {impersonatedCustomer.first_name} {impersonatedCustomer.last_name}
              </span>
              <span className="text-amber-600 dark:text-amber-400 hidden sm:inline">
                ({impersonatedCustomer.email})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-800/40 px-2 py-1 rounded-full">
              <ShieldAlert className="h-3 w-3" />
              {impersonatedCustomer.plan} Plan
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={exitImpersonation}
              className="bg-amber-100 dark:bg-amber-800/40 border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-700/50 text-xs gap-1.5 shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
              Exit Impersonation
            </Button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 lg:hidden transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop sidebar collapse toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <span className="text-gray-400 dark:text-gray-500">
              {impersonatedCustomer ? 'Customer Panel' : 'Admin Panel'}
            </span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-800 dark:text-gray-100 font-medium">{viewLabels[currentView] || 'Dashboard'}</span>
          </div>
          <div className="lg:hidden text-sm font-medium text-gray-800 dark:text-gray-100">
            {viewLabels[currentView] || 'Dashboard'}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 transition-colors duration-200">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none w-40 lg:w-56"
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:scale-110 active:scale-95"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <span className="relative block w-5 h-5">
              <Sun className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
              <Moon className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
            </span>
          </button>

          {/* Notification */}
          <Button variant="ghost" size="icon" className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Language */}
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs">
            <Globe className="h-4 w-4" />
            <span>EN</span>
            <ChevronDown className="h-3 w-3" />
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-2 ml-1">
            <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center text-white text-xs font-semibold transition-all duration-300 hover:scale-110`}>
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{displayEmail}</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
