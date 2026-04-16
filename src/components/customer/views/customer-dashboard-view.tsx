'use client';

import React, { useState, useMemo } from 'react';
import {
  Send, BarChart3, Users, Plane, CheckCircle2, XCircle,
  DollarSign, Search, CalendarDays, ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomer } from '../customer-context';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// ==================== MOCK DATA ====================
const dashboardData = {
  smsCountData: [
    { day: '10/4', count: 8 },
    { day: '11/4', count: 18 },
    { day: '12/4', count: 12 },
    { day: '13/4', count: 22 },
    { day: '14/4', count: 28 },
    { day: '15/4', count: 33 },
    { day: '16/4', count: 15 },
  ],
  stats: {
    totalSms: 33,
    totalCost: 33,
    delivered: 12,
    failed: 0,
  },
};

const timeRanges = [
  'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom',
];

// ==================== COMPONENT ====================
export function CustomerDashboardView() {
  const { customerUser, setCurrentView } = useCustomer();
  const [timeRange, setTimeRange] = useState('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const timeDropdownOpen = useState(false);

  const companyName = customerUser?.first_name || 'Customer';

  const maxCount = useMemo(
    () => Math.max(...dashboardData.smsCountData.map((d) => d.count), 1),
    []
  );

  const chartBars = useMemo(
    () =>
      dashboardData.smsCountData.map((item, i) => {
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
    [maxCount]
  );

  return (
    <div className="space-y-6">
      {/* ─── SMS Count Chart Section ─── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            SMS Count
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 pl-8 text-xs"
              />
            </div>
            {/* Today Dropdown */}
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
          <div
            className="flex items-end gap-2"
            style={{ height: '200px' }}
          >
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[10px] text-gray-400 dark:text-gray-500 pr-2 h-full flex-shrink-0">
              <span>{maxCount}</span>
              <span>{Math.round((maxCount * 3) / 4)}</span>
              <span>{Math.round(maxCount / 2)}</span>
              <span>{Math.round(maxCount / 4)}</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="flex-1 flex items-end gap-3 h-full border-l border-b border-gray-200 dark:border-gray-700 pl-1 pb-6">
              {chartBars}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── SMS Statistics Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Plane className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          value={dashboardData.stats.totalSms}
          label="Total SMS"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />}
          iconBg="bg-green-100 dark:bg-green-900/30"
          value={dashboardData.stats.totalCost}
          label="Total Cost"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          value={dashboardData.stats.delivered}
          label="Delivered"
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-900/30"
          value={dashboardData.stats.failed}
          label="Failed"
        />
      </div>
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
  value: number;
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
