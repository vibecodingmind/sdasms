'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ReportDashboardView() {
  const [data, setData] = useState<{
    stats: { totalSent: number; delivered: number; failed: number; pending: number };
    smsTrend: { date: string; sent: number }[];
    deliveryBreakdown: { name: string; value: number; color: string }[];
  } | null>(null);

  useEffect(() => {
    fetch('/api/reports').then((r) => r.json()).then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]" /></div>;
  }

  const statCards = [
    { title: 'Total SMS Sent', value: data.stats.totalSent.toLocaleString(), icon: <MessageSquare className="h-5 w-5" />, color: 'bg-[#6366F1]', light: 'bg-[#EEF2FF]' },
    { title: 'Delivered', value: data.stats.delivered.toLocaleString(), icon: <CheckCircle2 className="h-5 w-5" />, color: 'bg-[#10B981]', light: 'bg-[#ECFDF5]' },
    { title: 'Failed', value: data.stats.failed.toLocaleString(), icon: <XCircle className="h-5 w-5" />, color: 'bg-[#EF4444]', light: 'bg-[#FEF2F2]' },
    { title: 'Pending', value: data.stats.pending.toLocaleString(), icon: <Clock className="h-5 w-5" />, color: 'bg-[#F59E0B]', light: 'bg-[#FFFBEB]' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Report Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Analytics and reporting overview</p>
        </div>
        <div className="flex gap-2">
          <Input type="date" defaultValue="2025-01-01" className="w-36 h-9 text-sm" />
          <Input type="date" defaultValue="2025-01-10" className="w-36 h-9 text-sm" />
          <Button variant="outline" size="sm" className="h-9">Apply</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.light} flex items-center justify-center`}>
                  <div className={`${card.color} text-white rounded-full p-2`}>{card.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">SMS Sent Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.smsTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px' }} />
                  <Area type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2.5} fill="url(#colorSms)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Delivery Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.deliveryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={2} stroke="#fff">
                    {data.deliveryBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px' }} formatter={(value: number) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {data.deliveryBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-500">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-700">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
