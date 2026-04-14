'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Package,
  DollarSign,
  Settings,
  Server,
  Hash,
  Shield,
  Ban,
  FileText,
  UserCog,
  ShieldCheck,
  Globe,
  Cpu,
  Languages,
  Wallet,
  Mail,
  FileCheck,
  Lock,
  Wrench,
  BarChart3,
  Clock,
  Megaphone,
  Receipt,
  Palette,
  ChevronDown,
  MessageSquare,
  AlertTriangle,
  X,
  LogOut,
  Send,
} from 'lucide-react';
import { useApp, type ViewId } from './app-context';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  view?: ViewId;
  children?: { label: string; view: ViewId; icon: React.ReactNode }[];
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, view: 'dashboard' },
  {
    label: 'Customer',
    icon: <Users className="h-4 w-4" />,
    children: [
      { label: 'Customers', view: 'customers', icon: <Users className="h-3.5 w-3.5" /> },
      { label: 'Subscription', view: 'subscription', icon: <CreditCard className="h-3.5 w-3.5" /> },
      { label: 'Announcements', view: 'announcements', icon: <Bell className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Plan',
    icon: <Package className="h-4 w-4" />,
    children: [
      { label: 'Plans', view: 'plans', icon: <Package className="h-3.5 w-3.5" /> },
      { label: 'Currencies', view: 'currencies', icon: <DollarSign className="h-3.5 w-3.5" /> },
      { label: 'Tax Setting', view: 'tax-setting', icon: <Settings className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Sending',
    icon: <Send className="h-4 w-4" />,
    children: [
      { label: 'Sending Servers', view: 'sending-servers', icon: <Server className="h-3.5 w-3.5" /> },
      { label: 'Sender ID', view: 'sender-id', icon: <Hash className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Security',
    icon: <Shield className="h-4 w-4" />,
    children: [
      { label: 'Blacklist', view: 'blacklist', icon: <Ban className="h-3.5 w-3.5" /> },
      { label: 'Spam Words', view: 'spam-words', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
      { label: 'Blocked Sender ID', view: 'blocked-sender-id', icon: <Ban className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Administrator',
    icon: <UserCog className="h-4 w-4" />,
    children: [
      { label: 'Administrators', view: 'administrators', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
      { label: 'Admin Roles', view: 'admin-roles', icon: <UserCog className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Setting',
    icon: <Settings className="h-4 w-4" />,
    children: [
      { label: 'All Settings', view: 'all-settings', icon: <Settings className="h-3.5 w-3.5" /> },
      { label: 'Countries', view: 'countries', icon: <Globe className="h-3.5 w-3.5" /> },
      { label: 'AI Setting', view: 'ai-setting', icon: <Cpu className="h-3.5 w-3.5" /> },
      { label: 'Language', view: 'language', icon: <Languages className="h-3.5 w-3.5" /> },
      { label: 'Payment Gateways', view: 'payment-gateways', icon: <Wallet className="h-3.5 w-3.5" /> },
      { label: 'Email Templates', view: 'email-templates', icon: <Mail className="h-3.5 w-3.5" /> },
      { label: 'Terms of Use', view: 'terms-of-use', icon: <FileCheck className="h-3.5 w-3.5" /> },
      { label: 'Privacy Policy', view: 'privacy-policy', icon: <Lock className="h-3.5 w-3.5" /> },
      { label: 'Maintenance Mode', view: 'maintenance-mode', icon: <Wrench className="h-3.5 w-3.5" /> },
      { label: 'Update Application', view: 'update-application', icon: <FileText className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Report',
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      { label: 'Dashboard', view: 'report-dashboard', icon: <BarChart3 className="h-3.5 w-3.5" /> },
      { label: 'SMS History', view: 'sms-history', icon: <Clock className="h-3.5 w-3.5" /> },
      { label: 'Campaigns', view: 'campaigns-report', icon: <Megaphone className="h-3.5 w-3.5" /> },
    ],
  },
  { label: 'Invoices', icon: <Receipt className="h-4 w-4" />, view: 'invoices' },
  { label: 'Theme Customizer', icon: <Palette className="h-4 w-4" />, view: 'theme-customizer' },
];

export function Sidebar() {
  const { currentView, sidebarOpen, expandedMenus, setCurrentView, toggleSidebar, toggleMenu } = useApp();

  const isActive = (view?: ViewId) => currentView === view;
  const isParentActive = (children?: { view: ViewId }[]) =>
    children ? children.some((c) => c.view === currentView) : false;

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
              if (item.view && !item.children) {
                const active = isActive(item.view);
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
                    <span className={cn(active ? 'text-white' : 'text-gray-500 dark:text-gray-400', 'shrink-0 transition-transform duration-200', active && 'scale-110')}>
                      {item.icon}
                    </span>
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </button>
                );
              }

              if (item.children) {
                const expanded = expandedMenus.includes(item.label);
                const parentActive = isParentActive(item.children);
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        toggleMenu(item.label);
                        if (!sidebarOpen) {
                          toggleSidebar();
                        }
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer',
                        'transition-all duration-200 ease-out',
                        parentActive && !expanded
                          ? 'text-[#D72444]'
                          : expanded
                            ? 'text-gray-800 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800',
                        !sidebarOpen && 'lg:justify-center lg:px-0'
                      )}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <span className={cn(
                        parentActive || expanded ? 'text-[#D72444]' : 'text-gray-500 dark:text-gray-400',
                        'shrink-0 transition-transform duration-200',
                        expanded && 'scale-110'
                      )}>
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          <span className={cn(
                            'shrink-0 transition-transform duration-300 ease-out',
                            expanded ? 'rotate-0' : '-rotate-90',
                            parentActive || expanded ? 'text-[#D72444]' : 'text-gray-400 dark:text-gray-500'
                          )}>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </span>
                        </>
                      )}
                    </button>
                    {/* Animated submenu using CSS grid trick */}
                    {sidebarOpen && (
                      <div
                        className="grid transition-[grid-template-rows] duration-250 ease-out"
                        style={{
                          gridTemplateRows: expanded ? '1fr' : '0fr',
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="ml-3 mt-0.5 space-y-0.5 py-0.5">
                            {item.children.map((child, idx) => {
                              const childActive = isActive(child.view);
                              return (
                                <button
                                  key={child.view}
                                  onClick={() => setCurrentView(child.view)}
                                  className={cn(
                                    'w-full flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-md text-[12px] font-medium cursor-pointer',
                                    'transition-all duration-200 ease-out',
                                    childActive
                                      ? 'bg-[#D72444] text-white shadow-sm shadow-[#D72444]/20 dark:shadow-[#D72444]/40'
                                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800',
                                    expanded
                                      ? 'opacity-100 translate-x-0'
                                      : 'opacity-0 -translate-x-2'
                                  )}
                                  style={{
                                    transitionDelay: expanded ? `${idx * 40}ms` : '0ms',
                                  }}
                                >
                                  <span className="shrink-0">{child.icon}</span>
                                  <span className="truncate">{child.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </nav>

        {/* User profile at bottom */}
        {sidebarOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 shrink-0">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-[#D72444] flex items-center justify-center text-white text-xs font-semibold shrink-0 transition-transform duration-200 hover:scale-110">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">Super Admin</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Available</span>
                </div>
              </div>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-150 hover:scale-110 hover:rotate-12"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
