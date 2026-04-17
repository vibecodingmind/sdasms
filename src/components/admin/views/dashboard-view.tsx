'use client';

import React, { useEffect, useState } from 'react';
import { Users, MessageSquare, DollarSign, CreditCard, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
interface DashboardData {
  stats: { totalCustomers: number; customersGrowth: number; smsSentToday: number; smsGrowth: number; revenue: number; revenueGrowth: number; activeSubscriptions: number; subscriptionsGrowth: number };
  revenueData: { month: string; revenue: number }[];
  recentOrders: { id: number; customer: string; plan: string; amount: string; date: string; status: string }[];
  topCustomers: { name: string; email: string; sent: number; revenue: string }[];
  systemOverview: Record<string, any>;
}

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((r) => {
        if (r.data) setData(r.data);
      })
      .catch(() => {});
  }, []);

  // Safe defaults for nested data
  const stats = data?.stats ?? { totalCustomers: 0, customersGrowth: 0, smsSentToday: 0, smsGrowth: 0, revenue: 0, revenueGrowth: 0, activeSubscriptions: 0, subscriptionsGrowth: 0 };
  const revenueData = data?.revenueData ?? [];
  const recentOrders = data?.recentOrders ?? [];
  const topCustomers = data?.topCustomers ?? [];
  const systemOverview = data?.systemOverview ?? {};

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D72444]" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      growth: stats.customersGrowth,
      icon: <Users className="h-5 w-5" />,
      color: 'bg-[#D72444]',
      lightColor: 'bg-[#FEF2F2]',
    },
    {
      title: 'SMS Sent Today',
      value: stats.smsSentToday.toLocaleString(),
      growth: stats.smsGrowth,
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'bg-[#3B82F6]',
      lightColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      growth: stats.revenueGrowth,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-[#10B981]',
      lightColor: 'bg-[#ECFDF5]',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions.toLocaleString(),
      growth: stats.subscriptionsGrowth,
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-[#F97316]',
      lightColor: 'bg-[#FFF7ED]',
    },
  ];

  const statusBadge = (status: string) => {
    const variant: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {card.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${card.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {card.growth > 0 ? '+' : ''}{card.growth}%
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.lightColor} flex items-center justify-center`}>
                  <div className={`${card.color} text-white rounded-full p-2`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800">Revenue Overview</CardTitle>
              <span className="text-xs text-gray-400">Last 7 months</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D72444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#D72444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '13px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#D72444" strokeWidth={2.5} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800">System Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {[
              { label: 'Total Users', value: typeof systemOverview.totalUsers === 'number' ? systemOverview.totalUsers.toLocaleString() : String(systemOverview.totalUsers ?? '—'), color: 'text-[#D72444]' },
              { label: 'Total SMS Sent', value: typeof systemOverview.totalSmsSent === 'number' ? systemOverview.totalSmsSent.toLocaleString() : String(systemOverview.totalSmsSent ?? systemOverview.messagesQueued ?? '—'), color: 'text-[#3B82F6]' },
              { label: 'Delivery Rate', value: systemOverview.deliveryRate ? `${systemOverview.deliveryRate}%` : systemOverview.serverStatus ?? '—', color: 'text-[#10B981]' },
              { label: 'Active Campaigns', value: typeof systemOverview.activeCampaigns === 'number' ? systemOverview.activeCampaigns.toLocaleString() : String(systemOverview.activeCampaigns ?? '—'), color: 'text-[#10B981]' },
              { label: 'Total Revenue', value: typeof systemOverview.totalRevenue === 'number' ? `$${systemOverview.totalRevenue.toLocaleString()}` : String(systemOverview.totalRevenue ?? systemOverview.dbSize ?? '—'), color: 'text-[#F97316]' },
              { label: 'Total Payments', value: typeof systemOverview.totalPayments === 'number' ? systemOverview.totalPayments.toLocaleString() : String(systemOverview.totalPayments ?? systemOverview.lastBackup ?? '—'), color: 'text-gray-700' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders + Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800">Recent Orders</CardTitle>
              <button className="text-xs text-[#D72444] hover:underline font-medium flex items-center gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="text-xs text-gray-500 font-medium">Customer</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Plan</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Amount</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="border-gray-50">
                    <TableCell className="text-sm text-gray-700 font-medium">{order.customer}</TableCell>
                    <TableCell className="text-sm text-gray-500">{order.plan}</TableCell>
                    <TableCell className="text-sm font-semibold text-gray-800">{order.amount}</TableCell>
                    <TableCell>{statusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800">Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="text-xs text-gray-500 font-medium">Customer</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">SMS Sent</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((c, i) => (
                  <TableRow key={i} className="border-gray-50">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{(c.sent ?? 0).toLocaleString()}</TableCell>
                    <TableCell className="text-sm font-semibold text-[#10B981]">{c.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


