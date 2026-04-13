'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SmsRecord {
  id: number; from: string; to: string; message: string; status: string; cost: number; date: string;
}

export function SmsHistoryView() {
  const [records, setRecords] = useState<SmsRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    fetch('/api/reports').then((r) => r.json()).then((r) => setRecords(r.data.smsHistory || [])).catch(() => {});
  }, []);

  const filtered = records.filter((r) => {
    const matchSearch = `${r.from} ${r.to} ${r.message}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      sent: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">SMS History</h1>
          <p className="text-sm text-gray-500 mt-0.5">View all sent messages</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by sender, recipient, message..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Input type="date" defaultValue="2025-01-01" className="w-36 h-9 text-sm" />
              <Input type="date" defaultValue="2025-01-10" className="w-36 h-9 text-sm" />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-xs text-gray-500 font-medium w-12">ID</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">From</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">To</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden lg:table-cell">Message</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Cost</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-sm text-gray-500">#{r.id}</TableCell>
                    <TableCell className="text-sm font-mono font-medium text-gray-800">{r.from}</TableCell>
                    <TableCell className="text-sm text-gray-600">{r.to}</TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-xs truncate hidden lg:table-cell">{r.message}</TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-700">${r.cost.toFixed(3)}</TableCell>
                    <TableCell className="text-sm text-gray-500 hidden md:table-cell">{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
