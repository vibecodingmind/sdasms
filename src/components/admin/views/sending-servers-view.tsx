'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SendingServer {
  id: number;
  name: string;
  type: string;
  types: string[];
  quota_value: number;
  quota_unit: string;
  status: string;
  settings: Record<string, string>;
}

const typeBadgeColors: Record<string, string> = {
  SMS: 'bg-purple-100 text-purple-700 border-purple-200',
  SCHEDULE: 'bg-green-100 text-green-700 border-green-200',
  WHATSAPP: 'bg-red-100 text-red-700 border-red-200',
  'TWO WAY': 'bg-blue-100 text-blue-700 border-blue-200',
  VOICE: 'bg-gray-200 text-gray-700 border-gray-300',
  OTP: 'bg-orange-100 text-orange-700 border-orange-200',
};

export function SendingServersView() {
  const [servers, setServers] = useState<SendingServer[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    fetch('/api/sending-servers')
      .then((r) => r.json())
      .then((r) => {
        if (r.data && r.data.length > 0) {
          setServers(r.data);
        } else {
          import('@/lib/mock-data').then((m) => setServers(m.mockSendingServers));
        }
      })
      .catch(() => {
        import('@/lib/mock-data').then((m) => setServers(m.mockSendingServers));
      });
  }, []);

  const filtered = useMemo(() => {
    if (!search) return servers;
    const q = search.toLowerCase();
    return servers.filter(
      (s) => s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
    );
  }, [servers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const startIdx = (currentPage - 1) * perPage + 1;
  const endIdx = Math.min(currentPage * perPage, filtered.length);

  const toggleServer = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
      setAllSelected(false);
    } else {
      setSelectedIds(new Set(paginated.map((s) => s.id)));
      setAllSelected(true);
    }
  };

  const toggleStatus = (id: number) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
          : s
      )
    );
  };

  const deleteServer = (id: number) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
          >
            Actions
            <ChevronLeft className="h-3 w-3 ml-1 rotate-90" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Plus className="h-4 w-4 mr-1.5" />
                Add New Server
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Sending Server</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
                  <Input placeholder="e.g. StarLink5G" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <Select defaultValue="SMS">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="TWO WAY">Two Way</SelectItem>
                      <SelectItem value="VOICE">Voice</SelectItem>
                      <SelectItem value="OTP">OTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quota (messages)</label>
                    <Input type="number" placeholder="5000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per</label>
                    <Select defaultValue="1 min">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 min">1 Minute</SelectItem>
                        <SelectItem value="1 hr">1 Hour</SelectItem>
                        <SelectItem value="1 day">1 Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key / URL</label>
                  <Input placeholder="https://api.example.com" />
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
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  />
                </TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Quota</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-400">No servers found</TableCell>
                </TableRow>
              ) : (
                paginated.map((server) => (
                  <TableRow key={server.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(server.id)}
                        onCheckedChange={() => toggleServer(server.id)}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-800">{server.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {server.types && server.types.length > 0 ? (
                          server.types.map((t) => (
                            <Badge
                              key={t}
                              variant="outline"
                              className={`text-[10px] font-semibold px-2 py-0.5 border ${typeBadgeColors[t] || 'bg-gray-100 text-gray-600'}`}
                            >
                              {t}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{server.quota_value.toLocaleString()}</span>
                        <span className="text-gray-400"> / </span>
                        <span className="text-gray-500">{server.quota_unit || '1 min'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">
                          {server.status === 'active' ? 'ON' : 'OFF'}
                        </span>
                        <Switch
                          checked={server.status === 'active'}
                          onCheckedChange={() => toggleStatus(server.id)}
                          className="data-[state=checked]:bg-indigo-500"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50" onClick={() => deleteServer(server.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50">
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
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
