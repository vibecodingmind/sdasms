'use client';

import React from 'react';
import { Menu, Search, Bell, ChevronDown, Globe } from 'lucide-react';
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
  const { currentView, sidebarOpen, toggleSidebar } = useApp();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden lg:flex items-center gap-2 text-sm">
          <span className="text-gray-400">Admin Panel</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium">{viewLabels[currentView] || 'Dashboard'}</span>
        </div>
        <div className="lg:hidden text-sm font-medium text-gray-800">
          {viewLabels[currentView] || 'Dashboard'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-40 lg:w-56"
          />
        </div>

        {/* Notification */}
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* Language */}
        <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-gray-500 hover:text-gray-700 text-xs">
          <Globe className="h-4 w-4" />
          <span>EN</span>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-xs font-semibold">
            SA
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">Super Admin</p>
            <p className="text-[11px] text-gray-400">admin@admin.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
