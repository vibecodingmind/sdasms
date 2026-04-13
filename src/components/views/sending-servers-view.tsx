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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, Plus, Settings, Wifi, Activity, Globe, MessageSquare, Smartphone, Key } from 'lucide-react';

interface SendingServer {
  id: number;
  name: string;
  type: string;
  status: string;
  quotaValue?: number;
  smsPerRequest?: number;
  createdAt: string;
}

const typeIcons: Record<string, React.ElementType> = {
  http: Globe,
  smpp: Wifi,
  whatsapp: MessageSquare,
  viber: Smartphone,
  otp: Key,
};

const typeColors: Record<string, string> = {
  http: 'bg-blue-50 text-blue-600 border-blue-200',
  smpp: 'bg-purple-50 text-purple-600 border-purple-200',
  whatsapp: 'bg-green-50 text-green-600 border-green-200',
  viber: 'bg-violet-50 text-violet-600 border-violet-200',
  otp: 'bg-amber-50 text-amber-600 border-amber-200',
};

export function SendingServersView() {
  const [servers, setServers] = useState<SendingServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'http' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/sending-servers').then(r => r.ok && r.json()).then(d => { setServers(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? servers : servers.filter(s => s.type === tab);
  const activeCount = servers.filter(s => s.status === 'active').length;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/sending-servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ name: '', type: 'http' });
        const data = await fetch('/api/sending-servers').then(r => r.json());
        setServers(data);
      }
    } catch {}
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Server className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Total Servers</p><p className="text-lg font-bold text-slate-800">{servers.length}</p></div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-50 text-green-600"><Activity className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Active</p><p className="text-lg font-bold text-slate-800">{activeCount}</p></div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><Wifi className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">SMPP</p><p className="text-lg font-bold text-slate-800">{servers.filter(s => s.type === 'smpp').length}</p></div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><MessageSquare className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">WhatsApp</p><p className="text-lg font-bold text-slate-800">{servers.filter(s => s.type === 'whatsapp').length}</p></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="http">HTTP</TabsTrigger>
            <TabsTrigger value="smpp">SMPP</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="viber">Viber</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
          </TabsList>
        </Tabs>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />Add Server</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sending Server</DialogTitle>
              <DialogDescription>Configure a new messaging server</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Server Name</Label><Input placeholder="e.g., Twilio India" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http">🌐 HTTP API</SelectItem>
                    <SelectItem value="smpp">📶 SMPP</SelectItem>
                    <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                    <SelectItem value="viber">📱 Viber</SelectItem>
                    <SelectItem value="otp">🔐 OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting || !form.name} className="bg-blue-600 hover:bg-blue-700">{submitting ? 'Adding...' : 'Add Server'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((server) => {
          const TypeIcon = typeIcons[server.type] || Server;
          return (
            <Card key={server.id} className={`border ${typeColors[server.type]?.split(' ').slice(0, 1).join(' ') || 'border-slate-200'} hover:shadow-md transition-shadow group`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${typeColors[server.type]}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{server.name}</h3>
                      <Badge variant="secondary" className={`text-xs mt-0.5 capitalize ${server.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {server.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
                  <div><p className="text-xs text-slate-500">Quota</p><p className="text-sm font-medium text-slate-700">{server.quotaValue?.toLocaleString() || '—'}</p></div>
                  <div><p className="text-xs text-slate-500">Per Request</p><p className="text-sm font-medium text-slate-700">{server.smsPerRequest || '—'}</p></div>
                </div>
                <p className="text-xs text-slate-400 mt-3">Added {new Date(server.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            <Server className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No sending servers found for this type.</p>
          </div>
        )}
      </div>
    </div>
  );
}
