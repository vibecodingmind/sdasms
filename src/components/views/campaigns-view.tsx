'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Send, Clock, CheckCircle2, XCircle, AlertCircle, Calendar, MessageSquare, Phone, Filter } from 'lucide-react';

interface Campaign {
  id: number;
  campaignName: string;
  message: string;
  status: string;
  type?: string;
  contactCount: number;
  delivered: number;
  failed: number;
  createdAt: string;
  scheduleTime?: string;
  dltTemplateId?: string;
}

const statusColors: Record<string, string> = {
  done: 'bg-green-100 text-green-700',
  sending: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-slate-100 text-slate-700',
};

const statusIcons: Record<string, React.ElementType> = {
  done: CheckCircle2,
  sending: Send,
  scheduled: Clock,
  failed: XCircle,
  pending: AlertCircle,
  cancelled: XCircle,
};

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ campaignName: '', message: '', type: 'sms', scheduleType: 'onetime', dltTemplateId: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) setCampaigns(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/campaigns');
        if (res.ok && !cancelled) setCampaigns(await res.json());
      } catch {}
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = campaigns.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !c.campaignName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ campaignName: '', message: '', type: 'sms', scheduleType: 'onetime', dltTemplateId: '' });
        fetchCampaigns();
      }
    } catch {}
    setSubmitting(false);
  };

  const totalCampaigns = campaigns.length;
  const statusCounts = {
    sending: campaigns.filter(c => c.status === 'sending').length,
    scheduled: campaigns.filter(c => c.status === 'scheduled').length,
    done: campaigns.filter(c => c.status === 'done').length,
    failed: campaigns.filter(c => c.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', count: totalCampaigns, color: 'bg-slate-50 border-slate-200' },
          { label: 'Sending', count: statusCounts.sending, color: 'bg-blue-50 border-blue-200' },
          { label: 'Scheduled', count: statusCounts.scheduled, color: 'bg-yellow-50 border-yellow-200' },
          { label: 'Completed', count: statusCounts.done, color: 'bg-green-50 border-green-200' },
          { label: 'Failed', count: statusCounts.failed, color: 'bg-red-50 border-red-200' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-1 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sending">Sending</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Set up your messaging campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input placeholder="e.g., Flash Sale Weekend" value={form.campaignName} onChange={(e) => setForm({ ...form, campaignName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Channel Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">📱 SMS</SelectItem>
                    <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                    <SelectItem value="viber">📱 Viber</SelectItem>
                    <SelectItem value="otp">🔐 OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Type your message here..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <p className="text-xs text-slate-400 text-right">{form.message.length} / 160 characters</p>
              </div>
              {form.type === 'sms' && (
                <div className="space-y-2">
                  <Label>DLT Template ID</Label>
                  <Input placeholder="e.g., 1107163284567890123" value={form.dltTemplateId} onChange={(e) => setForm({ ...form, dltTemplateId: e.target.value })} />
                  <p className="text-xs text-slate-400">Required for Indian SMS delivery</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select value={form.scheduleType} onValueChange={(v) => setForm({ ...form, scheduleType: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onetime">Send Now</SelectItem>
                    <SelectItem value="scheduled">Schedule Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.scheduleType === 'scheduled' && (
                <div className="space-y-2">
                  <Label>Schedule Time</Label>
                  <Input type="datetime-local" onChange={(e) => console.log(e.target.value)} />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting || !form.campaignName || !form.message} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Campaign</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Contacts</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Delivered</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Failed</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((campaign) => {
                const StatusIcon = statusIcons[campaign.status] || AlertCircle;
                return (
                  <TableRow key={campaign.id} className="hover:bg-slate-50 cursor-pointer">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-800">{campaign.campaignName}</p>
                        <p className="text-xs text-slate-400 mt-0.5 max-w-[200px] truncate">{campaign.message}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs capitalize">
                        {campaign.type === 'whatsapp' && '💬'}{campaign.type === 'viber' && '📱'}{campaign.type === 'otp' && '🔐'}{campaign.type === 'sms' && '📱'} {campaign.type || 'sms'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[campaign.status] || ''}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell font-medium">{campaign.contactCount?.toLocaleString()}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell text-green-600 font-medium">{campaign.delivered?.toLocaleString()}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell text-red-600 font-medium">{campaign.failed?.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-slate-500">
                      {new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    No campaigns found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
