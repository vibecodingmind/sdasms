'use client';

import React from 'react';
import {
  Send, Users, Hash, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomer } from '../customer-context';

const customerStats = {
  smsBalance: 45000,
  smsSentThisMonth: 12850,
  activeContacts: 3250,
  activeSenderIds: 3,
};

const recentActivity = [
  { id: 1, to: '+1 555-0101', message: 'Your order #12345 has been shipped!', status: 'delivered', cost: 0.012, date: '2025-01-10 14:30' },
  { id: 2, to: '+1 555-0201', message: 'Flash Sale! 50% off all items.', status: 'delivered', cost: 0.012, date: '2025-01-10 12:00' },
  { id: 3, to: '+1 555-0301', message: 'Appointment confirmed for Jan 15', status: 'sent', cost: 0.012, date: '2025-01-10 08:30' },
  { id: 4, to: '+1 555-0401', message: 'Monthly newsletter - January edition', status: 'failed', cost: 0.012, date: '2025-01-09 16:00' },
  { id: 5, to: '+1 555-0501', message: 'Happy Birthday! Enjoy 20% off', status: 'delivered', cost: 0.012, date: '2025-01-09 14:00' },
];

const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  delivered: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  sent: { icon: <Clock className="h-3.5 w-3.5" />, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  failed: { icon: <XCircle className="h-3.5 w-3.5" />, className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  pending: { icon: <AlertCircle className="h-3.5 w-3.5" />, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
};

export function CustomerDashboardView() {
  const { customerUser, setCurrentView } = useCustomer();

  const firstName = customerUser?.first_name || 'Customer';

  const statCards = [
    {
      title: 'SMS Balance',
      value: customerUser?.sms_balance?.toLocaleString() || customerStats.smsBalance.toLocaleString(),
      icon: <Send className="h-5 w-5" />,
      trend: '+5,000',
      trendUp: true,
      color: 'text-[#D72444]',
      bg: 'bg-[#D72444]/10',
    },
    {
      title: 'SMS Sent This Month',
      value: customerStats.smsSentThisMonth.toLocaleString(),
      icon: <TrendingUp className="h-5 w-5" />,
      trend: '+12.5%',
      trendUp: true,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Active Contacts',
      value: customerStats.activeContacts.toLocaleString(),
      icon: <Users className="h-5 w-5" />,
      trend: '+120',
      trendUp: true,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Active Sender IDs',
      value: customerStats.activeSenderIds.toString(),
      icon: <Hash className="h-5 w-5" />,
      trend: '0',
      trendUp: true,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Welcome back, {firstName}! 👋
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s an overview of your SMS activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentView('compose-sms')}
            className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Compose SMS
          </Button>
          <Button variant="outline" onClick={() => setCurrentView('contacts')}>
            <Users className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
                </div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.trendUp ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent SMS Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-[#D72444]" onClick={() => setCurrentView('sms-history')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Recipient</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Message</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Status</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Cost</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => {
                  const cfg = statusConfig[item.status] || statusConfig.pending;
                  return (
                    <tr key={item.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.to}</span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate block max-w-xs">{item.message}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.className}`}>
                          {cfg.icon}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-300">${item.cost.toFixed(3)}</span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-400">{item.date}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
