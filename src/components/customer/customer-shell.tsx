'use client';

import React from 'react';
import { Send, Users, Clock, Hash, FileText, CreditCard, Settings, LayoutDashboard, FolderOpen, Loader2, LifeBuoy, BookOpen, UserCircle, Ban, Zap, Code2, BarChart3, Rocket, Construction, MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCustomer, type CustomerViewId } from './customer-context';
import { CustomerSidebar } from './customer-sidebar';
import { CustomerHeader } from './customer-header';

// ==================== VIEW METADATA ====================
interface ViewMeta {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const viewMeta: Record<CustomerViewId, ViewMeta> = {
  'customer-dashboard': { title: 'Dashboard', description: 'Overview of your SMS activity', icon: <LayoutDashboard className="h-5 w-5" /> },
  'account': { title: 'Account', description: 'Manage your account settings and profile', icon: <UserCircle className="h-5 w-5" /> },
  'compose-sms': { title: 'Compose SMS', description: 'Send SMS messages to your contacts', icon: <Send className="h-5 w-5" /> },
  'contacts': { title: 'Contacts', description: 'Manage your contact list', icon: <Users className="h-5 w-5" /> },
  'contact-groups': { title: 'Contact Groups', description: 'Organize contacts into groups', icon: <FolderOpen className="h-5 w-5" /> },
  'all-messages': { title: 'All Messages', description: 'View all SMS messages with advanced filters', icon: <MessageSquare className="h-5 w-5" /> },
  'sms-history': { title: 'SMS History', description: 'View SMS delivery history', icon: <Clock className="h-5 w-5" /> },
  'sms-templates': { title: 'SMS Templates', description: 'Manage your message templates', icon: <FileText className="h-5 w-5" /> },
  'sender-ids': { title: 'Sender IDs', description: 'Manage your registered sender IDs', icon: <Hash className="h-5 w-5" /> },
  'billing': { title: 'Billing', description: 'Manage subscription and payments', icon: <CreditCard className="h-5 w-5" /> },
  'support': { title: 'Support', description: 'Get help and manage support tickets', icon: <LifeBuoy className="h-5 w-5" /> },
  'help-center': { title: 'Help Center', description: 'Browse FAQs and knowledge base', icon: <BookOpen className="h-5 w-5" /> },
  'settings': { title: 'Settings', description: 'Manage your account settings', icon: <Settings className="h-5 w-5" /> },
  'campaign-builder': { title: 'Campaign Builder', description: 'Create and manage SMS campaigns', icon: <Zap className="h-5 w-5" /> },
  'campaigns': { title: 'Campaigns', description: 'View and manage campaign history', icon: <Rocket className="h-5 w-5" /> },
  'blacklist': { title: 'Blacklist', description: 'Manage blocked numbers', icon: <Ban className="h-5 w-5" /> },
  'automations': { title: 'Automations', description: 'Set up automated SMS workflows', icon: <Zap className="h-5 w-5" /> },
  'developers': { title: 'Developers', description: 'API documentation and integration', icon: <Code2 className="h-5 w-5" /> },
  'reports': { title: 'Reports', description: 'View analytics and reports', icon: <BarChart3 className="h-5 w-5" /> },
};

// ==================== LAZY VIEWS ====================
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="h-6 w-6 animate-spin text-[#D72444]" />
  </div>
);

const CustomerDashboardView = dynamic(() => import('./views/customer-dashboard-view').then(m => ({ default: m.CustomerDashboardView })), { loading: LoadingFallback });
const AccountView = dynamic(() => import('./views/account-view').then(m => ({ default: m.AccountView })), { loading: LoadingFallback });
const ComposeSmsCustomerView = dynamic(() => import('./views/compose-sms-customer-view').then(m => ({ default: m.ComposeSmsCustomerView })), { loading: LoadingFallback });
const ContactsView = dynamic(() => import('./views/contacts-view').then(m => ({ default: m.ContactsView })), { loading: LoadingFallback });
const ContactGroupsView = dynamic(() => import('./views/contact-groups-view').then(m => ({ default: m.ContactGroupsView })), { loading: LoadingFallback });
const SmsHistoryCustomerView = dynamic(() => import('./views/sms-history-customer-view').then(m => ({ default: m.SmsHistoryCustomerView })), { loading: LoadingFallback });
const SmsTemplatesCustomerView = dynamic(() => import('./views/sms-templates-customer-view').then(m => ({ default: m.SmsTemplatesCustomerView })), { loading: LoadingFallback });
const SenderIdsView = dynamic(() => import('./views/sender-ids-view').then(m => ({ default: m.SenderIdsView })), { loading: LoadingFallback });
const BillingView = dynamic(() => import('./views/billing-view').then(m => ({ default: m.BillingView })), { loading: LoadingFallback });
const CustomerSettingsView = dynamic(() => import('./views/customer-settings-view').then(m => ({ default: m.CustomerSettingsView })), { loading: LoadingFallback });
const SupportView = dynamic(() => import('./views/support-view').then(m => ({ default: m.SupportView })), { loading: LoadingFallback });
const HelpCenterCustomerView = dynamic(() => import('./views/help-center-customer-view').then(m => ({ default: m.HelpCenterCustomerView })), { loading: LoadingFallback });
const CampaignBuilderView = dynamic(() => import('./views/campaign-builder-view').then(m => ({ default: m.CampaignBuilderView })), { loading: LoadingFallback });
const CampaignsView = dynamic(() => import('./views/campaigns-view').then(m => ({ default: m.CampaignsView })), { loading: LoadingFallback });
const DevelopersView = dynamic(() => import('./views/developers-view').then(m => ({ default: m.DevelopersView })), { loading: LoadingFallback });

// ==================== PLACEHOLDER VIEW ====================
function ComingSoonView({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D72444]/10">
          <Construction className="h-8 w-8 text-[#D72444]" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This feature is coming soon. Stay tuned!</p>
      </div>
    </div>
  );
}

// ==================== VIEW ROUTER ====================
function CustomerViewRouter() {
  const { currentView } = useCustomer();

  switch (currentView) {
    case 'customer-dashboard': return <CustomerDashboardView />;
    case 'account': return <AccountView />;
    case 'compose-sms': return <ComposeSmsCustomerView />;
    case 'contacts': return <ContactsView />;
    case 'contact-groups': return <ContactGroupsView />;
    case 'sms-history': return <SmsHistoryCustomerView />;
    case 'sms-templates': return <SmsTemplatesCustomerView />;
    case 'sender-ids': return <SenderIdsView />;
    case 'billing': return <BillingView />;
    case 'support': return <SupportView />;
    case 'help-center': return <HelpCenterCustomerView />;
    case 'settings': return <CustomerSettingsView />;
    case 'all-messages': return <SmsHistoryCustomerView />;
    case 'campaign-builder': return <CampaignBuilderView />;
    case 'campaigns': return <CampaignsView />;
    case 'blacklist': return <ComingSoonView title="Blacklist" />;
    case 'automations': return <ComingSoonView title="Automations" />;
    case 'developers': return <DevelopersView />;
    case 'reports': return <ComingSoonView title="Reports" />;
    default: return <CustomerDashboardView />;
  }
}

// ==================== STICKY PAGE HEADER ====================
function StickyPageHeader() {
  const { currentView } = useCustomer();
  const meta = viewMeta[currentView] || viewMeta['customer-dashboard'];

  return (
    <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#D72444]/10 text-[#D72444] shrink-0">
          {meta.icon}
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">{meta.title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{meta.description}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== CUSTOMER SHELL ====================
export function CustomerShell() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <CustomerHeader />
        <main className="flex-1 overflow-y-auto">
          <StickyPageHeader />
          <div className="p-4 lg:p-6">
            <CustomerViewRouter />
          </div>
        </main>
      </div>
    </div>
  );
}

export function CustomerLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#D72444]" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading SDASMS Portal...</p>
      </div>
    </div>
  );
}
