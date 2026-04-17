'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plane, CheckCircle2, XCircle,
  DollarSign, Search, CalendarDays,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCustomer } from '../customer-context';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const timeRanges = [
  'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month',
];

// ==================== COMPONENT ====================
export function CustomerDashboardView() {
  const { customerUser } = useCustomer();
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, delivered: 0, failed: 0, cost: 0 });
  const [smsTrend, setSmsTrend] = useState<{ day: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setStats({
            total: d.stats?.total_sms || 0,
            delivered: d.stats?.delivered || 0,
            failed: d.stats?.failed || 0,
            cost: parseFloat(d.stats?.total_cost || '0'),
          });
          // Use sms trend data
          if (d.smsTrend && d.smsTrend.length > 0) {
            setSmsTrend(d.smsTrend.map((t: any) => ({
              day: t.date?.slice(5) || t.date,
              count: t.total || 0,
            })));
          } else if (d.smsHistory) {
            // Fallback: build trend from smsHistory
            const byDate: Record<string, number> = {};
            for (const s of d.smsHistory) {
              const key = (s.created_at || '').slice(5, 10);
              byDate[key] = (byDate[key] || 0) + 1;
            }
            setSmsTrend(Object.entries(byDate).slice(-7).map(([day, count]) => ({ day, count })));
          }
        }
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  }

  const companyName = customerUser?.first_name || 'Customer';

  const chartData = smsTrend.length > 0 ? smsTrend : [
    { day: 'No data', count: 0 },
  ];

  const maxCount = useMemo(
    () => Math.max(...chartData.map((d) => d.count), 1),
    [chartData]
  );

  const chartBars = useMemo(
    () =>
      chartData.map((item, i) => {
        const heightPct = (item.count / maxCount) * 100;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              {item.count}
            </span>
            <div
              className="w-full max-w-[40px] rounded-t-md transition-all duration-300 cursor-pointer hover:opacity-80"
              style={{
                height: `${Math.max(heightPct, 4)}%`,
                minHeight: '4px',
                background: 'linear-gradient(180deg, #D72444 0%, #D7244480 100%)',
              }}
              title={`${item.day}: ${item.count} SMS`}
            />
            <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {item.day}
            </span>
          </div>
        );
      }),
    [chartData, maxCount]
  );

  return (
    <div className="space-y-6">
      {/* SMS Count Chart Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            SMS Count
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 pl-8 text-xs"
              />
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range} value={range} className="text-xs">
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
              Loading...
            </div>
          ) : (
            <div className="flex items-end gap-2" style={{ height: '200px' }}>
              <div className="flex flex-col justify-between text-[10px] text-gray-400 dark:text-gray-500 pr-2 h-full flex-shrink-0">
                <span>{maxCount}</span>
                <span>{Math.round((maxCount * 3) / 4)}</span>
                <span>{Math.round(maxCount / 2)}</span>
                <span>{Math.round(maxCount / 4)}</span>
                <span>0</span>
              </div>
              <div className="flex-1 flex items-end gap-3 h-full border-l border-b border-gray-200 dark:border-gray-700 pl-1 pb-6">
                {chartBars}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Plane className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          value={loading ? '...' : stats.total}
          label="Total SMS"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />}
          iconBg="bg-green-100 dark:bg-green-900/30"
          value={loading ? '...' : `$${stats.cost.toFixed(2)}`}
          label="Total Cost"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          value={loading ? '...' : stats.delivered}
          label="Delivered"
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-900/30"
          value={loading ? '...' : stats.failed}
          label="Failed"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon, iconBg, value, label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-gray-600 dark:text-gray-200 truncate">{value}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
