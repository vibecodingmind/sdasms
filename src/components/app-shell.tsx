'use client';

import { useApp, type ViewType } from '@/components/app-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Send,
  Users,
  FolderOpen,
  FileText,
  Server,
  Route,
  Tag,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  Bell,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { DashboardView } from '@/components/views/dashboard-view';
import { CampaignsView } from '@/components/views/campaigns-view';
import { ContactsView } from '@/components/views/contacts-view';
import { GroupsView } from '@/components/views/groups-view';
import { TemplatesView } from '@/components/views/templates-view';
import { SendingServersView } from '@/components/views/sending-servers-view';
import { SmsRoutesView } from '@/components/views/sms-routes-view';
import { SenderIdsView } from '@/components/views/sender-ids-view';
import { ReportsView } from '@/components/views/reports-view';
import { BillingView } from '@/components/views/billing-view';
import { SettingsView } from '@/components/views/settings-view';
import Image from 'next/image';

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campaigns', icon: Send },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'groups', label: 'Groups', icon: FolderOpen },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'sending-servers', label: 'Sending Servers', icon: Server },
  { id: 'sms-routes', label: 'SMS Routes', icon: Route },
  { id: 'sender-ids', label: 'Sender IDs', icon: Tag },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function SidebarContent({ collapsed, onNavigate, currentView }: { collapsed: boolean; onNavigate: (v: ViewType) => void; currentView: ViewType }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/10">
          <Image src="/logo.png" alt="SMSPro" width={36} height={36} className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="text-base font-bold text-white truncate">SMSPro</h2>
            <p className="text-[10px] text-slate-400 truncate">Multi-Channel Platform</p>
          </div>
        )}
      </div>

      <Separator className="bg-white/5" />

      {/* Nav Items */}
      <ScrollArea className="flex-1 py-2 px-2">
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom */}
      <div className="p-3 border-t border-white/5">
        {!collapsed && (
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg p-3 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-300">Pro Tips</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Use DLT templates for Indian SMS delivery compliance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppShell() {
  const { user, currentView, setCurrentView, sidebarOpen, setSidebarOpen, logout } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'campaigns': return <CampaignsView />;
      case 'contacts': return <ContactsView />;
      case 'groups': return <GroupsView />;
      case 'templates': return <TemplatesView />;
      case 'sending-servers': return <SendingServersView />;
      case 'sms-routes': return <SmsRoutesView />;
      case 'sender-ids': return <SenderIdsView />;
      case 'reports': return <ReportsView />;
      case 'billing': return <BillingView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  const currentNav = navItems.find(n => n.id === currentView);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 border-r border-white/5 transition-all duration-300 flex-shrink-0 ${
          sidebarOpen ? 'w-60' : 'w-[68px]'
        }`}
      >
        <SidebarContent collapsed={!sidebarOpen} onNavigate={setCurrentView} currentView={currentView} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b bg-white border-slate-200 flex items-center justify-between px-4 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0 bg-slate-900 border-white/5">
                <SidebarContent collapsed={false} onNavigate={(v) => { setCurrentView(v); }} currentView={currentView} />
              </SheetContent>
            </Sheet>

            {/* Collapse sidebar (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </Button>

            <h1 className="text-sm font-semibold text-slate-800">
              {currentNav?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* SMS Balance */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                {(user?.smsUnit || 0).toLocaleString()} credits
              </span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4.5 w-4.5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {user?.firstName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                    <span className="text-xs text-slate-500">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentView('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
