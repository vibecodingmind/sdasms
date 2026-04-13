'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Route, Plus, Globe, Server, Settings } from 'lucide-react';

interface SmsRoute {
  id: number;
  name: string;
  sendingServerId: number;
  sendingServerName: string;
  connectType: string;
  countryIds: string[];
  status: string;
  createdAt: string;
}

export function SmsRoutesView() {
  const [routes, setRoutes] = useState<SmsRoute[]>([]);
  const [servers, setServers] = useState<{ id: number; name: string }[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', sendingServerId: '', connectType: 'http', countryIds: 'IN' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/sms-routes').then(r => r.ok && r.json()),
      fetch('/api/sending-servers').then(r => r.ok && r.json()),
    ]).then(([r, s]) => {
      if (r) setRoutes(r);
      if (s) setServers(s.map((sv: { id: number; name: string }) => ({ id: sv.id, name: sv.name })));
    }).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/sms-routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, countryIds: form.countryIds.split(',').map(c => c.trim()) }),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ name: '', sendingServerId: '', connectType: 'http', countryIds: 'IN' });
        const data = await fetch('/api/sms-routes').then(r => r.json());
        setRoutes(data);
      }
    } catch {}
    setSubmitting(false);
  };

  const countryFlags: Record<string, string> = { IN: '🇮🇳', US: '🇺🇸', UK: '🇬🇧', AE: '🇦🇪', SG: '🇸🇬', AU: '🇦🇺' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">SMS Routes</h2>
          <p className="text-sm text-slate-500">Configure routing rules for your SMS delivery</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />New Route</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create SMS Route</DialogTitle>
              <DialogDescription>Set up routing rules for SMS delivery</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Route Name</Label><Input placeholder="e.g., India Default Route" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Sending Server</Label>
                <Select value={form.sendingServerId} onValueChange={(v) => setForm({ ...form, sendingServerId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select server" /></SelectTrigger>
                  <SelectContent>
                    {servers.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Connection Type</Label>
                <Select value={form.connectType} onValueChange={(v) => setForm({ ...form, connectType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http">HTTP</SelectItem>
                    <SelectItem value="smpp">SMPP</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="otp">OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Country Codes (comma separated)</Label>
                <Input placeholder="IN, US, UK" value={form.countryIds} onChange={(e) => setForm({ ...form, countryIds: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting || !form.name || !form.sendingServerId} className="bg-blue-600 hover:bg-blue-700">{submitting ? 'Creating...' : 'Create Route'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {routes.map((route) => (
          <Card key={route.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Route className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{route.name}</h3>
                    <p className="text-sm text-slate-500">{route.sendingServerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {(route.countryIds || []).map(c => (
                      <span key={c} className="text-lg" title={c}>{countryFlags[c] || '🌍'}</span>
                    ))}
                  </div>
                  <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-600">{route.connectType}</Badge>
                  <Badge variant="secondary" className={route.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}>{route.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {routes.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Route className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No routes configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
