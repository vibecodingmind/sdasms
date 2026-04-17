'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Download, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Role { id: number; name: string; admins: number; status: string; permissions: string[]; }

export function AdminRolesView() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin-roles');
      const json = await res.json();
      if (json.data) {
        setRoles(json.data.map((r: Role) => ({ ...r, status: 'active' })));
      } else {
        setRoles([]);
      }
    } catch {
      setError('Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    if (!search) return roles;
    const q = search.toLowerCase();
    return roles.filter(r => r.name.toLowerCase().includes(q));
  }, [roles, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, total);

  const toggleStatus = (id: number) => setRoles(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r));
  const deleteRole = (id: number) => setRoles(prev => prev.filter(r => r.id !== id));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Loading roles...</p>
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
              <DialogHeader><DialogTitle>Create Role</DialogTitle></DialogHeader>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); setDialogOpen(false); }}>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label><Input placeholder="e.g. Support Admin" /></div>
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
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Admins</TableHead>
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Status</TableHead>
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-gray-400">No results available</TableCell></TableRow>
            ) : paginated.map(r => (
              <TableRow key={r.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                <TableCell><Checkbox className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" /></TableCell>
                <TableCell className="text-sm font-semibold text-gray-800">{r.name}</TableCell>
                <TableCell className="text-sm text-gray-500">{r.admins}</TableCell>
                <TableCell>
                  <Switch checked={r.status === 'active'} onCheckedChange={() => toggleStatus(r.id)} className="data-[state=checked]:bg-indigo-500" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50"><Edit2 className="h-4 w-4 text-blue-500" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50" onClick={() => deleteRole(r.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
