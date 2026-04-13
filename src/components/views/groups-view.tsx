'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolderOpen, Plus, Users, Edit, Trash2 } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  description?: string;
  status: string;
  contactCount?: number;
  createdAt: string;
}

export function GroupsView() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/groups');
      if (res.ok) setGroups(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/groups');
        if (res.ok && !cancelled) setGroups(await res.json());
      } catch {}
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ name: '', description: '' });
        fetchGroups();
      }
    } catch {}
    setSubmitting(false);
  };

  const totalContacts = groups.reduce((sum, g) => sum + (g.contactCount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><FolderOpen className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Total Groups</p><p className="text-lg font-bold text-slate-800">{groups.length}</p></div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-50 text-green-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Total Contacts</p><p className="text-lg font-bold text-slate-800">{totalContacts.toLocaleString()}</p></div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600"><FolderOpen className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Avg Contacts/Group</p><p className="text-lg font-bold text-slate-800">{groups.length ? Math.round(totalContacts / groups.length).toLocaleString() : 0}</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm text-slate-500">Contact Groups</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
              <Plus className="h-4 w-4 mr-2" />New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Contact Group</DialogTitle>
              <DialogDescription>Organize your contacts into groups</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Group Name</Label><Input placeholder="e.g., Premium Customers" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe this group..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting || !form.name} className="bg-blue-600 hover:bg-blue-700">{submitting ? 'Creating...' : 'Create Group'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="border-slate-200 hover:shadow-md transition-shadow group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {group.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{group.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{group.contactCount?.toLocaleString() || 0} contacts</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              {group.description && <p className="text-sm text-slate-500 mt-3 line-clamp-2">{group.description}</p>}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">{group.status}</Badge>
                <span className="text-xs text-slate-400 ml-auto">Created {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {groups.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No groups yet. Create your first contact group.</p>
          </div>
        )}
      </div>
    </div>
  );
}
