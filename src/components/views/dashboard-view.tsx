'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Send, Zap, TrendingUp, TrendingDown, BarChart3, PieChart as PieIcon, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

interface DashboardData {
  totalContacts: number;
  smsSentToday: number;
  smsSentMonth: number;
  smsBalance: number;
  activeCampaigns: number;
  deliveryRate: number;
  contactsGrowth: number;
  smsGrowth: number;
  balanceGrowth: number;
  campaignGrowth: number;
  weeklyStats: { day: string; sent: number; delivered: number; failed: number }[];
  deliveryStatus: { name: string; value: number; color: string }[];
  recentCampaigns: { id: number; campaignName: string; status: string; contactCount: number; delivered: number; failed: number; createdAt: string }[];
  recentActivity: { id: number; type: string; message: string; time: string }[];
}

const defaultData: DashboardData = {
  totalContacts: 24583, smsSentToday: 12450, smsSentMonth: 347820, smsBalance: 52480,
  activeCampaigns: 7, deliveryRate: 94.5, contactsGrowth: 12.3, smsGrowth: 8.7,
  balanceGrowth: -3.2, campaignGrowth: 16.7, weeklyStats: [], deliveryStatus: [],
  recentCampaigns: [], recentActivity: [],
};

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#6b7280'];

const statusColors: Record<string, string> = {
  done: 'bg-green-100 text-green-700',
  sending: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-slate-100 text-slate-700',
};

const activityIcons: Record<string, string> = {
  campaign: '📢', payment: '💳', contact: '👥', alert: '⚠️', server: '🖥️',
};

function StatCard({ title, value, icon: Icon, growth, suffix, color }: {
  title: string; value: string | number; icon: React.ElementType; growth?: number; suffix?: string; color: string;
}) {
  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
              {suffix && <span className="text-sm font-normal text-slate-400 ml-1">{suffix}</span>}
            </p>
          </div>
          <div className={`p-2.5 rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {growth !== undefined && (
          <div className="flex items-center gap-1 mt-3">
            {growth >= 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />
            )}
            <span className={`text-xs font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(growth)}%
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardView() {
  const [data, setData] = useState<DashboardData>(defaultData);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Contacts" value={data.totalContacts} icon={Users} growth={data.contactsGrowth} color="bg-blue-50 text-blue-600" />
        <StatCard title="SMS Sent (Today)" value={data.smsSentToday} icon={Send} growth={data.smsGrowth} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="SMS Balance" value={data.smsBalance} icon={Zap} growth={data.balanceGrowth} suffix="credits" color="bg-amber-50 text-amber-600" />
        <StatCard title="Active Campaigns" value={data.activeCampaigns} icon={BarChart3} growth={data.campaignGrowth} color="bg-violet-50 text-violet-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SMS Trend Chart */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">SMS Sending Trend</CardTitle>
                <CardDescription>Last 7 days performance</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                {data.deliveryRate}% delivery
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyStats}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="sent" stroke="#3b82f6" fill="url(#colorSent)" strokeWidth={2} name="Sent" />
                  <Area type="monotone" dataKey="delivered" stroke="#22c55e" fill="url(#colorDelivered)" strokeWidth={2} name="Delivered" />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" name="Failed" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Status Pie */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Delivery Status</CardTitle>
            <CardDescription>Current campaign breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.deliveryStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {data.deliveryStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {data.deliveryStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-800">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Campaigns */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentCampaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{campaign.campaignName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{campaign.contactCount.toLocaleString()} contacts</p>
                      <p className="text-xs text-green-600">{campaign.delivered.toLocaleString()} delivered</p>
                    </div>
                    <Badge variant="secondary" className={statusColors[campaign.status] || 'bg-gray-100 text-gray-700'}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3 py-2">
                  <div className="text-base flex-shrink-0 mt-0.5">{activityIcons[activity.type] || '📌'}</div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{activity.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
