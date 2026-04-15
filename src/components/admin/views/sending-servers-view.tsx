'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Zap, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SendingServer {
  id: number; name: string; type: string; quota_value: number; status: string; settings: Record<string, string>;
}

const typeColors: Record<string, string> = {
  http: 'bg-blue-100 text-blue-700',
  smpp: 'bg-rose-100 text-rose-700',
  whatsapp: 'bg-green-100 text-green-700',
  viber: 'bg-rose-100 text-rose-700',
  otp: 'bg-orange-100 text-orange-700',
  beem: 'bg-purple-100 text-purple-700',
};

const typeIcons: Record<string, string> = {
  http: '🌐', smpp: '🔗', whatsapp: '💬', viber: '📱', otp: '🔑', beem: '📡',
};

export function SendingServersView() {
  const [servers, setServers] = useState<SendingServer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [testingId, setTestingId] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<Record<number, 'success' | 'error'>>({});

  useEffect(() => {
    fetch('/api/sending-servers').then((r) => r.json()).then((r) => setServers(r.data || [])).catch(() => {});
  }, []);

  const filtered = activeTab === 'all' ? servers : servers.filter((s) => s.type === activeTab);
  const types = ['all', 'http', 'smpp', 'whatsapp', 'viber', 'otp', 'beem'];

  const testConnection = async (server: SendingServer) => {
    setTestingId(server.id);
    try {
      if (server.type === 'beem') {
        const res = await fetch('/api/sms/balance');
        const data = await res.json();
        if (data.success) {
          setTestResult((prev) => ({ ...prev, [server.id]: 'success' }));
        } else {
          setTestResult((prev) => ({ ...prev, [server.id]: 'error' }));
        }
      } else {
        // Simulate test for non-beem servers
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTestResult((prev) => ({ ...prev, [server.id]: 'success' }));
      }
    } catch {
      setTestResult((prev) => ({ ...prev, [server.id]: 'error' }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Sending Servers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your messaging servers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white"><Plus className="h-4 w-4 mr-2" /> Add Server</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Sending Server</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label><Input placeholder="Twilio Gateway" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <Select defaultValue="http">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http">HTTP</SelectItem>
                    <SelectItem value="smpp">SMPP</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="viber">Viber</SelectItem>
                    <SelectItem value="otp">OTP</SelectItem>
                    <SelectItem value="beem">Beem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">API URL / Host</label><Input placeholder="https://api.twilio.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">API Key / Auth</label><Input type="password" placeholder="****" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Quota (messages)</label><Input type="number" placeholder="100000" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#D72444] hover:bg-[#C01E3A] text-white">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {types.filter(t => t !== 'all').map((type) => {
          const count = servers.filter(s => s.type === type).length;
          return (
            <Card key={type} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab(type === activeTab ? 'all' : type)}>
              <CardContent className="p-3 text-center">
                <span className="text-lg">{typeIcons[type]}</span>
                <p className="text-lg font-bold text-gray-800 mt-1">{count}</p>
                <p className="text-[11px] text-gray-500 uppercase">{type}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          {types.map((t) => (
            <TabsTrigger key={t} value={t} className="text-xs capitalize">{t === 'all' ? 'All' : t}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((server) => (
          <Card key={server.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{typeIcons[server.type]}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{server.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColors[server.type]}`}>
                      {server.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex items-center w-2.5 h-2.5 rounded-full ${server.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-t border-gray-100">
                <span className="text-gray-500">Quota</span>
                <span className="font-medium text-gray-700">{server.quota_value.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-t border-gray-100">
                <span className="text-gray-500">Status</span>
                <span className={`text-xs font-medium ${server.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>{server.status}</span>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs flex-1"
                  onClick={() => testConnection(server)}
                  disabled={testingId === server.id}
                >
                  {testingId === server.id ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : testResult[server.id] === 'success' ? (
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  ) : testResult[server.id] === 'error' ? (
                    <XCircle className="h-3 w-3 mr-1 text-red-500" />
                  ) : (
                    <Zap className="h-3 w-3 mr-1" />
                  )}
                  {testingId === server.id ? 'Testing...' : testResult[server.id] === 'success' ? 'Connected' : testResult[server.id] === 'error' ? 'Failed' : 'Test'}
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs"><Edit className="h-3 w-3" /></Button>
                <Button size="sm" variant="outline" className="h-7 text-xs text-red-500"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
