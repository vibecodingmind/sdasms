'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Upload, Download, Filter, Users, UserPlus, UserMinus, Ban } from 'lucide-react';

interface Contact {
  id: number;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status: string;
  createdAt: string;
}

interface Group {
  id: number;
  name: string;
}

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ phone: '', firstName: '', lastName: '', email: '', groupId: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15', search, status: statusFilter, group: groupFilter });
    try {
      const res = await fetch(`/api/contacts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts);
        setTotal(data.total);
      }
    } catch {}
    setLoading(false);
  }, [page, search, statusFilter, groupFilter]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '15', search, status: statusFilter, group: groupFilter });
      try {
        const res = await fetch(`/api/contacts?${params}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setContacts(data.contacts);
          setTotal(data.total);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [page, search, statusFilter, groupFilter]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/groups').then(r => r.ok ? r.json() : null).then(d => { if (d && !cancelled) setGroups(d); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ phone: '', firstName: '', lastName: '', email: '', groupId: '' });
        fetchContacts();
      }
    } catch {}
    setSubmitting(false);
  };

  const statusCounts = {
    subscribed: contacts.filter(c => c.status === 'subscribed').length,
    unsubscribed: contacts.filter(c => c.status === 'unsubscribed').length,
    blacklisted: contacts.filter(c => c.status === 'blacklisted').length,
  };

  const statusColors: Record<string, string> = {
    subscribed: 'bg-green-100 text-green-700',
    unsubscribed: 'bg-yellow-100 text-yellow-700',
    blacklisted: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Contacts', count: total, icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Subscribed', count: statusCounts.subscribed, icon: UserPlus, color: 'bg-green-50 text-green-600' },
          { label: 'Unsubscribed', count: statusCounts.unsubscribed, icon: UserMinus, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Blacklisted', count: statusCounts.blacklisted, icon: Ban, color: 'bg-red-50 text-red-600' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.color.replace('text-', 'border-').split(' ')[0]} border-slate-200`}>
            <div className={`p-2 rounded-lg ${s.color}`}><s.icon className="h-4 w-4" /></div>
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-lg font-bold text-slate-800">{s.count.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search contacts..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="subscribed">Subscribed</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              <SelectItem value="blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupFilter} onValueChange={(v) => { setGroupFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Group" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map(g => <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>Add a contact to your list</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>First Name</Label><Input placeholder="John" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Last Name</Label><Input placeholder="Doe" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Phone Number</Label><Input placeholder="+919876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input placeholder="john@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Group</Label>
                  <Select value={form.groupId} onValueChange={(v) => setForm({ ...form, groupId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                    <SelectContent>
                      {groups.map(g => <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={submitting || !form.phone} className="bg-blue-600 hover:bg-blue-700">{submitting ? 'Adding...' : 'Add Contact'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                        {c.firstName?.[0]}{c.lastName?.[0]}
                      </div>
                      <span className="font-medium text-slate-800">{c.firstName} {c.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-mono text-sm">{c.phone}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColors[c.status] || ''}>{c.status}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-slate-500 text-sm">{c.email || '-'}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {contacts.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-400">No contacts found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {total > 15 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-slate-500">Showing {((page - 1) * 15) + 1}-{Math.min(page * 15, total)} of {total}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page * 15 >= total}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
