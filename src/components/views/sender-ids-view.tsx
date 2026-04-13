'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tag, Plus, CheckCircle2, Clock, XCircle, Globe } from 'lucide-react';

interface SenderId {
  id: number;
  senderId: string;
  status: string;
  supportingCountries: string[];
  createdAt: string;
}

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  active: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  inactive: { color: 'bg-gray-100 text-gray-600', icon: XCircle },
};

const countryFlags: Record<string, string> = { IN: '🇮🇳', US: '🇺🇸', UK: '🇬🇧', AE: '🇦🇪', SG: '🇸🇬', AU: '🇦🇺' };

export function SenderIdsView() {
  const [senderIds, setSenderIds] = useState<SenderId[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ senderId: '', supportingCountries: 'IN' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/sender-ids').then(r => r.ok && r.json()).then(setSenderIds).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/sender-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: form.senderId, supportingCountries: form.supportingCountries.split(',').map(c => c.trim()) }),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ senderId: '', supportingCountries: 'IN' });
        const data = await fetch('/api/sender-ids').then(r => r.json());
        setSenderIds(data);
      }
    } catch {}
    setSubmitting(false);
  };

  const statusCounts = {
    active: senderIds.filter(s => s.status === 'active').length,
    pending: senderIds.filter(s => s.status === 'pending').length,
    inactive: senderIds.filter(s => s.status === 'inactive').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-50 text-green-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Active</p><p className="text-lg font-bold text-slate-800">{statusCounts.active}</p></div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Pending</p><p className="text-lg font-bold text-slate-800">{statusCounts.pending}</p></div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600"><Tag className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Total</p><p className="text-lg font-bold text-slate-800">{senderIds.length}</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm text-slate-500">Registered Sender IDs</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" size="sm"><Plus className="h-4 w-4 mr-2" />New Sender ID</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Sender ID</DialogTitle>
              <DialogDescription>Register a new sender ID for SMS delivery</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Sender ID</Label><Input placeholder="e.g., SMSPro (max 11 chars)" maxLength={11} value={form.senderId} onChange={(e) => setForm({ ...form, senderId: e.target.value.toUpperCase() })} /></div>
              <div className="space-y-2"><Label>Supporting Countries</Label><Input placeholder="IN, US, UK" value={form.supportingCountries} onChange={(e) => setForm({ ...form, supportingCountries: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting || !form.senderId} className="bg-blue-600 hover:bg-blue-700">{submitting ? 'Registering...' : 'Register'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Sender ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead className="hidden sm:table-cell">Registered</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {senderIds.map((sid) => {
                const config = statusConfig[sid.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <TableRow key={sid.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-slate-400" />
                        <span className="font-mono font-semibold text-slate-800">{sid.senderId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${config.color} capitalize`}>
                        <StatusIcon className="h-3 w-3 mr-1" />{sid.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {(sid.supportingCountries || []).map(c => (
                          <span key={c} className="text-lg" title={c}>{countryFlags[c] || '🌍'}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-slate-500">
                      {new Date(sid.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><XCircle className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {senderIds.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-400">No sender IDs registered</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
