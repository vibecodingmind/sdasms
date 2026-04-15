'use client';

import React, { useState } from 'react';
import { Plus, Hash, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface SenderId {
  id: number;
  sender_id: string;
  status: 'active' | 'pending' | 'rejected';
  country: string;
  requested: string;
  approved: string | null;
}

const mockSenderIds: SenderId[] = [
  { id: 1, sender_id: 'ACMECORP', status: 'active', country: 'TZ', requested: '2024-01-10', approved: '2024-01-15' },
  { id: 2, sender_id: 'ACMEALERT', status: 'active', country: 'TZ', requested: '2024-03-20', approved: '2024-03-22' },
  { id: 3, sender_id: 'ACMENWS', status: 'pending', country: 'TZ', requested: '2025-01-08', approved: null },
];

const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  active: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  pending: { icon: <Clock className="h-3.5 w-3.5" />, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  rejected: { icon: <XCircle className="h-3.5 w-3.5" />, className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export function SenderIdsView() {
  const [senderIds] = useState<SenderId[]>(mockSenderIds);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSenderId, setNewSenderId] = useState('');

  const filtered = senderIds.filter((s) =>
    s.sender_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleRequest = () => {
    if (!newSenderId.trim()) {
      toast.error('Sender ID is required');
      return;
    }
    if (!/^[A-Za-z0-9]{3,11}$/.test(newSenderId)) {
      toast.error('Sender ID must be 3-11 alphanumeric characters');
      return;
    }
    toast.success(`Sender ID "${newSenderId}" request submitted for approval`);
    setDialogOpen(false);
    setNewSenderId('');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sender IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Request Sender ID
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{senderIds.filter((s) => s.status === 'active').length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{senderIds.filter((s) => s.status === 'pending').length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{senderIds.filter((s) => s.status === 'rejected').length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Sender IDs Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Sender ID</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Status</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Country</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Requested</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Approved</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sid) => {
                  const cfg = statusConfig[sid.status] || statusConfig.pending;
                  return (
                    <tr key={sid.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D72444]/10 text-[#D72444]">
                            <Hash className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-100">{sid.sender_id}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.className}`}>
                          {cfg.icon}
                          {sid.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{sid.country}</span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-xs text-gray-400">{sid.requested}</span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-400">{sid.approved || '—'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Hash className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No sender IDs found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Sender ID</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sender ID *</Label>
              <Input
                placeholder="e.g., MYCOMPANY"
                value={newSenderId}
                onChange={(e) => setNewSenderId(e.target.value.toUpperCase())}
                maxLength={11}
              />
              <p className="text-xs text-gray-400 mt-1">3-11 alphanumeric characters. Letters and numbers only.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handleRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
