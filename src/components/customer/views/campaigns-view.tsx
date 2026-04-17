'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Eye, BarChart3, Trash2, RefreshCw, Download,
  MoreHorizontal, Clock, Plus, Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// ==================== TYPES ====================
interface CampaignRecord {
  id: number;
  name: string;
  type?: string;
  message?: string;
  contact_ids?: number[];
  created_at?: string;
  updated_at?: string;
  status: string;
  [key: string]: unknown;
}

const statusConfig: Record<string, { className: string }> = {
  SENDING: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  DONE: { className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  ACTIVE: { className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  COMPLETED: { className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  SCHEDULED: { className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  FAILED: { className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  CANCELLED: { className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  DRAFT: { className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
};

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Create dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('NORMAL');
  const [formMessage, setFormMessage] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/campaigns');
      const json = await res.json();
      if (json.success) {
        setCampaigns(json.data || []);
      } else {
        setError('Failed to load campaigns');
      }
    } catch {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
        toast.success('Campaign deleted successfully');
      } else {
        toast.error('Failed to delete campaign');
      }
    } catch {
      toast.error('Failed to delete campaign');
    }
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.error('Campaign name is required');
      return;
    }
    try {
      setCreating(true);
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          type: formType,
          message: formMessage.trim(),
          contact_ids: [],
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Campaign created successfully');
        setCreateDialogOpen(false);
        setFormName('');
        setFormType('NORMAL');
        setFormMessage('');
        fetchCampaigns();
      } else {
        toast.error(json.error || 'Failed to create campaign');
      }
    } catch {
      toast.error('Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  const filtered = useMemo(() => {
    return campaigns.filter((campaign) => {
      const name = String(campaign.name || '');
      const matchSearch =
        name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [campaigns, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#D72444]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-red-500">{error}</p>
        <Button variant="outline" onClick={fetchCampaigns}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Campaigns Table ─── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Actions bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SENDING">Sending</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={fetchCampaigns}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5 bg-[#D72444] hover:bg-[#C01E3A] text-white"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                New Campaign
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 dark:border-gray-800">
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Name</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Created</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Type</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((campaign) => {
                  const status = (campaign.status || 'DRAFT').toUpperCase();
                  const cfg = statusConfig[status] || statusConfig.DRAFT;
                  const isSending = status === 'SENDING';
                  return (
                    <TableRow
                      key={campaign.id}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Name */}
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {campaign.name}
                        </span>
                      </TableCell>
                      {/* Created */}
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {campaign.created_at
                            ? new Date(campaign.created_at).toLocaleDateString()
                            : '—'}
                        </span>
                      </TableCell>
                      {/* Type */}
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {campaign.type || 'NORMAL'}
                        </Badge>
                      </TableCell>
                      {/* Status */}
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold px-2 py-0.5 ${cfg.className}`}
                        >
                          {isSending && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse" />
                          )}
                          {status}
                        </Badge>
                      </TableCell>
                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                          </button>
                          <button
                            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Empty state */}
          {paged.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No campaigns found</p>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filtered.length)} of{' '}
                {filtered.length} entries
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Create Campaign Dialog ─── */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Campaign Name *</Label>
              <Input
                placeholder="Enter campaign name..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Campaign Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="RECURRING">Recurring</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</Label>
              <Textarea
                placeholder="Type your SMS message..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
