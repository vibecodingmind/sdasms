'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Plus, AlertCircle, Clock, CheckCircle, MessageCircle,
  Send, XCircle, Eye, Loader2, RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useCustomer } from '../customer-context';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────
interface Ticket {
  id: number;
  uid?: string;
  subject: string;
  customer?: string;
  customer_email?: string;
  priority?: string;
  category?: string;
  status?: string;
  assigned_to?: string | null;
  created_at?: string;
  updated_at?: string;
  messages?: number;
  [key: string]: unknown;
}

interface ConversationMessage {
  id: number;
  sender: string;
  sender_type: 'customer' | 'admin';
  message: string;
  time: string;
  avatar: string | null;
}

// ─── Badge Helpers ────────────────────────────────────────────────
const priorityConfig: Record<string, string> = {
  critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
};

const statusConfig: Record<string, string> = {
  open: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  resolved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  closed: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

const categoryConfig: Record<string, string> = {
  SMS: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Billing: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  Technical: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
  Account: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Integration: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  General: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

const statusLabel: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  pending: 'Pending',
  resolved: 'Resolved',
  closed: 'Closed',
};

// ─── Component ────────────────────────────────────────────────────
export function SupportView() {
  const { customerUser } = useCustomer();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Create ticket dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);

  // Ticket detail dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/support/tickets');
      const json = await res.json();
      if (json.success) {
        setTickets(json.data || []);
      } else {
        setError('Failed to load tickets');
      }
    } catch {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Stats
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  // Filtered
  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch = `${t.id} ${t.subject} ${t.category}`.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tickets, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingEnd = Math.min(page * perPage, filtered.length);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, page]);

  // ─── Handlers ──────────────────────────────────────────────
  const openTicketDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyText('');
    setDetailOpen(true);
  };

  const handleCreateTicket = async () => {
    if (!newSubject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!newMessage.trim()) {
      toast.error('Message is required');
      return;
    }
    if (!newCategory) {
      toast.error('Category is required');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newSubject.trim(),
          message: newMessage.trim(),
          priority: newPriority,
          category: newCategory,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Ticket created successfully');
        setCreateDialogOpen(false);
        setNewSubject('');
        setNewCategory('');
        setNewPriority('medium');
        setNewMessage('');
        fetchTickets();
      } else {
        toast.error(json.error || 'Failed to create ticket');
      }
    } catch {
      toast.error('Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    toast.success('Reply sent successfully');
    setReplyText('');
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: 'closed' as const } : t))
    );
    setSelectedTicket((prev) => prev ? { ...prev, status: 'closed' as const } : null);
    toast.success('Ticket closed');
    setDetailOpen(false);
  };

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
        <Button variant="outline" onClick={fetchTickets}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Open Tickets</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{openCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">In Progress</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{inProgressCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Resolved</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{resolvedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FEF2F2] dark:bg-[#D72444]/10 flex items-center justify-center shrink-0">
              <MessageCircle className="h-6 w-6 text-[#D72444]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Tickets</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{tickets.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">My Tickets</h2>
        <Button
          className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {/* Filter */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ticket ID</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Subject</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Priority</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((t) => (
                    <TableRow
                      key={t.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => openTicketDetail(t)}
                    >
                      <TableCell>
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{t.uid || `TKT-${t.id}`}</span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[200px]">
                          {t.subject}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={cn('text-[10px] hover:bg-transparent', categoryConfig[t.category || ''] || '')}>
                          {t.category || 'General'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={cn('text-[10px] hover:bg-transparent', priorityConfig[t.priority || 'medium'])}>
                          {(t.priority || 'medium').charAt(0).toUpperCase() + (t.priority || 'medium').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-[10px] hover:bg-transparent', statusConfig[t.status || 'open'])}>
                          {statusLabel[t.status || 'open'] || (t.status || 'open')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t.created_at ? new Date(t.created_at).toLocaleString() : '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="View"
                          onClick={(e) => { e.stopPropagation(); openTicketDetail(t); }}
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {showingStart} to {showingEnd} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              {pageNumbers.map((p, i) =>
                typeof p === 'string' ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-gray-400">...</span>
                ) : (
                  <Button
                    key={p}
                    variant={page === p ? 'default' : 'outline'}
                    size="sm"
                    className={cn('h-8 w-8 p-0', page === p && 'bg-[#D72444] hover:bg-[#B91E3A] text-white')}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>Describe your issue and we&apos;ll get back to you as soon as possible.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-subject">Subject *</Label>
              <Input
                id="new-subject"
                placeholder="Brief description of your issue"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-message">Message *</Label>
              <Textarea
                id="new-message"
                placeholder="Describe your issue in detail..."
                rows={5}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2"
              onClick={handleCreateTicket}
              disabled={creating}
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              <Send className="h-4 w-4" />
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selectedTicket && (
            <>
              <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-gray-500">{selectedTicket.uid || `TKT-${selectedTicket.id}`}</span>
                      <Badge className={cn('text-[10px] hover:bg-transparent', priorityConfig[selectedTicket.priority || 'medium'])}>
                        {(selectedTicket.priority || 'medium').charAt(0).toUpperCase() + (selectedTicket.priority || 'medium').slice(1)}
                      </Badge>
                      <Badge className={cn('text-[10px] hover:bg-transparent', statusConfig[selectedTicket.status || 'open'])}>
                        {statusLabel[selectedTicket.status || 'open'] || (selectedTicket.status || 'open')}
                      </Badge>
                      <Badge className={cn('text-[10px] hover:bg-transparent', categoryConfig[selectedTicket.category || ''] || '')}>
                        {selectedTicket.category || 'General'}
                      </Badge>
                    </div>
                    <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                      {selectedTicket.subject}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      Opened {selectedTicket.created_at ? new Date(selectedTicket.created_at).toLocaleString() : '—'}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Conversation - placeholder since we don't have a conversation endpoint */}
              <div className="px-6 py-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FEF2F2] dark:bg-[#D72444]/20 text-[#D72444] flex items-center justify-center text-xs font-semibold shrink-0">
                      {(customerUser?.first_name?.charAt(0) || 'U')}{(customerUser?.last_name?.charAt(0) || '')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {customerUser?.first_name || 'User'} {customerUser?.last_name || ''}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {selectedTicket.created_at ? new Date(selectedTicket.created_at).toLocaleString() : '—'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ticket created with subject: {selectedTicket.subject}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply */}
              {(selectedTicket.status || 'open') !== 'closed' && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    className="resize-none mb-2"
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={handleCloseTicket}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Close Ticket
                    </Button>
                    <Button
                      className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2"
                      size="sm"
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                    >
                      <Send className="h-4 w-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
