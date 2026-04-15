'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Trash2, BarChart3, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Campaign {
  id: number; name: string; customer: string; customer_email?: string; contacts: number;
  sms_type: string; campaign_type: string; status: string; created_at: string;
  delivered_at?: string; delivered?: number; failed?: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    DONE: 'bg-green-100 text-green-700',
    SCHEDULED: 'bg-blue-100 text-blue-700',
    active: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-600',
  };
  const s = status.toUpperCase();
  return <Badge variant="outline" className={`text-[10px] font-bold border-0 ${colors[s] || colors[status] || 'bg-gray-100 text-gray-700'}`}>{s}</Badge>;
};

export function CampaignsReportView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    setCampaigns([
      { id: 1, name: 'Test', customer: 'Redan Daycare Centre', customer_email: 'redandaycarecentre@gmail.com', contacts: 2, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'DONE', created_at: '2 hours ago', delivered_at: '15th Apr 26, 4:15 PM', delivered: 2, failed: 0 },
      { id: 2, name: 'MEJASTAR MEDICAL NEW', customer: 'MEJASTAR MEDICAL LIMITED', customer_email: 'mejastarmedicallimited@gmail.com', contacts: 1000, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'DONE', created_at: '3 hours ago', delivered_at: '15th Apr 26, 3:33 PM', delivered: 998, failed: 2 },
      { id: 3, name: 'TAARIFA KWA WANAUMOJA april 2026', customer: 'Mazinde Union', customer_email: 'mazineunion@gmail.com', contacts: 468, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'DONE', created_at: '8 hours ago', delivered_at: '15th Apr 26, 10:42 AM', delivered: 465, failed: 3 },
      { id: 4, name: 'Encouragement', customer: 'Alabaster Box Ministry', customer_email: 'alabasterbox@gmail.com', contacts: 1266, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'DONE', created_at: '9 hours ago', delivered_at: '15th Apr 26, 9:23 AM', delivered: 1260, failed: 6 },
      { id: 5, name: 'Test', customer: 'SAVIN MEDIA', customer_email: 'savpaulo@gmail.com', contacts: 4, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'DONE', created_at: '1 day ago', delivered_at: '14th Apr 26, 5:55 PM', delivered: 4, failed: 0 },
      { id: 6, name: 'MATUKIO YA WAGONJWA NA MSIBA APRIL 2026', customer: 'MEJASTAR MEDICAL LIMITED', customer_email: 'mejastarmedicallimited@gmail.com', contacts: 468, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'SCHEDULED', created_at: '14th Apr 26, 3:19 PM' },
      { id: 7, name: 'reminder', customer: 'Mazinde Union', customer_email: 'mazineunion@gmail.com', contacts: 4, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'SCHEDULED', created_at: '14th Apr 26, 11:18 AM' },
      { id: 8, name: 'KIKAO', customer: 'Alabaster Box Ministry', customer_email: 'alabasterbox@gmail.com', contacts: 3, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'SCHEDULED', created_at: '13th Apr 26, 11:20 PM' },
      { id: 9, name: 'Test', customer: 'SAVIN MEDIA', customer_email: 'savpaulo@gmail.com', contacts: 3, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'SCHEDULED', created_at: '13th Apr 26, 11:16 PM' },
      { id: 10, name: 'MEJASTAR MEDICAL NEW', customer: 'MEJASTAR MEDICAL LIMITED', customer_email: 'mejastarmedicallimited@gmail.com', contacts: 1010, sms_type: 'PLAIN', campaign_type: 'NORMAL', status: 'SCHEDULED', created_at: '13th Apr 26, 10:30 AM' },
    ]);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return campaigns;
    const q = search.toLowerCase();
    return campaigns.filter(c => c.name.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q));
  }, [campaigns, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, total);

  return (
    <div className="space-y-4">
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

      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-10"><Checkbox checked={allChecked} onCheckedChange={() => setAllChecked(!allChecked)} className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" /></TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Name</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Customer</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Contacts</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">SMS Type</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Campaign Type</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(c => (
                <TableRow key={c.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                  <TableCell><Checkbox className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" /></TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{c.customer}</TableCell>
                  <TableCell className="text-sm text-gray-600">{c.contacts.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] font-bold border-0 bg-purple-100 text-purple-700">{c.sms_type}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] font-bold border-0 bg-blue-100 text-blue-700">{c.campaign_type}</Badge></TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50"><BarChart3 className="h-4 w-4 text-blue-500" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
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
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pg: number;
              if (totalPages <= 5) pg = i + 1;
              else if (page <= 3) pg = i + 1;
              else if (page >= totalPages - 2) pg = totalPages - 4 + i;
              else pg = page - 2 + i;
              return (
                <Button key={pg} size="icon" variant={page === pg ? 'default' : 'outline'} className={`h-8 w-8 text-xs ${page === pg ? 'bg-indigo-600' : ''}`} onClick={() => setPage(pg)}>{pg}</Button>
              );
            })}
            {totalPages > 5 && page < totalPages - 2 && (
              <><span className="px-1">...</span><Button size="icon" variant="outline" className="h-8 w-8 text-xs" onClick={() => setPage(totalPages)}>{totalPages}</Button></>
            )}
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(totalPages)}><ChevronsRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
