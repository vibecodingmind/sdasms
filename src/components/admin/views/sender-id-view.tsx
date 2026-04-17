'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SenderId {
  id: number;
  sender_id: string;
  customer: string;
  customer_email: string;
  price: number;
  price_cycle: string;
  status: string;
  countries: string[];
}

export function SenderIdView() {
  const [senderIds, setSenderIds] = useState<SenderId[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockDropdown, setBlockDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sender-ids');
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setSenderIds(json.data);
      } else {
        setSenderIds([]);
      }
    } catch {
      setError('Failed to load sender IDs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    if (!search) return senderIds;
    const q = search.toLowerCase();
    return senderIds.filter(
      (s) =>
        s.sender_id.toLowerCase().includes(q) ||
        s.customer.toLowerCase().includes(q) ||
        s.customer_email.toLowerCase().includes(q)
    );
  }, [senderIds, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const startIdx = (currentPage - 1) * perPage + 1;
  const endIdx = Math.min(currentPage * perPage, filtered.length);

  const formatPrice = (price: number) => {
    return `Sh${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Loading sender IDs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertCircle className="h-6 w-6 text-red-400" />
        <p className="text-sm text-gray-500">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Without creating Sender ID plan, your customer can&apos;t send Sender ID request from their portal.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600">
            Actions
            <ChevronLeft className="h-3 w-3 ml-1 rotate-90" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Plus className="h-4 w-4 mr-1.5" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Sender ID</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDialogOpen(false);
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender ID</label>
                  <Input placeholder="e.g. MYCOMPANY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (Customer)</label>
                  <Input placeholder="Select customer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <Input type="number" placeholder="24900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                    <Select defaultValue="year">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="bg-teal-500 text-white border-teal-500 hover:bg-teal-600">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            Create Plan
          </Button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Sender ID</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Assign To</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Price</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">No sender IDs found</TableCell>
                </TableRow>
              ) : (
                paginated.map((s) => (
                  <TableRow key={s.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                    <TableCell className="text-sm font-semibold text-gray-800 font-mono">{s.sender_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">
                          {s.customer.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-500">{s.customer_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm font-semibold text-gray-800">{formatPrice(s.price)}</span>
                        <span className="text-xs text-gray-400 ml-0.5">/{s.price_cycle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 font-medium">
                        ACTIVE
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-300 hover:bg-orange-50 text-xs font-medium"
                          onClick={() => setBlockDropdown(blockDropdown === s.id ? null : s.id)}
                        >
                          Block
                          <ChevronLeft className="h-3 w-3 ml-1 rotate-90" />
                        </Button>
                        {blockDropdown === s.id && (
                          <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                            <button
                              className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => {
                                setSenderIds((prev) => prev.map((item) =>
                                  item.id === s.id ? { ...item, status: 'blocked' } : item
                                ));
                                setBlockDropdown(null);
                              }}
                            >
                              Block
                            </button>
                            <button
                              className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setSenderIds((prev) => prev.filter((item) => item.id !== s.id));
                                setBlockDropdown(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span>
          Showing {filtered.length > 0 ? startIdx : 0} to {endIdx} of {filtered.length} entries
        </span>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 mx-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) { page = i + 1; }
              else if (currentPage <= 3) { page = i + 1; }
              else if (currentPage >= totalPages - 2) { page = totalPages - 4 + i; }
              else { page = currentPage - 2 + i; }
              return (
                <Button
                  key={page}
                  size="icon"
                  variant={currentPage === page ? 'default' : 'outline'}
                  className={`h-8 w-8 text-xs ${currentPage === page ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

