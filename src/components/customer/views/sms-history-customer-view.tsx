'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, CheckCircle2, XCircle, Truck, AlertTriangle,
  Clock, SkipForward, ChevronDown, Download, Eye, Trash2,
  Filter, RefreshCw, MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

// ==================== MOCK DATA ====================
interface SmsRecord {
  id: string;
  date: string;
  direction: 'OUTGOING' | 'INCOMING';
  type: 'PLAIN' | 'UNICODE' | 'FLASH' | 'MMS';
  from: string;
  to: string;
  smsCount: number;
  cost: number;
  status: 'Delivered' | 'Enroute' | 'Expired' | 'Undelivered' | 'Rejected' | 'Accepted' | 'Skipped' | 'Failed';
}

const mockMessages: SmsRecord[] = [
  { id: '69e138bfdec13', date: '16th Apr 26, 10:30 PM', direction: 'OUTGOING', type: 'PLAIN', from: 'ALABASTER', to: '255676134312', smsCount: 3, cost: 3, status: 'Delivered' },
  { id: '69e138bfdec14', date: '16th Apr 26, 09:15 PM', direction: 'OUTGOING', type: 'PLAIN', from: 'ALABASTER', to: '255743981234', smsCount: 1, cost: 1, status: 'Delivered' },
  { id: '69e138bfdec15', date: '16th Apr 26, 08:45 PM', direction: 'OUTGOING', type: 'UNICODE', from: 'ALABASTER', to: '255687654321', smsCount: 2, cost: 2, status: 'Failed' },
  { id: '69e138bfdec16', date: '15th Apr 26, 11:20 PM', direction: 'OUTGOING', type: 'PLAIN', from: 'ALABASTER', to: '255612345678', smsCount: 1, cost: 1, status: 'Delivered' },
  { id: '69e138bfdec17', date: '15th Apr 26, 10:00 AM', direction: 'OUTGOING', type: 'PLAIN', from: 'ALABASTER', to: '255723456789', smsCount: 4, cost: 4, status: 'Delivered' },
  { id: '69e138bfdec18', date: '14th Apr 26, 03:30 PM', direction: 'INCOMING', type: 'PLAIN', from: '255699123456', to: 'ALABASTER', smsCount: 1, cost: 0, status: 'Accepted' },
  { id: '69e138bfdec19', date: '14th Apr 26, 01:15 PM', direction: 'OUTGOING', type: 'FLASH', from: 'ALABASTER', to: '255654321987', smsCount: 1, cost: 1, status: 'Delivered' },
  { id: '69e138bfdec1a', date: '13th Apr 26, 06:45 PM', direction: 'OUTGOING', type: 'PLAIN', from: 'ALABASTER', to: '255787654321', smsCount: 2, cost: 2, status: 'Failed' },
  { id: '69e138bfdec1b', date: '13th Apr 26, 09:32 AM', direction: 'OUTGOING', type: 'PLAIN', from: 'ALABASTER', to: '255612398765', smsCount: 1, cost: 1, status: 'Delivered' },
  { id: '69e138bfdec1c', date: '12th Apr 26, 09:48 AM', direction: 'OUTGOING', type: 'UNICODE', from: 'ALABASTER', to: '255745678901', smsCount: 3, cost: 3, status: 'Expired' },
  { id: '69e138bfdec1d', date: '11th Apr 26, 04:22 PM', direction: 'OUTGOING', type: 'PLAIN', from: 'ALABASTER', to: '255634567890', smsCount: 1, cost: 1, status: 'Delivered' },
  { id: '69e138bfdec1e', date: '10th Apr 26, 07:10 AM', direction: 'OUTGOING', type: 'PLAIN', from: 'ALABASTER', to: '255756789012', smsCount: 2, cost: 2, status: 'Delivered' },
];

// Status counts from screenshot
const statusCounts = {
  Delivered: 33467,
  Enroute: 0,
  Expired: 0,
  Undelivered: 0,
  Rejected: 0,
  Accepted: 0,
  Skipped: 0,
  Failed: 10734,
};

const statusIcons: Record<string, React.ReactNode> = {
  Delivered: <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
  Enroute: <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  Expired: <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  Undelivered: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
  Rejected: <XCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  Accepted: <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />,
  Skipped: <SkipForward className="h-4 w-4 text-gray-500 dark:text-gray-400" />,
  Failed: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
};

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Enroute: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Expired: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Undelivered: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Rejected: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Accepted: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Skipped: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function SmsHistoryCustomerView() {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');
  const [dateValue, setDateValue] = useState('');
  const [direction, setDirection] = useState('all');
  const [type, setType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toFilter, setToFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [messageIdFilter, setMessageIdFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return mockMessages.filter((record) => {
      const matchSearch =
        record.to.includes(search) ||
        record.from.includes(search) ||
        record.id.includes(search);
      const matchDirection = direction === 'all' || record.direction === direction;
      const matchType = type === 'all' || record.type === type;
      const matchStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchTo = !toFilter || record.to.includes(toFilter);
      const matchFrom = !fromFilter || record.from.includes(fromFilter);
      const matchMessageId = !messageIdFilter || record.id.includes(messageIdFilter);
      return matchSearch && matchDirection && matchType && matchStatus && matchTo && matchFrom && matchMessageId;
    });
  }, [search, direction, type, statusFilter, toFilter, fromFilter, messageIdFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* ─── Status Cards (2x4 grid) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {statusIcons[status]}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                    {count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Filter Form ─── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Period
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7">Last 7 Days</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Date
              </label>
              <Input
                type="date"
                placeholder="YYYY-MM-DD"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Direction
              </label>
              <Select value={direction} onValueChange={setDirection}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="OUTGOING">Outgoing</SelectItem>
                  <SelectItem value="INCOMING">Incoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PLAIN">Plain</SelectItem>
                  <SelectItem value="UNICODE">Unicode</SelectItem>
                  <SelectItem value="FLASH">Flash</SelectItem>
                  <SelectItem value="MMS">MMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Enroute">Enroute</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Undelivered">Undelivered</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Skipped">Skipped</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                To
              </label>
              <Input
                placeholder="Phone number"
                value={toFilter}
                onChange={(e) => setToFilter(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                From
              </label>
              <Input
                placeholder="Sender ID"
                value={fromFilter}
                onChange={(e) => setFromFilter(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Message ID
              </label>
              <Input
                placeholder="Message ID"
                value={messageIdFilter}
                onChange={(e) => setMessageIdFilter(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Data Table ─── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Actions bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <MoreHorizontal className="h-3.5 w-3.5" />
                Actions
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 dark:border-gray-800">
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">ID</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Date</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Direction</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Type</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">From</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">To</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 text-right">SMS Count</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 text-right">Cost</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <TableCell className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-300">
                        {record.id}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {record.date}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold px-2 py-0.5 ${
                          record.direction === 'OUTGOING'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}
                      >
                        {record.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {record.from}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {record.to}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {record.smsCount}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {record.cost}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[record.status] || ''}`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty state */}
          {paged.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No messages found</p>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filtered.length)} of{' '}
                {filtered.length} entries
              </p>
              <div className="flex items-center gap-2">
                <Select
                  value={String(pageSize)}
                  onValueChange={() => setCurrentPage(1)}
                >
                  <SelectTrigger className="h-7 w-16 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
