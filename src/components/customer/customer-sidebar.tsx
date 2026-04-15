'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Send,
  Users,
  FolderOpen,
  Clock,
  FileText,
  Hash,
  CreditCard,
  Settings,
  X,
  LogOut,
} from 'lucide-react';
import { useCustomer, type CustomerViewId } from './customer-context';
import { useApp } from '@/components/admin/app-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  view: CustomerViewId;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, view: 'customer-dashboard' },
  { label: 'Compose SMS', icon: <Send className="h-4 w-4" />, view: 'compose-sms' },
  { label: 'Contacts', icon: <Users className="h-4 w-4" />, view: 'contacts' },
  { label: 'Contact Groups', icon: <FolderOpen className="h-4 w-4" />, view: 'contact-groups' },
  { label: 'SMS History', icon: <Clock className="h-4 w-4" />, view: 'sms-history' },
  { label: 'SMS Templates', icon: <FileText className="h-4 w-4" />, view: 'sms-templates' },
  { label: 'Sender IDs', icon: <Hash className="h-4 w-4" />, view: 'sender-ids' },
  { label: 'Billing', icon: <CreditCard className="h-4 w-4" />, view: 'billing' },
  { label: 'Settings', icon: <Settings className="h-4 w-4" />, view: 'settings' },
];

export function CustomerSidebar() {
  const { currentView, sidebarOpen, setCurrentView, toggleSidebar, customerUser } = useCustomer();
  const { logout } = useApp();

  const displayName = customerUser
    ? `${customerUser.first_name} ${customerUser.last_name}`
    : 'Customer';
  const initials = customerUser
    ? `${customerUser.first_name.charAt(0)}${customerUser.last_name.charAt(0)}`
    : 'C';

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-200"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full border-r flex flex-col transition-all duration-300 ease-in-out',
          'bg-[#F3F4F6] dark:bg-gray-900 border-gray-200 dark:border-gray-700',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16',
          'lg:relative lg:z-auto'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {sidebarOpen ? (
              <Image src="/logo.png" alt="SDASMS" width={140} height={28} className="h-7 w-auto object-contain shrink-0" />
            ) : (
              <Image src="/logo.png" alt="SDASMS" width={32} height={32} className="w-8 h-8 object-contain rounded-lg shrink-0" />
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="ml-auto lg:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-150"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const active = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer',
                    'transition-all duration-200 ease-out',
                    active
                      ? 'bg-[#D72444] text-white shadow-sm shadow-[#D72444]/25 dark:shadow-[#D72444]/40'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800',
                    !sidebarOpen && 'lg:justify-center lg:px-0'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <span className={cn(
                    active ? 'text-white' : 'text-gray-500 dark:text-gray-400',
                    'shrink-0 transition-transform duration-200',
                    active && 'scale-110'
                  )}>
                    {item.icon}
                  </span>
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User profile pinned to bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="h-9 w-9 shrink-0">
                {customerUser?.avatar && <AvatarImage src={customerUser.avatar} alt={displayName} />}
                <AvatarFallback className="bg-[#D72444] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{displayName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Customer</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150 hover:scale-110 hover:rotate-12"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-8 w-8">
                {customerUser?.avatar && <AvatarImage src={customerUser.avatar} alt={displayName} />}
                <AvatarFallback className="bg-[#D72444] text-white text-[10px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={logout}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
