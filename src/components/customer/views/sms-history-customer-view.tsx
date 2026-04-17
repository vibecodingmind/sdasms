'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, CheckCircle2, XCircle, Truck, AlertTriangle,
  Clock, SkipForward, ChevronDown, Download, Eye, Trash2,
  Filter, RefreshCw, MoreHorizontal, Loader2,
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

// ==================== TYPES ====================
interface SmsRecord {
  id?: string | number;
  date?: string;
  created_at?: string;
  direction?: string;
  type?: string;
  from?: string;
  to?: string;
  sms_count?: number;
  smsCount?: number;
  cost?: number;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

const statusIcons: Record<string, React.ReactNode> = {
  Delivered: <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
  delivered: <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
  Enroute: <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  enroute: <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  Expired: <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  expired: <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  Undelivered: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
  undelivered: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
  Rejected: <XCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  rejected: <XCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  Accepted: <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />,
  accepted: <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />,
  Skipped: <SkipForward className="h-4 w-4 text-gray-500 dark:text-gray-400" />,
  skipped: <SkipForward className="h-4 w-4 text-gray-500 dark:text-gray-400" />,
  Failed: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
  failed: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
  Sent: <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  sent: <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  Pending: <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
  pending: <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
};

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Enroute: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  enroute: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Expired: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  expired: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Undelivered: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  undelivered: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Rejected: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  rejected: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Accepted: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  accepted: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Skipped: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  skipped: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export function SmsHistoryCustomerView() {
  const [records, setRecords] = useState<SmsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [direction, setDirection] = useState('all');
  const [type, setType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toFilter, setToFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/reports');
      const json = await res.json();
      if (json.success && json.data) {
        setRecords(json.data.smsHistory || json.data.sms_history || []);
      } else {
        setError('Failed to load SMS history');
      }
    } catch {
      setError('Failed to load SMS history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Compute status counts from records
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      const s = (r.status || 'Unknown');
      const capitalized = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      counts[capitalized] = (counts[capitalized] || 0) + 1;
    });
    return counts;
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const id = String(record.id || '');
      const to = String(record.to || '');
      const from = String(record.from || '');
      const matchSearch =
        to.includes(search) ||
        from.includes(search) ||
        id.includes(search);
      const matchDirection = direction === 'all' || (record.direction || '').toUpperCase() === direction;
      const matchType = type === 'all' || (record.type || '').toUpperCase() === type;
      const matchStatus = statusFilter === 'all' || (record.status || '').toLowerCase() === statusFilter.toLowerCase();
      const matchTo = !toFilter || to.includes(toFilter);
      const matchFrom = !fromFilter || from.includes(fromFilter);
      return matchSearch && matchDirection && matchType && matchStatus && matchTo && matchFrom;
    });
  }, [records, search, direction, type, statusFilter, toFilter, fromFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#D72444]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-red-500">{error}</p>
        <Button variant="outline" onClick={fetchRecords}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Status Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusCounts).slice(0, 8).map(([status, count]) => (
          <Card key={status} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {statusIcons[status] || statusIcons['Pending']}
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
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Direction</label>
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
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</label>
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
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
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
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">To</label>
              <Input placeholder="Phone number" value={toFilter} onChange={(e) => setToFilter(e.target.value)} className="h-9 text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">From</label>
              <Input placeholder="Sender ID" value={fromFilter} onChange={(e) => setFromFilter(e.target.value)} className="h-9 text-sm" />
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
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={fetchRecords}>
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((record, idx) => {
                  const status = record.status || 'Unknown';
                  return (
                    <TableRow
                      key={record.id || idx}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-300">
                          {record.id || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {record.date || (record.created_at ? new Date(record.created_at).toLocaleString() : '—')}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold px-2 py-0.5 ${
                            (record.direction || '').toUpperCase() === 'OUTGOING'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}
                        >
                          {record.direction || '—'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {record.type || 'PLAIN'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {record.from || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {record.to || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {record.sms_count ?? record.smsCount ?? '—'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {record.cost ?? '—'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[status] || statusColors['Pending'] || ''}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
