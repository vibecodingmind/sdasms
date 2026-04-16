'use client';

import React from 'react';
import { Menu, Search, Bell, ChevronDown, Globe, Sun, Moon, PanelLeftClose, PanelLeft, LogOut, User, Settings, Plus } from 'lucide-react';
import { useCustomer } from './customer-context';
import { useApp } from '@/components/admin/app-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const viewLabels: Record<string, string> = {
  'customer-dashboard': 'Dashboard',
  'account': 'Account',
  'compose-sms': 'Compose SMS',
  'contacts': 'Contacts',
  'contact-groups': 'Contact Groups',
  'sms-history': 'SMS History',
  'sms-templates': 'SMS Templates',
  'sender-ids': 'Sender IDs',
  'billing': 'Billing',
  'support': 'Support',
  'help-center': 'Help Center',
  'settings': 'Settings',
  'campaign-builder': 'Campaign Builder',
  'blacklist': 'Blacklist',
  'automations': 'Automations',
  'developers': 'Developers',
  'reports': 'Reports',
};

export function CustomerHeader() {
  const {
    currentView, sidebarOpen, toggleSidebar, theme, toggleTheme,
    customerUser, setCurrentView,
  } = useCustomer();
  const { logout } = useApp();

  const displayName = customerUser
    ? `${customerUser.first_name} ${customerUser.last_name}`
    : 'Customer';
  const displayEmail = customerUser?.email || 'customer@example.com';
  const initials = customerUser
    ? `${customerUser.first_name.charAt(0)}${customerUser.last_name.charAt(0)}`
    : 'C';

  return (
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
          <span className="text-gray-400 dark:text-gray-500">Customer Panel</span>
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

        {/* SMS Unit Counter + Top Up */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
            SMS UNIT {customerUser?.sms_balance?.toLocaleString() || '0'}
          </span>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-2.5"
            onClick={() => setCurrentView('billing')}
          >
            <Plus className="h-3 w-3 mr-1" />
            Top up
          </Button>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 ml-1 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#D72444] focus-visible:ring-offset-2">
              <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110">
                {customerUser?.avatar && <AvatarImage src={customerUser.avatar} alt={displayName} />}
                <AvatarFallback className="bg-[#D72444] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">
                  {displayName}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Available</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setCurrentView('account')}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setCurrentView('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-900/20"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
