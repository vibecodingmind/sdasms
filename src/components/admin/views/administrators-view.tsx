'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Download, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Admin { id: number; first_name: string; last_name: string; email: string; name?: string; role: string; status: string; created_at?: string; last_login?: string; }

export function AdministratorsView() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    fetch('/api/administrators').then(r => r.json()).then(r => {
      if (r.data?.length) { setAdmins(r.data); }
      else {
        import('@/lib/mock-data').then(m => setAdmins([
          { id: 1, first_name: 'Sub', last_name: 'ADMIN', email: 'admin@sdasms.com', role: 'Sub admin', status: 'inactive', created_at: '12th Sep 2025' },
          { id: 2, first_name: 'Godlisten', last_name: 'Admin', email: 'godlisten@sdasms.com', role: 'Administrator', status: 'active', created_at: '1st Jan 2025' },
        ]));
      }
    }).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!search) return admins;
    const q = search.toLowerCase();
    return admins.filter(a => `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
  }, [admins, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, total);

  const toggleStatus = (id: number) => setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a));
  const deleteAdmin = (id: number) => setAdmins(prev => prev.filter(a => a.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700">
            Actions <ChevronLeft className="h-3 w-3 ml-1 rotate-90" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white"><Plus className="h-4 w-4 mr-1.5" /> Create</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Administrator</DialogTitle></DialogHeader>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); setDialogOpen(false); }}>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><Input placeholder="Admin name" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><Input type="email" placeholder="admin@example.com" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><Input type="password" placeholder="••••••••" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <Select defaultValue="sub-admin">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="sub-admin">Sub admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-10"><Checkbox checked={allChecked} onCheckedChange={() => setAllChecked(!allChecked)} className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" /></TableHead>
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Name</TableHead>
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Roles</TableHead>
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Created At</TableHead>
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Status</TableHead>
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-gray-400">No results available</TableCell></TableRow>
            ) : paginated.map(a => (
              <TableRow key={a.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                <TableCell><Checkbox className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {a.first_name.charAt(0)}{a.last_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{a.name || `${a.first_name} ${a.last_name}`}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">{a.role}</TableCell>
                <TableCell className="text-sm text-gray-500">{a.created_at || a.last_login || '-'}</TableCell>
                <TableCell>
                  <Switch checked={a.status === 'active'} onCheckedChange={() => toggleStatus(a.id)} className="data-[state=checked]:bg-indigo-500" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50"><Edit2 className="h-4 w-4 text-blue-500" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50" onClick={() => deleteAdmin(a.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span>Showing {total > 0 ? startIdx : 0} to {endIdx} of {total} entries</span>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-8 w-8" disabled><ChevronsLeft className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
          <div className="flex items-center gap-1 mx-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <Button key={i + 1} size="icon" variant={page === i + 1 ? 'default' : 'outline'} className={`h-8 w-8 text-xs ${page === i + 1 ? 'bg-indigo-600' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</Button>
            ))}
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="h-8 w-8"><ChevronsRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
