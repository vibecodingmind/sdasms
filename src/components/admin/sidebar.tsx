'use client';

import React from 'react';
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
  ChevronRight,
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
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-[#F3F4F6] border-r border-gray-200 flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16',
          'lg:relative lg:z-auto'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-gray-800 text-lg tracking-tight whitespace-nowrap">
                SMSPro
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="ml-auto lg:hidden p-1 rounded hover:bg-gray-200"
          >
            <X className="h-5 w-5 text-gray-500" />
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
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer',
                      active
                        ? 'bg-[#6366F1] text-white'
                        : 'text-gray-700 hover:bg-gray-200/70',
                      !sidebarOpen && 'lg:justify-center lg:px-0'
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <span className={cn(active ? 'text-white' : 'text-gray-500', 'shrink-0')}>
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
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer',
                        parentActive && !expanded
                          ? 'text-[#6366F1]'
                          : expanded
                            ? 'text-gray-800'
                            : 'text-gray-700 hover:bg-gray-200/70',
                        !sidebarOpen && 'lg:justify-center lg:px-0'
                      )}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <span className={cn(
                        parentActive || expanded ? 'text-[#6366F1]' : 'text-gray-500',
                        'shrink-0'
                      )}>
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          <span className="shrink-0 text-gray-400">
                            {expanded ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5" />
                            )}
                          </span>
                        </>
                      )}
                    </button>
                    {sidebarOpen && expanded && (
                      <div className="ml-3 mt-0.5 space-y-0.5">
                        {item.children.map((child) => {
                          const childActive = isActive(child.view);
                          return (
                            <button
                              key={child.view}
                              onClick={() => setCurrentView(child.view)}
                              className={cn(
                                'w-full flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer',
                                childActive
                                  ? 'bg-[#6366F1] text-white'
                                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                              )}
                            >
                              <span className="shrink-0">{child.icon}</span>
                              <span className="truncate">{child.label}</span>
                            </button>
                          );
                        })}
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
          <div className="border-t border-gray-200 p-3 shrink-0">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">Super Admin</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[11px] text-gray-500">Available</span>
                </div>
              </div>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
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
