'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Campaign {
  id: number; uid: string; name: string; customer: string; type: string;
  status: string; contacts: number; delivered: number; failed: number; date: string;
}

export function CampaignsReportView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetch('/api/reports?type=campaigns').then((r) => r.json()).then((r) => setCampaigns(r.data || [])).catch(() => {});
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchStatus && matchType;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      active: 'bg-blue-100 text-blue-700',
      scheduled: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-600',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || ''}`}>{status}</span>;
  };

  const typeBadge = (type: string) => {
    const map: Record<string, string> = {
      SMS: 'bg-blue-100 text-blue-700',
      WhatsApp: 'bg-green-100 text-green-700',
      OTP: 'bg-orange-100 text-orange-700',
      Viber: 'bg-rose-100 text-rose-700',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[type] || 'bg-gray-100 text-gray-600'}`}>{type}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Campaigns Report</h1>
        <p className="text-sm text-gray-500 mt-0.5">View campaign performance and analytics</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search campaigns..." className="pl-10" />
            </div>
            <Input type="date" defaultValue="2025-01-01" className="w-36 h-9 text-sm" />
            <Input type="date" defaultValue="2025-01-15" className="w-36 h-9 text-sm" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="OTP">OTP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-xs text-gray-500 font-medium">Campaign Name</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Customer</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Type</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden sm:table-cell">Contacts</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden sm:table-cell">Delivered</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">Failed</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Date</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelectedCampaign(c)}>
                    <TableCell className="text-sm font-medium text-gray-800">{c.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{c.customer}</TableCell>
                    <TableCell>{typeBadge(c.type)}</TableCell>
                    <TableCell>{statusBadge(c.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600 hidden sm:table-cell">{c.contacts.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-green-600 hidden sm:table-cell">{c.delivered.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-red-600 hidden md:table-cell">{c.failed.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-gray-500">{c.date}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-7 text-xs"><Eye className="h-3 w-3" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Detail Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Campaign: {selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Customer</p>
                  <p className="text-sm font-medium text-gray-800">{selectedCampaign.customer}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Type</p>
                  <p className="text-sm font-medium text-gray-800">{selectedCampaign.type}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Total Contacts</p>
                  <p className="text-sm font-medium text-gray-800">{selectedCampaign.contacts.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-sm font-medium">{statusBadge(selectedCampaign.status)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-green-600 mb-1">Delivered</p>
                  <p className="text-xl font-bold text-green-700">{selectedCampaign.delivered.toLocaleString()}</p>
                  <p className="text-xs text-green-500 mt-1">
                    {selectedCampaign.contacts > 0 ? ((selectedCampaign.delivered / selectedCampaign.contacts) * 100).toFixed(1) : 0}% delivery rate
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs text-red-600 mb-1">Failed</p>
                  <p className="text-xl font-bold text-red-700">{selectedCampaign.failed.toLocaleString()}</p>
                  <p className="text-xs text-red-500 mt-1">
                    {selectedCampaign.contacts > 0 ? ((selectedCampaign.failed / selectedCampaign.contacts) * 100).toFixed(1) : 0}% failure rate
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
