'use client';

import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SmsRecord {
  id: number; customer: string; customer_email: string; date: string; direction: string;
  type: string; from: string; to: string; sms_count: number; cost: number;
  sending_server: string; status: string; message?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    delivered: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    sent: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    'Insufficient balance': 'bg-red-100 text-red-700',
    scheduled: 'bg-blue-100 text-blue-700',
  };
  return <Badge variant="outline" className={`text-[10px] font-bold border-0 ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</Badge>;
};

export function SmsHistoryView() {
  const [records, setRecords] = useState<SmsRecord[]>([
    { id: 1, customer: 'Redan Daycare Centre', customer_email: 'redandaycarecentre@gmail.com', date: '15th Apr 26, 4:19 PM', direction: 'OUTGOING', type: 'PLAIN', from: 'TAARIFA', to: '255783716563', sms_count: 1, cost: 0, sending_server: 'StarLink5G', status: 'Insufficient balance', message: 'Karibu Redan Daycare Centre...' },
    { id: 2, customer: 'MEJASTAR MEDICAL LIMITED', customer_email: 'mejastarmedicallimited@gmail.com', date: '15th Apr 26, 4:06 PM', direction: 'OUTGOING', type: 'PLAIN', from: 'MEDICALEQIP', to: '255754895335, 255784484822, 255692487053, 255659741703', sms_count: 4, cost: 0, sending_server: 'StarLink5G', status: 'delivered', message: 'Dear customer, your appointment has been confirmed...' },
    { id: 3, customer: 'SAVIN MEDIA', customer_email: 'savpaulo@gmail.com', date: '15th Apr 26, 3:45 PM', direction: 'OUTGOING', type: 'PLAIN', from: 'SAVINMEDIA', to: '255683000111', sms_count: 1, cost: 15, sending_server: 'StarLink5G', status: 'delivered', message: 'Tangazo: Pata bidhaa za bei nafuu...' },
    { id: 4, customer: 'Mazinde Union', customer_email: 'mazineunion@gmail.com', date: '15th Apr 26, 10:42 AM', direction: 'OUTGOING', type: 'PLAIN', from: 'TAARIFA', to: '255789000222, 255677000333, 255784000444', sms_count: 3, cost: 45, sending_server: 'StarLink5G', status: 'delivered', message: 'TAARIFA KWA WANAUMOJA april 2026...' },
  ]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search) return records;
    const q = search.toLowerCase();
    return records.filter(r => r.customer.toLowerCase().includes(q) || r.from.toLowerCase().includes(q) || r.to.includes(q));
  }, [records, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, total);

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700">
            Actions <ChevronLeft className="h-3 w-3 ml-1 rotate-90" />
          </Button>
          <Button variant="outline" className="bg-teal-500 text-white border-teal-500 hover:bg-teal-600">
            <Download className="h-4 w-4 mr-1.5" /> Export
          </Button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={String(perPage)} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Form */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Select Customer</label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Customer" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Customers</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sending Server</label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Sending Server" /></SelectTrigger>
                <SelectContent><SelectItem value="starlink">StarLink5G</SelectItem><SelectItem value="turbo">Turbo5G</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Direction</label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select one" /></SelectTrigger>
                <SelectContent><SelectItem value="outgoing">Outgoing</SelectItem><SelectItem value="incoming">Incoming</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select one" /></SelectTrigger>
                <SelectContent><SelectItem value="plain">Plain</SelectItem><SelectItem value="unicode">Unicode</SelectItem><SelectItem value="flash">Flash</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Message ID</label>
              <Input placeholder="Enter message ID" className="h-9 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Period</label>
              <Input type="date" defaultValue="2026-04-15" className="h-9 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select one" /></SelectTrigger>
                <SelectContent><SelectItem value="delivered">Delivered</SelectItem><SelectItem value="failed">Failed</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <Input placeholder="Phone number" className="h-9 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <Input placeholder="Sender ID" className="h-9 text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Customer</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Date</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Direction</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Type</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">From</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">To</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">SMS Count</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Cost</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Sending Server</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(r => (
                <React.Fragment key={r.id}>
                  <TableRow className="hover:bg-gray-50/50 border-b border-gray-100 cursor-pointer" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{r.customer}</p>
                        <p className="text-xs text-gray-400">{r.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{r.date}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] font-bold border-0 bg-purple-100 text-purple-700">{r.direction}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] font-bold border-0 bg-purple-100 text-purple-700">{r.type}</Badge></TableCell>
                    <TableCell className="text-sm text-gray-700 font-medium">{r.from}</TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[120px] truncate">{r.to}</TableCell>
                    <TableCell className="text-sm text-gray-600">{r.sms_count}</TableCell>
                    <TableCell className="text-sm text-gray-600">Sh{r.cost}</TableCell>
                    <TableCell className="text-sm text-gray-500">{r.sending_server}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50"><Eye className="h-4 w-4 text-blue-500" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === r.id && (
                    <TableRow className="bg-gray-50/30">
                      <TableCell colSpan={12} className="px-8 py-3">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Message Content</p>
                          <p className="text-sm text-gray-700">{r.message}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent></Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span>Showing {total > 0 ? startIdx : 0} to {endIdx} of {total} entries</span>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(1)}><ChevronsLeft className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <div className="flex items-center gap-1 mx-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <Button key={i + 1} size="icon" variant={page === i + 1 ? 'default' : 'outline'} className={`h-8 w-8 text-xs ${page === i + 1 ? 'bg-indigo-600' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</Button>
            ))}
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(totalPages)}><ChevronsRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
