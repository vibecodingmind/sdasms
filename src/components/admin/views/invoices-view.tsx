'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Invoice {
  id: number; invoice_no: string; customer: string; amount: number; status: string; date: string; type: string;
}

export function InvoicesView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    fetch('/api/invoices').then((r) => r.json()).then((r) => setInvoices(r.data || [])).catch(() => {});
  }, []);

  const filtered = invoices.filter((inv) => {
    const matchSearch = `${inv.invoice_no} ${inv.customer}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const statusBadge = (status: string) => {
    return status === 'paid'
      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Paid</span>
      : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Unpaid</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage billing invoices</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoices', value: invoices.length, color: 'text-gray-800' },
          { label: 'Paid', value: invoices.filter(i => i.status === 'paid').length, color: 'text-green-600' },
          { label: 'Unpaid', value: invoices.filter(i => i.status === 'unpaid').length, color: 'text-red-600' },
          { label: 'Total Revenue', value: `$${invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}`, color: 'text-[#D72444]' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search invoices..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
            </div>
            <Input type="date" defaultValue="2024-01-01" className="w-36 h-9 text-sm" />
            <Input type="date" defaultValue="2025-01-15" className="w-36 h-9 text-sm" />
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
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
                  <TableHead className="text-xs text-gray-500 font-medium">Invoice #</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Customer</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Amount</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Type</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-sm font-mono font-medium text-gray-800">{inv.invoice_no}</TableCell>
                    <TableCell className="text-sm text-gray-600">{inv.customer}</TableCell>
                    <TableCell className="text-sm font-semibold text-gray-800">${inv.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">{inv.type}</span>
                    </TableCell>
                    <TableCell>{statusBadge(inv.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500 hidden md:table-cell">{inv.date}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                    </TableCell>
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
