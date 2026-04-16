'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Send,
  Users,
  Hash,
  FileText,
  Ban,
  Zap,
  BarChart3,
  Code2,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
  Rocket,
  MessageSquare,
  List,
  UsersRound,
  UserCircle,
  CreditCard,
  LifeBuoy,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { useCustomer, type CustomerViewId } from './customer-context';
import { useApp } from '@/components/admin/app-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// ==================== NAVIGATION DATA ====================

interface ChildItem {
  label: string;
  icon: LucideIcon;
  view: CustomerViewId;
  badge?: number;
}

interface NavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  view?: CustomerViewId; // parent itself is a view (optional)
  children?: ChildItem[];
  badge?: number;
}

const navGroups: NavGroup[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'customer-dashboard' },
  {
    id: 'sms',
    label: 'SMS',
    icon: Send,
    children: [
      { label: 'Quick Send', icon: Rocket, view: 'compose-sms' },
      { label: 'Campaign Builder', icon: Zap, view: 'campaign-builder' },
      { label: 'All Messages', icon: MessageSquare, view: 'all-messages' },
      { label: 'Campaigns', icon: List, view: 'campaigns' },
    ],
  },
  { id: 'contacts', label: 'Contacts', icon: Users, view: 'contacts' },
  {
    id: 'sending',
    label: 'Sending',
    icon: Hash,
    children: [
      { label: 'Sender IDs', icon: Hash, view: 'sender-ids' },
      { label: 'SMS Templates', icon: FileText, view: 'sms-templates' },
    ],
  },
  { id: 'blacklist', label: 'Blacklist', icon: Ban, view: 'blacklist' },
  { id: 'automations', label: 'Automations', icon: Zap, view: 'automations' },
  { id: 'developers', label: 'Developers', icon: Code2, view: 'developers' },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    view: 'reports',
  },
  { id: 'billing', label: 'Billing', icon: CreditCard, view: 'billing' },
  { id: 'team', label: 'Team', icon: UsersRound, view: 'team' },
  { id: 'account', label: 'Account', icon: UserCircle, view: 'account' },
  {
    id: 'support',
    label: 'Support',
    icon: LifeBuoy,
    children: [
      { label: 'Support Tickets', icon: LifeBuoy, view: 'support' },
      { label: 'Help Center', icon: BookOpen, view: 'help-center' },
    ],
  },
];

// ==================== SIDEBAR COMPONENT ====================

export function CustomerSidebar() {
  const { currentView, sidebarOpen, setCurrentView, toggleSidebar, customerUser, canAccessView, getRoleMeta } = useCustomer();
  const { logout } = useApp();

  const roleMeta = getRoleMeta();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const group of navGroups) {
      if (group.children) {
        if (group.children.some((child) => child.view === currentView)) {
          initial.add(group.id);
        }
      }
    }
    return initial;
  });

  const displayName = customerUser
    ? `${customerUser.first_name} ${customerUser.last_name}`
    : 'Customer';
  const initials = customerUser
    ? `${customerUser.first_name.charAt(0)}${customerUser.last_name.charAt(0)}`
    : 'C';

  // Filter nav groups based on role permissions
  const filteredNavGroups = navGroups
    .map((group) => {
      if (group.view && !group.children) {
        return canAccessView(group.view) ? group : null;
      }
      if (group.children) {
        const accessibleChildren = group.children.filter((child) => canAccessView(child.view));
        return accessibleChildren.length > 0 ? { ...group, children: accessibleChildren } : null;
      }
      return group;
    })
    .filter(Boolean) as typeof navGroups;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleGroupClick = (group: NavGroup) => {
    if (group.children) {
      toggleGroup(group.id);
      // If the parent group itself is also a view, navigate to it
      if (group.view) {
        setCurrentView(group.view);
      }
    } else if (group.view) {
      setCurrentView(group.view);
    }
  };

  const handleChildClick = (view: CustomerViewId) => {
    setCurrentView(view);
  };

  const isGroupActive = (group: NavGroup) => {
    if (group.view && currentView === group.view) return true;
    if (group.children) {
      return group.children.some((child) => child.view === currentView);
    }
    return false;
  };

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
        {/* Logo - keep as-is */}
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
            {filteredNavGroups.map((group) => {
              const active = isGroupActive(group);
              const hasChildren = !!group.children;
              const isExpanded = expandedGroups.has(group.id);
              const isChildActive = group.children?.some((c) => c.view === currentView);

              return (
                <div key={group.id}>
                  {/* Group / Parent button */}
                  <button
                    onClick={() => handleGroupClick(group)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer',
                      'transition-all duration-200 ease-out',
                      active && !isChildActive
                        ? 'bg-[#D72444] text-white shadow-sm shadow-[#D72444]/25 dark:shadow-[#D72444]/40'
                        : isChildActive
                          ? 'bg-[#D72444]/10 text-[#D72444] dark:bg-[#D72444]/20 dark:text-[#D72444]'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800',
                      !sidebarOpen && 'lg:justify-center lg:px-0'
                    )}
                    title={!sidebarOpen ? group.label : undefined}
                  >
                    <span className={cn(
                      'shrink-0 transition-transform duration-200',
                      active && !isChildActive && 'scale-110'
                    )}>
                      <group.icon className={cn(
                        'h-4 w-4',
                        active && !isChildActive ? 'text-white' : isChildActive ? 'text-[#D72444] dark:text-[#D72444]' : 'text-gray-500 dark:text-gray-400'
                      )} />
                    </span>
                    {sidebarOpen && (
                      <>
                        <span className={cn(
                          'truncate flex-1 text-left',
                          isChildActive && 'font-semibold'
                        )}>
                          {group.label}
                        </span>
                        {group.badge != null && (
                          <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[#D72444] text-white text-[10px] font-bold">
                            {group.badge}
                          </span>
                        )}
                        {hasChildren && (
                          <span className="shrink-0 transition-transform duration-200">
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </button>

                  {/* Children */}
                  {hasChildren && isExpanded && sidebarOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-200 dark:border-gray-700 pl-3">
                      {group.children!.map((child) => {
                        const childActive = currentView === child.view;
                        return (
                          <button
                            key={child.view}
                            onClick={() => handleChildClick(child.view)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer',
                              'transition-all duration-200 ease-out',
                              childActive
                                ? 'bg-[#D72444] text-white shadow-sm shadow-[#D72444]/25 dark:shadow-[#D72444]/40'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
                            )}
                            title={child.label}
                          >
                            <span className={cn(
                              'shrink-0 transition-transform duration-200',
                              childActive && 'scale-110'
                            )}>
                              <child.icon className={cn(
                                'h-3.5 w-3.5',
                                childActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                              )} />
                            </span>
                            <span className="truncate flex-1 text-left">{child.label}</span>
                            {child.badge != null && (
                              <span className="flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-[#D72444]/15 text-[#D72444] text-[10px] font-bold">
                                {child.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* User profile pinned to bottom - keep as-is */}
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
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${roleMeta.color}`}>{roleMeta.label}</span>
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
              <Avatar className="h-8 h-8">
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
