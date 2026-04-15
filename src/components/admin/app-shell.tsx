'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useApp, type ViewId } from './app-context';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { LoginPage } from './login-page';
import { Loader2, LayoutDashboard, Users, CreditCard, Bell, Package, DollarSign, Settings, Server, Hash, Shield, Ban, FileText, UserCog, ShieldCheck, Globe, Cpu, Languages, Wallet, Mail, FileCheck, Lock, Wrench, BarChart3, Clock, Megaphone, Receipt, Palette, MessageSquare, AlertTriangle, Send, LifeBuoy, MessageCircle, BookOpen } from 'lucide-react';

// ==================== VIEW METADATA ====================
interface ViewMeta {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const viewMeta: Record<ViewId, ViewMeta> = {
  'dashboard': { title: 'Dashboard', description: 'Overview of your SMS platform', icon: <LayoutDashboard className="h-5 w-5" /> },
  'compose-sms': { title: 'Compose SMS', description: 'Send SMS messages to your contacts', icon: <Send className="h-5 w-5" /> },
  'customers': { title: 'Customers', description: 'Manage your customer accounts', icon: <Users className="h-5 w-5" /> },
  'subscription': { title: 'Subscriptions', description: 'View and manage subscriptions', icon: <CreditCard className="h-5 w-5" /> },
  'announcements': { title: 'Announcements', description: 'Manage system announcements', icon: <Bell className="h-5 w-5" /> },
  'plans': { title: 'Plans', description: 'Manage subscription plans and pricing', icon: <Package className="h-5 w-5" /> },
  'currencies': { title: 'Currencies', description: 'Configure supported currencies', icon: <DollarSign className="h-5 w-5" /> },
  'tax-setting': { title: 'Tax Settings', description: 'Configure tax rates and rules', icon: <Settings className="h-5 w-5" /> },
  'sending-servers': { title: 'Sending Servers', description: 'Manage SMS sending servers and gateways', icon: <Server className="h-5 w-5" /> },
  'sender-id': { title: 'Sender ID', description: 'Manage sender IDs and assignments', icon: <Hash className="h-5 w-5" /> },
  'sms-templates': { title: 'SMS Templates', description: 'Manage SMS message templates', icon: <MessageSquare className="h-5 w-5" /> },
  'blacklist': { title: 'Blacklist', description: 'Manage blocked phone numbers', icon: <Ban className="h-5 w-5" /> },
  'spam-words': { title: 'Spam Words', description: 'Configure spam word filters', icon: <AlertTriangle className="h-5 w-5" /> },
  'blocked-sender-id': { title: 'Blocked Sender ID', description: 'Manage blocked sender IDs', icon: <Ban className="h-5 w-5" /> },
  'administrators': { title: 'Administrators', description: 'Manage admin users and roles', icon: <ShieldCheck className="h-5 w-5" /> },
  'admin-roles': { title: 'Admin Roles', description: 'Configure admin role permissions', icon: <UserCog className="h-5 w-5" /> },
  'all-settings': { title: 'All Settings', description: 'General application configuration', icon: <Settings className="h-5 w-5" /> },
  'countries': { title: 'Countries', description: 'Manage supported countries', icon: <Globe className="h-5 w-5" /> },
  'ai-setting': { title: 'Integrations Settings', description: 'AI and SMS gateway integrations', icon: <Cpu className="h-5 w-5" /> },
  'language': { title: 'Language', description: 'Manage supported languages', icon: <Languages className="h-5 w-5" /> },
  'payment-gateways': { title: 'Payment Gateways', description: 'Configure payment methods', icon: <Wallet className="h-5 w-5" /> },
  'email-templates': { title: 'Email Templates', description: 'Manage email notification templates', icon: <Mail className="h-5 w-5" /> },
  'terms-of-use': { title: 'Terms of Use', description: 'Edit terms of service', icon: <FileCheck className="h-5 w-5" /> },
  'privacy-policy': { title: 'Privacy Policy', description: 'Edit privacy policy', icon: <Lock className="h-5 w-5" /> },
  'maintenance-mode': { title: 'Maintenance Mode', description: 'Configure maintenance settings', icon: <Wrench className="h-5 w-5" /> },
  'update-application': { title: 'Update Application', description: 'Check for updates and version info', icon: <FileText className="h-5 w-5" /> },
  'report-dashboard': { title: 'Report Dashboard', description: 'Analytics and reporting overview', icon: <BarChart3 className="h-5 w-5" /> },
  'sms-history': { title: 'SMS History', description: 'View SMS delivery history', icon: <Clock className="h-5 w-5" /> },
  'campaigns-report': { title: 'Campaigns', description: 'View campaign reports and analytics', icon: <Megaphone className="h-5 w-5" /> },
  'invoices': { title: 'Invoices', description: 'Manage billing invoices', icon: <Receipt className="h-5 w-5" /> },
  'theme-customizer': { title: 'Theme Customizer', description: 'Customize the admin panel appearance', icon: <Palette className="h-5 w-5" /> },
  'support-tickets': { title: 'Support Tickets', description: 'Manage customer support tickets', icon: <MessageCircle className="h-5 w-5" /> },
  'help-center': { title: 'Help Center', description: 'Manage knowledge base articles and FAQs', icon: <BookOpen className="h-5 w-5" /> },
};

// ==================== LAZY VIEWS ====================
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="h-6 w-6 animate-spin text-[#D72444]" />
  </div>
);

const DashboardView = dynamic(() => import('./views/dashboard-view').then(m => ({ default: m.DashboardView })), { loading: LoadingFallback });
const ComposeSmsView = dynamic(() => import('./views/compose-sms-view').then(m => ({ default: m.ComposeSmsView })), { loading: LoadingFallback });
const CustomersView = dynamic(() => import('./views/customers-view').then(m => ({ default: m.CustomersView })), { loading: LoadingFallback });
const SubscriptionView = dynamic(() => import('./views/subscription-view').then(m => ({ default: m.SubscriptionView })), { loading: LoadingFallback });
const AnnouncementsView = dynamic(() => import('./views/announcements-view').then(m => ({ default: m.AnnouncementsView })), { loading: LoadingFallback });
const PlansView = dynamic(() => import('./views/plans-view').then(m => ({ default: m.PlansView })), { loading: LoadingFallback });
const CurrenciesView = dynamic(() => import('./views/currencies-view').then(m => ({ default: m.CurrenciesView })), { loading: LoadingFallback });
const TaxSettingView = dynamic(() => import('./views/tax-setting-view').then(m => ({ default: m.TaxSettingView })), { loading: LoadingFallback });
const SendingServersView = dynamic(() => import('./views/sending-servers-view').then(m => ({ default: m.SendingServersView })), { loading: LoadingFallback });
const SenderIdView = dynamic(() => import('./views/sender-id-view').then(m => ({ default: m.SenderIdView })), { loading: LoadingFallback });
const BlacklistView = dynamic(() => import('./views/blacklist-view').then(m => ({ default: m.BlacklistView })), { loading: LoadingFallback });
const SpamWordsView = dynamic(() => import('./views/spam-words-view').then(m => ({ default: m.SpamWordsView })), { loading: LoadingFallback });
const BlockedSenderIdView = dynamic(() => import('./views/blocked-sender-id-view').then(m => ({ default: m.BlockedSenderIdView })), { loading: LoadingFallback });
const AdministratorsView = dynamic(() => import('./views/administrators-view').then(m => ({ default: m.AdministratorsView })), { loading: LoadingFallback });
const AdminRolesView = dynamic(() => import('./views/admin-roles-view').then(m => ({ default: m.AdminRolesView })), { loading: LoadingFallback });
const AllSettingsView = dynamic(() => import('./views/all-settings-view').then(m => ({ default: m.AllSettingsView })), { loading: LoadingFallback });
const CountriesView = dynamic(() => import('./views/countries-view').then(m => ({ default: m.CountriesView })), { loading: LoadingFallback });
const AiSettingView = dynamic(() => import('./views/ai-setting-view').then(m => ({ default: m.AiSettingView })), { loading: LoadingFallback });
const LanguageView = dynamic(() => import('./views/language-view').then(m => ({ default: m.LanguageView })), { loading: LoadingFallback });
const PaymentGatewaysView = dynamic(() => import('./views/payment-gateways-view').then(m => ({ default: m.PaymentGatewaysView })), { loading: LoadingFallback });
const EmailTemplatesView = dynamic(() => import('./views/email-templates-view').then(m => ({ default: m.EmailTemplatesView })), { loading: LoadingFallback });
const TermsOfUseView = dynamic(() => import('./views/terms-of-use-view').then(m => ({ default: m.TermsOfUseView })), { loading: LoadingFallback });
const PrivacyPolicyView = dynamic(() => import('./views/privacy-policy-view').then(m => ({ default: m.PrivacyPolicyView })), { loading: LoadingFallback });
const MaintenanceModeView = dynamic(() => import('./views/maintenance-mode-view').then(m => ({ default: m.MaintenanceModeView })), { loading: LoadingFallback });
const UpdateAppView = dynamic(() => import('./views/update-app-view').then(m => ({ default: m.UpdateAppView })), { loading: LoadingFallback });
const ReportDashboardView = dynamic(() => import('./views/report-dashboard-view').then(m => ({ default: m.ReportDashboardView })), { loading: LoadingFallback });
const SmsHistoryView = dynamic(() => import('./views/sms-history-view').then(m => ({ default: m.SmsHistoryView })), { loading: LoadingFallback });
const CampaignsReportView = dynamic(() => import('./views/campaigns-report-view').then(m => ({ default: m.CampaignsReportView })), { loading: LoadingFallback });
const InvoicesView = dynamic(() => import('./views/invoices-view').then(m => ({ default: m.InvoicesView })), { loading: LoadingFallback });
const ThemeCustomizerView = dynamic(() => import('./views/theme-customizer-view').then(m => ({ default: m.ThemeCustomizerView })), { loading: LoadingFallback });
const SmsTemplatesView = dynamic(() => import('./views/sms-templates-view').then(m => ({ default: m.SmsTemplatesView })), { loading: LoadingFallback });
const SupportTicketsView = dynamic(() => import('./views/support-tickets-view').then(m => ({ default: m.SupportTicketsView })), { loading: LoadingFallback });
const HelpCenterView = dynamic(() => import('./views/help-center-view').then(m => ({ default: m.HelpCenterView })), { loading: LoadingFallback });

// ==================== VIEW ROUTER ====================
function ViewRouter() {
  const { currentView } = useApp();

  switch (currentView) {
    case 'dashboard': return <DashboardView />;
    case 'compose-sms': return <ComposeSmsView />;
    case 'customers': return <CustomersView />;
    case 'subscription': return <SubscriptionView />;
    case 'announcements': return <AnnouncementsView />;
    case 'plans': return <PlansView />;
    case 'currencies': return <CurrenciesView />;
    case 'tax-setting': return <TaxSettingView />;
    case 'sending-servers': return <SendingServersView />;
    case 'sender-id': return <SenderIdView />;
    case 'blacklist': return <BlacklistView />;
    case 'spam-words': return <SpamWordsView />;
    case 'blocked-sender-id': return <BlockedSenderIdView />;
    case 'administrators': return <AdministratorsView />;
    case 'admin-roles': return <AdminRolesView />;
    case 'all-settings': return <AllSettingsView />;
    case 'countries': return <CountriesView />;
    case 'ai-setting': return <AiSettingView />;
    case 'language': return <LanguageView />;
    case 'payment-gateways': return <PaymentGatewaysView />;
    case 'email-templates': return <EmailTemplatesView />;
    case 'terms-of-use': return <TermsOfUseView />;
    case 'privacy-policy': return <PrivacyPolicyView />;
    case 'maintenance-mode': return <MaintenanceModeView />;
    case 'update-application': return <UpdateAppView />;
    case 'report-dashboard': return <ReportDashboardView />;
    case 'sms-history': return <SmsHistoryView />;
    case 'campaigns-report': return <CampaignsReportView />;
    case 'invoices': return <InvoicesView />;
    case 'theme-customizer': return <ThemeCustomizerView />;
    case 'sms-templates': return <SmsTemplatesView />;
    case 'support-tickets': return <SupportTicketsView />;
    case 'help-center': return <HelpCenterView />;
    default: return <DashboardView />;
  }
}

// ==================== STICKY PAGE HEADER ====================
function StickyPageHeader() {
  const { currentView } = useApp();
  const meta = viewMeta[currentView] || viewMeta['dashboard'];

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

// ==================== APP SHELL ====================
export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {/* Sticky page header */}
          <StickyPageHeader />
          {/* Page content */}
          <div className="p-4 lg:p-6">
            <ViewRouter />
          </div>
        </main>
      </div>
    </div>
  );
}

export function AdminLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#D72444]" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading SDASMS Admin...</p>
      </div>
    </div>
  );
}
