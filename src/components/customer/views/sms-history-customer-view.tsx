'use client';

import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, XCircle, AlertCircle, Filter, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface SmsRecord {
  id: number;
  to: string;
  message: string;
  status: 'delivered' | 'sent' | 'failed' | 'pending';
  cost: number;
  date: string;
}

const mockHistory: SmsRecord[] = [
  { id: 1, to: '+1 555-0101', message: 'Your order #12345 has been shipped! Track at example.com/track', status: 'delivered', cost: 0.012, date: '2025-01-10 14:30' },
  { id: 2, to: '+1 555-0201', message: 'Flash Sale! 50% off all items. Use code FLASH50 at checkout', status: 'delivered', cost: 0.012, date: '2025-01-10 12:00' },
  { id: 3, to: '+1 555-0301', message: 'Appointment confirmed for Jan 15 at 2:00 PM', status: 'sent', cost: 0.012, date: '2025-01-10 08:30' },
  { id: 4, to: '+1 555-0401', message: 'Monthly newsletter - January edition', status: 'failed', cost: 0.012, date: '2025-01-09 16:00' },
  { id: 5, to: '+1 555-0501', message: 'Happy Birthday! Enjoy 20% off your next purchase', status: 'delivered', cost: 0.012, date: '2025-01-09 14:00' },
  { id: 6, to: '+44 7700-0601', message: 'Your verification code is 839201. Do not share this code.', status: 'delivered', cost: 0.015, date: '2025-01-09 10:30' },
  { id: 7, to: '+1 555-0701', message: 'Payment of $49.99 received. Thank you!', status: 'pending', cost: 0.012, date: '2025-01-08 15:00' },
  { id: 8, to: '+1 555-0801', message: 'Meeting rescheduled to 3 PM tomorrow', status: 'delivered', cost: 0.012, date: '2025-01-08 11:00' },
  { id: 9, to: '+86 138-0901', message: 'Reminder: Your subscription expires in 3 days', status: 'failed', cost: 0.020, date: '2025-01-07 14:00' },
  { id: 10, to: '+1 555-1001', message: 'Welcome to our service! Here is your getting started guide', status: 'delivered', cost: 0.012, date: '2025-01-07 09:00' },
];

const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  delivered: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  sent: { icon: <Clock className="h-3.5 w-3.5" />, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  failed: { icon: <XCircle className="h-3.5 w-3.5" />, className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  pending: { icon: <AlertCircle className="h-3.5 w-3.5" />, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
};

export function SmsHistoryCustomerView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = mockHistory.filter((record) => {
    const matchSearch = record.to.includes(search) || record.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalDelivered = mockHistory.filter((r) => r.status === 'delivered').length;
  const totalFailed = mockHistory.filter((r) => r.status === 'failed').length;
  const totalCost = mockHistory.reduce((sum, r) => sum + r.cost, 0);

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{mockHistory.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Messages</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{totalDelivered}</p>
            <p className="text-xs text-gray-500 mt-0.5">Delivered</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{totalFailed}</p>
            <p className="text-xs text-gray-500 mt-0.5">Failed</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#D72444]">${totalCost.toFixed(3)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by recipient or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-auto"
          placeholder="From"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-auto"
          placeholder="To"
        />
      </div>

      {/* History Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Recipient</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Message</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Status</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Cost</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => {
                  const cfg = statusConfig[record.status] || statusConfig.pending;
                  return (
                    <tr key={record.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{record.to}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate block max-w-xs">{record.message}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.className}`}>
                          {cfg.icon}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-300">${record.cost.toFixed(3)}</span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-xs text-gray-400">{record.date}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No messages found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
