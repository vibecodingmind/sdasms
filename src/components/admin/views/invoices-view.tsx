'use client';

import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Invoice {
  id: number; invoice_no: string; customer: string; customer_email?: string;
  amount: number; status: string; date: string; type: string; details: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.charAt(0).toUpperCase() + status.slice(1);
  const colors: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700',
    Unpaid: 'bg-orange-100 text-orange-700',
    Pending: 'bg-orange-100 text-orange-700',
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-red-100 text-red-700',
  };
  return <Badge variant="outline" className={`text-[10px] font-bold border-0 ${colors[s] || colors[status] || 'bg-orange-100 text-orange-700'}`}>{s}</Badge>;
};

export function InvoicesView() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 752, invoice_no: '#752', customer: 'MEJASTAR MEDICAL LIMITED', customer_email: 'mejastarmedicallimited@gmail.com', amount: 0, status: 'Pending', date: '15th Apr 26, 1:17 PM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 1429 Sms Unit' },
    { id: 751, invoice_no: '#751', customer: 'ZAKAYO JOHN SHUSHU', customer_email: 'zakayoshushu@gmail.com', amount: 0, status: 'Pending', date: '15th Apr 26, 11:18 AM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 1933 Sms Unit' },
    { id: 750, invoice_no: '#750', customer: 'SAVIN MEDIA', customer_email: 'savpaulo@gmail.com', amount: 0, status: 'Pending', date: '9th Apr 26, 8:48 PM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 133 Sms Unit' },
    { id: 749, invoice_no: '#749', customer: 'AMANI MWAIPAJA', customer_email: 'mwaipaja02@gmail.com', amount: 0, status: 'Pending', date: '8th Apr 26, 9:04 PM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 200 Sms Unit' },
    { id: 748, invoice_no: '#748', customer: 'Mazinde Union', customer_email: 'mazineunion@gmail.com', amount: 0, status: 'Pending', date: '2nd Apr 26, 11:45 AM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 3571 Sms Unit' },
    { id: 747, invoice_no: '#747', customer: 'Ikiuzi High School', customer_email: 'ikiuzihigh@gmail.com', amount: 0, status: 'Pending', date: '1st Apr 26, 2:41 PM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 2143 Sms Unit' },
    { id: 746, invoice_no: '#746', customer: 'Ikizu High School', customer_email: 'ikiuzihigh@gmail.com', amount: 0, status: 'Pending', date: '1st Apr 26, 2:27 PM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 1786 Sms Unit' },
    { id: 745, invoice_no: '#745', customer: 'Redan Daycare Centre', customer_email: 'redandaycarecentre@gmail.com', amount: 0, status: 'Pending', date: '1st Apr 26, 2:25 PM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 500 Sms Unit' },
    { id: 744, invoice_no: '#744', customer: 'Young CEO Africa', customer_email: 'youngceoafrica@gmail.com', amount: 0, status: 'Pending', date: '25th Mar 26, 7:20 PM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 800 Sms Unit' },
    { id: 743, invoice_no: '#743', customer: 'Alabaster Box Ministry', customer_email: 'alabasterbox@gmail.com', amount: 0, status: 'Pending', date: '25th Mar 26, 2:20 PM', type: 'SUBSCRIPTION', details: 'Top up SMS unit: 1200 Sms Unit' },
  ]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(i => i.invoice_no.toLowerCase().includes(q) || i.customer.toLowerCase().includes(q));
  }, [invoices, search]);

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
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">#</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Date</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Customer</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Type</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Details</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Amount</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(inv => (
                <TableRow key={inv.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                  <TableCell className="text-sm font-mono text-gray-800">{inv.invoice_no}</TableCell>
                  <TableCell className="text-sm text-gray-500">{inv.date}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{inv.customer}</p>
                      <p className="text-xs text-gray-400">{inv.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] font-bold border-0 bg-gray-100 text-gray-600">{inv.type}</Badge></TableCell>
                  <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">{inv.details}</TableCell>
                  <TableCell className="text-sm font-semibold text-gray-800">Sh{inv.amount.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-orange-50"><Edit2 className="h-4 w-4 text-orange-500" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50"><Eye className="h-4 w-4 text-blue-500" /></Button>
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
