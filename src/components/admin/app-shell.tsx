'use client';

import React from 'react';
import { useApp } from './app-context';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { LoginPage } from './login-page';
import { DashboardView } from './views/dashboard-view';
import { CustomersView } from './views/customers-view';
import { SubscriptionView } from './views/subscription-view';
import { AnnouncementsView } from './views/announcements-view';
import { PlansView } from './views/plans-view';
import { CurrenciesView } from './views/currencies-view';
import { TaxSettingView } from './views/tax-setting-view';
import { SendingServersView } from './views/sending-servers-view';
import { SenderIdView } from './views/sender-id-view';
import { BlacklistView } from './views/blacklist-view';
import { SpamWordsView } from './views/spam-words-view';
import { BlockedSenderIdView } from './views/blocked-sender-id-view';
import { AdministratorsView } from './views/administrators-view';
import { AdminRolesView } from './views/admin-roles-view';
import { AllSettingsView } from './views/all-settings-view';
import { CountriesView } from './views/countries-view';
import { AiSettingView } from './views/ai-setting-view';
import { LanguageView } from './views/language-view';
import { PaymentGatewaysView } from './views/payment-gateways-view';
import { EmailTemplatesView } from './views/email-templates-view';
import { TermsOfUseView } from './views/terms-of-use-view';
import { PrivacyPolicyView } from './views/privacy-policy-view';
import { MaintenanceModeView } from './views/maintenance-mode-view';
import { UpdateAppView } from './views/update-app-view';
import { ReportDashboardView } from './views/report-dashboard-view';
import { SmsHistoryView } from './views/sms-history-view';
import { CampaignsReportView } from './views/campaigns-report-view';
import { InvoicesView } from './views/invoices-view';
import { ThemeCustomizerView } from './views/theme-customizer-view';
import { Loader2 } from 'lucide-react';

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
