'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useApp } from './app-context';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { LoginPage } from './login-page';
import { Loader2 } from 'lucide-react';

// Lazy load ALL views — only the active one gets bundled and loaded
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="h-6 w-6 animate-spin text-[#6366F1]" />
  </div>
);

const DashboardView = dynamic(() => import('./views/dashboard-view').then(m => ({ default: m.DashboardView })), { loading: LoadingFallback });
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

function ViewRouter() {
  const { currentView } = useApp();

  switch (currentView) {
    case 'dashboard':
      return <DashboardView />;
    case 'customers':
      return <CustomersView />;
    case 'subscription':
      return <SubscriptionView />;
    case 'announcements':
      return <AnnouncementsView />;
    case 'plans':
      return <PlansView />;
    case 'currencies':
      return <CurrenciesView />;
    case 'tax-setting':
      return <TaxSettingView />;
    case 'sending-servers':
      return <SendingServersView />;
    case 'sender-id':
      return <SenderIdView />;
    case 'blacklist':
      return <BlacklistView />;
    case 'spam-words':
      return <SpamWordsView />;
    case 'blocked-sender-id':
      return <BlockedSenderIdView />;
    case 'administrators':
      return <AdministratorsView />;
    case 'admin-roles':
      return <AdminRolesView />;
    case 'all-settings':
      return <AllSettingsView />;
    case 'countries':
      return <CountriesView />;
    case 'ai-setting':
      return <AiSettingView />;
    case 'language':
      return <LanguageView />;
    case 'payment-gateways':
      return <PaymentGatewaysView />;
    case 'email-templates':
      return <EmailTemplatesView />;
    case 'terms-of-use':
      return <TermsOfUseView />;
    case 'privacy-policy':
      return <PrivacyPolicyView />;
    case 'maintenance-mode':
      return <MaintenanceModeView />;
    case 'update-application':
      return <UpdateAppView />;
    case 'report-dashboard':
      return <ReportDashboardView />;
    case 'sms-history':
      return <SmsHistoryView />;
    case 'campaigns-report':
      return <CampaignsReportView />;
    case 'invoices':
      return <InvoicesView />;
    case 'theme-customizer':
      return <ThemeCustomizerView />;
    default:
      return <DashboardView />;
  }
}

export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ViewRouter />
        </main>
      </div>
    </div>
  );
}

export function AdminLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
        <p className="text-sm text-gray-500">Loading SMSPro Admin...</p>
      </div>
    </div>
  );
}
