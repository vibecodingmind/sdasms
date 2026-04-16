'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Eye, BarChart3, Trash2, RefreshCw, Download,
  MoreHorizontal, Clock,
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
interface CampaignRecord {
  id: number;
  name: string;
  created: string;
  contacts: number;
  smsType: 'PLAIN' | 'UNICODE' | 'FLASH' | 'MMS' | 'VOICE';
  campaignType: 'NORMAL' | 'SCHEDULED' | 'RECURRING' | 'API';
  status: 'SENDING' | 'DONE' | 'SCHEDULED' | 'FAILED' | 'CANCELLED';
  runAt?: string;
  deliveredAt?: string;
}

const mockCampaigns: CampaignRecord[] = [
  { id: 1, name: 'Encouragement', created: '1 day ago', contacts: 1267, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'SENDING', runAt: '15th Apr 26, 9:11 PM' },
  { id: 2, name: 'Encouragement', created: '1 day ago', contacts: 1266, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '15th Apr 26, 9:23 AM' },
  { id: 3, name: 'Encouragement', created: '3 days ago', contacts: 933, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '13th Apr 26, 9:32 AM' },
  { id: 4, name: 'B2b Chakula', created: '4 days ago', contacts: 317, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '12th Apr 26, 9:48 AM' },
  { id: 5, name: 'Encouragement', created: '1 week ago', contacts: 933, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '9th Apr 26, 6:27 PM' },
  { id: 6, name: 'B2b Chakula', created: '1 week ago', contacts: 287, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '9th Apr 26, 6:06 PM' },
  { id: 7, name: 'Encouragement', created: '1 week ago', contacts: 933, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '8th Apr 26, 10:22 AM' },
  { id: 8, name: 'Encouragement', created: '2 weeks ago', contacts: 930, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '2nd Apr 26, 4:15 PM' },
  { id: 9, name: 'Sunday Service', created: '2 weeks ago', contacts: 1580, smsType: 'PLAIN', campaignType: 'SCHEDULED', status: 'DONE', deliveredAt: '1st Apr 26, 8:00 AM' },
  { id: 10, name: 'B2b Chakula', created: '3 weeks ago', contacts: 312, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'FAILED', runAt: '28th Mar 26, 7:30 PM' },
  { id: 11, name: 'Youth Conference', created: '3 weeks ago', contacts: 2100, smsType: 'UNICODE', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '26th Mar 26, 2:00 PM' },
  { id: 12, name: 'Easter Celebration', created: '1 month ago', contacts: 1650, smsType: 'PLAIN', campaignType: 'NORMAL', status: 'DONE', deliveredAt: '20th Mar 26, 9:00 AM' },
];

const statusConfig: Record<string, { className: string }> = {
  SENDING: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  DONE: { className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  SCHEDULED: { className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  FAILED: { className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  CANCELLED: { className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
};

export function CampaignsView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      const matchSearch =
        campaign.name.toLowerCase().includes(search.toLowerCase()) ||
        String(campaign.contacts).includes(search);
      const matchStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* ─── Campaigns Table ─── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Actions bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SENDING">Sending</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Name</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Created</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 text-right">Contacts</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">SMS Type</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Campaign Type</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Date</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((campaign) => {
                  const cfg = statusConfig[campaign.status] || statusConfig.DONE;
                  const isSending = campaign.status === 'SENDING';
                  return (
                    <TableRow
                      key={campaign.id}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Name */}
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {campaign.name}
                        </span>
                      </TableCell>
                      {/* Created */}
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {campaign.created}
                        </span>
                      </TableCell>
                      {/* Contacts */}
                      <TableCell className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {campaign.contacts.toLocaleString()}
                        </span>
                      </TableCell>
                      {/* SMS Type */}
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {campaign.smsType}
                        </Badge>
                      </TableCell>
                      {/* Campaign Type */}
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {campaign.campaignType}
                        </Badge>
                      </TableCell>
                      {/* Status */}
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold px-2 py-0.5 ${cfg.className}`}
                        >
                          {isSending && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse" />
                          )}
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      {/* Date */}
                      <TableCell className="px-4 py-3">
                        <div className="space-y-0.5">
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {isSending
                              ? `Run At: ${campaign.runAt || ''}`
                              : `Delivered At: ${campaign.deliveredAt || ''}`}
                          </span>
                        </div>
                      </TableCell>
                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isSending ? (
                            <button
                              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                            </button>
                          ) : (
                            <>
                              <button
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title="Refresh"
                              >
                                <RefreshCw className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                              </button>
                              <button
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title="Chart"
                              >
                                <BarChart3 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                              </button>
                            </>
                          )}
                          <button
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Chart"
                          >
                            <BarChart3 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
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
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Empty state */}
          {paged.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No campaigns found</p>
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
