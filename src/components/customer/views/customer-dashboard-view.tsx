'use client';

import React from 'react';
import {
  Send, BarChart3, Users, Clock, Phone, XCircle, FileText,
  ShoppingCart, Ban, Info, Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '../customer-context';

const dashboardData = {
  plan: 'Starter',
  planPrice: 'Sh38,900',
  expiryDays: 998,
  expiryDate: '2nd Feb 25, 10:39 AM',
  stats: {
    campaigns: { current: 7, total: 92 },
    delivered: { current: 33467, total: 44201 },
    failed: { current: 10734, total: 44201 },
    templates: 0,
    contactGroups: 6,
    contacts: 2082,
    invoices: { current: 47, total: 8 },
    blacklists: 0,
  },
  smsReports: { delivered: 75.7, failed: 24.3 },
  dailySms: [120, 280, 150, 340, 200, 180, 250, 310, 170, 290, 220, 160, 330, 280, 210, 190, 300, 260, 140, 350, 270, 230, 180, 310, 250, 200, 320, 170, 290, 240],
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function CustomerDashboardView() {
  const { customerUser, setCurrentView } = useCustomer();
  const greeting = getGreeting();

  const companyName = customerUser?.first_name || 'Customer';

  const maxSms = Math.max(...dashboardData.dailySms);
  const chartBars = dashboardData.dailySms.map((val, i) => {
    const heightPct = maxSms > 0 ? (val / maxSms) * 100 : 0;
    return (
      <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
        <div
          className="w-full rounded-t-sm transition-all duration-300"
          style={{
            height: `${Math.max(heightPct, 2)}%`,
            minHeight: '3px',
            background:
              'linear-gradient(180deg, #D72444 0%, #D7244480 100%)',
          }}
          title={`Day ${i + 1}: ${val} SMS`}
        />
      </div>
    );
  });

  const deliveredDeg = (dashboardData.smsReports.delivered / 100) * 360;

  return (
    <div className="space-y-6">
      {/* ─── 1. Welcome Section ─── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Good {greeting}, {companyName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-3xl leading-relaxed">
              Welcome back to your personalized Dashboard. Check out charts,
              resources, and useful SDASMS solutions tailored to your account.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setCurrentView('compose-sms')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Quick Send
            </Button>
            <Button
              onClick={() => setCurrentView('campaign-builder')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Campaign Builder
            </Button>
            <Button
              onClick={() => setCurrentView('contact-groups')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Contact Groups
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── 2. Current Plan Section ─── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
            Current Plan
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            You are currently subscribed to the{' '}
            <span className="text-red-600 dark:text-red-400 font-semibold">
              {dashboardData.plan}
            </span>{' '}
            plan{' '}
            <span className="text-red-600 dark:text-red-400 font-semibold">
              {dashboardData.planPrice}
            </span>
            , your subscription will expire in{' '}
            <span className="font-medium">{dashboardData.expiryDays}</span> days
            from now on{' '}
            <span className="font-medium">{dashboardData.expiryDate}</span>
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentView('billing')}
              className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950"
            >
              <Info className="h-4 w-4 mr-2" />
              More info
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentView('billing')}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
            >
              <Package className="h-4 w-4 mr-2" />
              Packages
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── 3. SMS Reports Section (Donut Chart) ─── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            SMS REPORTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* CSS-only donut chart using conic-gradient */}
            <div className="relative flex-shrink-0">
              <div
                className="w-40 h-40 rounded-full"
                style={{
                  background: `conic-gradient(
                    #22c55e 0deg ${deliveredDeg}deg,
                    #ef4444 ${deliveredDeg}deg 360deg
                  )`,
                }}
              />
              {/* Inner circle for donut hole */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                    {dashboardData.smsReports.delivered}%
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Delivered
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ml-2"
                >
                  {dashboardData.smsReports.delivered}%
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Failed
                </span>
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ml-2"
                >
                  {dashboardData.smsReports.failed}%
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-yellow-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pending
                </span>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 ml-2"
                >
                  0%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── 4. Statistics Cards (2×4 grid) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          value={`${formatNumber(dashboardData.stats.campaigns.current)} / ${formatNumber(dashboardData.stats.campaigns.total)}`}
          label="Campaigns"
        />
        <StatCard
          icon={<Phone className="h-5 w-5 text-green-600 dark:text-green-400" />}
          iconBg="bg-green-100 dark:bg-green-900/30"
          value={`${formatNumber(dashboardData.stats.delivered.current)} / ${formatNumber(dashboardData.stats.delivered.total)}`}
          label="Delivered"
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-900/30"
          value={`${formatNumber(dashboardData.stats.failed.current)} / ${formatNumber(dashboardData.stats.failed.total)}`}
          label="Failed"
        />
        <StatCard
          icon={<FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          value={`${dashboardData.stats.templates}`}
          label="SMS Templates"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          value={`${formatNumber(dashboardData.stats.contactGroups)}`}
          label="Contact Groups"
        />
        <StatCard
          icon={
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
          }
          iconBg="bg-green-100 dark:bg-green-900/30"
          value={`${formatNumber(dashboardData.stats.contacts)}`}
          label="Contacts"
        />
        <StatCard
          icon={
            <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          }
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          value={`${dashboardData.stats.invoices.current} / ${dashboardData.stats.invoices.total}`}
          label="Invoices"
        />
        <StatCard
          icon={<Ban className="h-5 w-5 text-red-600 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-900/30"
          value={`${dashboardData.stats.blacklists}`}
          label="Blacklists"
        />
      </div>

      {/* ─── 5. SMS Statistics Chart ─── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            SMS STATISTICS FOR PLAIN SMS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="flex items-end gap-px" style={{ height: '220px' }}>
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[10px] text-gray-400 dark:text-gray-500 pr-2 py-1 flex-shrink-0 h-full">
              <span>{formatNumber(maxSms)}</span>
              <span>{formatNumber(Math.round(maxSms * 0.75))}</span>
              <span>{formatNumber(Math.round(maxSms * 0.5))}</span>
              <span>{formatNumber(Math.round(maxSms * 0.25))}</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="flex-1 flex items-end gap-px h-full border-l border-b border-gray-200 dark:border-gray-700 pl-1">
              {chartBars}
            </div>
          </div>
          {/* X-axis day labels */}
          <div className="flex items-end gap-px mt-1">
            <div className="w-8 flex-shrink-0" /> {/* spacer for y-axis */}
            <div className="flex-1 flex gap-px">
              {dashboardData.dailySms.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 text-center text-[9px] text-gray-400 dark:text-gray-500 min-w-0"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── StatCard sub-component ─── */

function StatCard({
  icon,
  iconBg,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-gray-600 dark:text-gray-200 truncate">
            {value}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
