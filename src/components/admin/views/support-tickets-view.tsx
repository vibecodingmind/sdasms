'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, ChevronDown, Eye, XCircle, Download, MessageCircle,
  Clock, CheckCircle, AlertCircle, X, Send, User, StickyNote,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────
interface Ticket {
  id: string;
  uid: string;
  subject: string;
  customer: string;
  customer_email: string;
  customer_plan?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  assigned_to: string | null;
  created: string;
  last_reply: string;
  messages: number;
}

interface ConversationMessage {
  id: number;
  sender: string;
  sender_type: 'customer' | 'admin';
  message: string;
  time: string;
  avatar: string | null;
}

// ─── Mock Data ────────────────────────────────────────────────────
const initialTickets: Ticket[] = [
  { id: 'TKT-001', uid: 'tkt-001', subject: 'Unable to send SMS to Tanzania numbers', customer: 'John Smith', customer_email: 'john@acmecorp.com', priority: 'high', category: 'SMS', status: 'open', assigned_to: 'Support Manager', created: '2025-01-15 09:30', last_reply: '2025-01-15 10:15', messages: 3 },
  { id: 'TKT-002', uid: 'tkt-002', subject: 'Billing discrepancy on last invoice', customer: 'Emma Williams', customer_email: 'emma@euromail.com', priority: 'medium', category: 'Billing', status: 'in_progress', assigned_to: 'Billing Admin', created: '2025-01-14 14:20', last_reply: '2025-01-15 08:45', messages: 5 },
  { id: 'TKT-003', uid: 'tkt-003', subject: 'API integration returning 503 errors', customer: 'James Wilson', customer_email: 'james@techfirm.com', priority: 'critical', category: 'Technical', status: 'open', assigned_to: 'Support Manager', created: '2025-01-15 11:00', last_reply: '2025-01-15 11:00', messages: 1 },
  { id: 'TKT-004', uid: 'tkt-004', subject: 'Request to increase SMS sending limit', customer: 'Tom Anderson', customer_email: 'tom@nordic.se', priority: 'low', category: 'Account', status: 'pending', assigned_to: null, created: '2025-01-13 16:30', last_reply: '2025-01-14 09:00', messages: 2 },
  { id: 'TKT-005', uid: 'tkt-005', subject: 'Sender ID verification pending for 2 weeks', customer: 'Sarah Johnson', customer_email: 'sarah@globaltech.com', priority: 'high', category: 'SMS', status: 'in_progress', assigned_to: 'Support Manager', created: '2025-01-10 08:00', last_reply: '2025-01-14 15:30', messages: 7 },
  { id: 'TKT-006', uid: 'tkt-006', subject: 'Account locked after multiple login attempts', customer: 'Michael Chen', customer_email: 'michael@asiainc.com', priority: 'critical', category: 'Account', status: 'resolved', assigned_to: 'Support Manager', created: '2025-01-12 22:15', last_reply: '2025-01-13 01:30', messages: 4 },
  { id: 'TKT-007', uid: 'tkt-007', subject: 'Payment via PayPal not reflecting in balance', customer: 'Maria Garcia', customer_email: 'maria@bizlat.com', priority: 'high', category: 'Billing', status: 'open', assigned_to: 'Billing Admin', created: '2025-01-15 07:45', last_reply: '2025-01-15 07:45', messages: 1 },
  { id: 'TKT-008', uid: 'tkt-008', subject: 'Contact group import failing with CSV upload', customer: 'David Brown', customer_email: 'david@startup.io', priority: 'medium', category: 'Technical', status: 'closed', assigned_to: 'Support Manager', created: '2025-01-08 11:00', last_reply: '2025-01-10 16:00', messages: 6 },
  { id: 'TKT-009', uid: 'tkt-009', subject: 'How to set up webhook for delivery reports', customer: 'Aisha Patel', customer_email: 'aisha@indiatech.in', priority: 'low', category: 'Integration', status: 'resolved', assigned_to: 'Support Manager', created: '2025-01-09 13:30', last_reply: '2025-01-11 10:00', messages: 3 },
  { id: 'TKT-010', uid: 'tkt-010', subject: 'Duplicate SMS messages being sent', customer: 'Lisa Martinez', customer_email: 'lisa@latamco.com', priority: 'high', category: 'SMS', status: 'in_progress', assigned_to: 'Support Manager', created: '2025-01-14 09:00', last_reply: '2025-01-15 07:00', messages: 8 },
  { id: 'TKT-011', uid: 'tkt-011', subject: 'Request for dedicated sending server', customer: 'Robert Taylor', customer_email: 'robert@mktgpro.com', priority: 'medium', category: 'General', status: 'pending', assigned_to: null, created: '2025-01-11 10:30', last_reply: '2025-01-12 14:00', messages: 2 },
  { id: 'TKT-012', uid: 'tkt-012', subject: 'Dark mode not saving preference', customer: 'Nina Kowalski', customer_email: 'nina@polandtel.pl', priority: 'low', category: 'Technical', status: 'open', assigned_to: 'Support Manager', created: '2025-01-14 16:00', last_reply: '2025-01-14 16:00', messages: 1 },
  { id: 'TKT-013', uid: 'tkt-013', subject: 'Subscription auto-renewal failed', customer: 'John Smith', customer_email: 'john@acmecorp.com', priority: 'high', category: 'Billing', status: 'resolved', assigned_to: 'Billing Admin', created: '2025-01-07 09:00', last_reply: '2025-01-08 11:30', messages: 4 },
  { id: 'TKT-014', uid: 'tkt-014', subject: 'SMS delivery reports delayed by 24 hours', customer: 'Emma Williams', customer_email: 'emma@euromail.com', priority: 'medium', category: 'Integration', status: 'open', assigned_to: 'Support Manager', created: '2025-01-15 08:00', last_reply: '2025-01-15 08:00', messages: 1 },
  { id: 'TKT-015', uid: 'tkt-015', subject: 'Feature request: bulk contact import via API', customer: 'James Wilson', customer_email: 'james@techfirm.com', priority: 'low', category: 'General', status: 'pending', assigned_to: null, created: '2025-01-13 15:00', last_reply: '2025-01-13 15:00', messages: 1 },
];

const mockConversation: Record<string, ConversationMessage[]> = {
  'tkt-001': [
    { id: 1, sender: 'John Smith', sender_type: 'customer', message: "Hi, I've been trying to send SMS messages to Tanzania numbers (+255...) but they keep failing with a \"Destination unavailable\" error. This started happening about 2 hours ago. My sender ID is ACMECORP and I'm on the Enterprise plan.", time: '2025-01-15 09:30', avatar: null },
    { id: 2, sender: 'Support Manager', sender_type: 'admin', message: 'Hi John, thank you for reaching out. I can see your account and I\'m checking the Beem gateway logs now. It looks like there might be a temporary issue with the Tanzania routing. Let me investigate further.', time: '2025-01-15 10:00', avatar: null },
    { id: 3, sender: 'Support Manager', sender_type: 'admin', message: "Update: We've identified the issue. The Beem gateway is experiencing a temporary outage for Tanzania DNO routing. Our team has escalated this to Beem's support team. Estimated resolution time is 2-4 hours. I'll keep you updated.", time: '2025-01-15 10:15', avatar: null },
  ],
  'tkt-002': [
    { id: 1, sender: 'Emma Williams', sender_type: 'customer', message: 'I noticed a discrepancy in my last invoice. I was charged $249.99 but my plan is $199.99/month. Could you please look into this?', time: '2025-01-14 14:20', avatar: null },
    { id: 2, sender: 'Billing Admin', sender_type: 'admin', message: 'Hi Emma, I\'m looking into this now. Let me pull up your invoice details.', time: '2025-01-14 14:45', avatar: null },
    { id: 3, sender: 'Billing Admin', sender_type: 'admin', message: 'I can see the issue. There was an additional $50 charge for a one-time SMS credit top-up on January 10th. This is in addition to your regular monthly plan.', time: '2025-01-14 15:00', avatar: null },
    { id: 4, sender: 'Emma Williams', sender_type: 'customer', message: 'I don\'t recall requesting a top-up. Can you verify when and how this was initiated?', time: '2025-01-14 16:30', avatar: null },
    { id: 5, sender: 'Billing Admin', sender_type: 'admin', message: 'After reviewing, the top-up was initiated through the API using your account credentials. We\'re still investigating. I\'ll update you shortly.', time: '2025-01-15 08:45', avatar: null },
  ],
  'tkt-003': [
    { id: 1, sender: 'James Wilson', sender_type: 'customer', message: 'Our API integration with your SMS service is returning 503 errors consistently since this morning. We have critical campaigns scheduled. This is urgent.', time: '2025-01-15 11:00', avatar: null },
  ],
};

const AGENTS = ['Support Manager', 'Billing Admin', 'Technical Lead', 'Unassigned'];

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
export function SupportTicketsView() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const perPage = 10;

  // Ticket detail dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [detailStatus, setDetailStatus] = useState<string>('');
  const [detailPriority, setDetailPriority] = useState<string>('');
  const [detailAssignee, setDetailAssignee] = useState<string>('');

  // Stats
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedToday = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  // ─── Derived data ──────────────────────────────────────────
  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        `${t.id} ${t.subject} ${t.customer} ${t.customer_email}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchSearch && matchStatus && matchPriority && matchCategory;
    });
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingEnd = Math.min(page * perPage, filtered.length);

  const allOnPageSelected = paged.length > 0 && paged.every((t) => selectedIds.has(t.uid));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      const newSet = new Set(selectedIds);
      paged.forEach((t) => newSet.delete(t.uid));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      paged.forEach((t) => newSet.add(t.uid));
      setSelectedIds(newSet);
    }
  };

  const toggleSelect = (uid: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(uid)) newSet.delete(uid);
    else newSet.add(uid);
    setSelectedIds(newSet);
  };

  // ─── Page numbers ──────────────────────────────────────────
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
    setDetailStatus(ticket.status);
    setDetailPriority(ticket.priority);
    setDetailAssignee(ticket.assigned_to || '');
    setReplyText('');
    setInternalNote('');
    setDetailOpen(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    toast.success('Reply sent successfully');
    setReplyText('');
  };

  const handleSaveInternalNote = () => {
    if (!internalNote.trim()) return;
    toast.success('Internal note saved');
    setInternalNote('');
  };

  const handleUpdateStatus = () => {
    if (!selectedTicket || detailStatus === selectedTicket.status) return;
    setTickets((prev) =>
      prev.map((t) => (t.uid === selectedTicket.uid ? { ...t, status: detailStatus as Ticket['status'] } : t))
    );
    setSelectedTicket((prev) => prev ? { ...prev, status: detailStatus as Ticket['status'] } : null);
    toast.success('Status updated');
  };

  const handleUpdatePriority = () => {
    if (!selectedTicket || detailPriority === selectedTicket.priority) return;
    setTickets((prev) =>
      prev.map((t) => (t.uid === selectedTicket.uid ? { ...t, priority: detailPriority as Ticket['priority'] } : t))
    );
    setSelectedTicket((prev) => prev ? { ...prev, priority: detailPriority as Ticket['priority'] } : null);
    toast.success('Priority updated');
  };

  const handleAssign = () => {
    if (!selectedTicket) return;
    const newAssignee = detailAssignee === 'Unassigned' ? null : detailAssignee;
    setTickets((prev) =>
      prev.map((t) => (t.uid === selectedTicket.uid ? { ...t, assigned_to: newAssignee } : t))
    );
    setSelectedTicket((prev) => prev ? { ...prev, assigned_to: newAssignee } : null);
    toast.success('Ticket assigned');
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    setTickets((prev) =>
      prev.map((t) => (t.uid === selectedTicket.uid ? { ...t, status: 'closed' as const } : t))
    );
    setSelectedTicket((prev) => prev ? { ...prev, status: 'closed' as const } : null);
    setDetailStatus('closed');
    toast.success('Ticket closed');
  };

  const handleBulkAction = (action: string) => {
    const count = selectedIds.size;
    if (count === 0) {
      toast.error('No tickets selected');
      return;
    }
    if (action === 'close') {
      setTickets((prev) =>
        prev.map((t) => (selectedIds.has(t.uid) ? { ...t, status: 'closed' as const } : t))
      );
      toast.success(`${count} ticket(s) closed`);
    } else if (action === 'delete') {
      setTickets((prev) => prev.filter((t) => !selectedIds.has(t.uid)));
      toast.success(`${count} ticket(s) deleted`);
    }
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    toast.success('Tickets exported to CSV');
  };

  const conversation = selectedTicket
    ? mockConversation[selectedTicket.uid] || [
        { id: 1, sender: selectedTicket.customer, sender_type: 'customer' as const, message: selectedTicket.subject, time: selectedTicket.created, avatar: null },
      ]
    : [];

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
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Resolved Today</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{resolvedToday}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
              <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Avg Response</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">2.4 hrs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ticket ID, subject, customer..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full lg:w-40">
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
            <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full lg:w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full lg:w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Category</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Account">Account</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Integration">Integration</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2">
              Actions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleBulkAction('close')}>
              Close Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600 focus:text-red-600">
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead className="w-12">
                    <Checkbox checked={allOnPageSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ticket ID</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Subject</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Customer</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">Priority</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">Category</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden xl:table-cell">Assigned To</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden xl:table-cell">Last Reply</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12 text-gray-400">
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((t) => (
                    <TableRow
                      key={t.uid}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => openTicketDetail(t)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(t.uid)}
                          onCheckedChange={() => toggleSelect(t.uid)}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{t.id}</span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[200px]">
                          {t.subject}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{t.customer}</p>
                          <p className="text-xs text-gray-400">{t.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={cn('text-[10px] hover:bg-transparent', priorityConfig[t.priority])}>
                          {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge className={cn('text-[10px] hover:bg-transparent', categoryConfig[t.category] || '')}>
                          {t.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-[10px] hover:bg-transparent', statusConfig[t.status])}>
                          {statusLabel[t.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.assigned_to || '—'}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.created}</span>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.last_reply}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="View"
                            onClick={(e) => { e.stopPropagation(); openTicketDetail(t); }}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          {t.status !== 'closed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                              title="Close"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTickets((prev) => prev.map((tk) => (tk.uid === t.uid ? { ...tk, status: 'closed' as const } : tk)));
                                toast.success('Ticket closed');
                              }}
                            >
                              <XCircle className="h-4 w-4 text-gray-500" />
                            </Button>
                          )}
                        </div>
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

      {/* Ticket Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedTicket && (
            <>
              <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{selectedTicket.id}</span>
                      <Badge className={cn('text-[10px] hover:bg-transparent', priorityConfig[selectedTicket.priority])}>
                        {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                      </Badge>
                      <Badge className={cn('text-[10px] hover:bg-transparent', statusConfig[selectedTicket.status])}>
                        {statusLabel[selectedTicket.status]}
                      </Badge>
                      <Badge className={cn('text-[10px] hover:bg-transparent', categoryConfig[selectedTicket.category] || '')}>
                        {selectedTicket.category}
                      </Badge>
                    </div>
                    <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                      {selectedTicket.subject}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      Opened {selectedTicket.created} &middot; {selectedTicket.messages} messages
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {selectedTicket.status !== 'closed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 border-gray-300 dark:border-gray-600"
                        onClick={handleCloseTicket}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Close Ticket
                      </Button>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="flex flex-col lg:flex-row">
                {/* Main content */}
                <div className="flex-1 min-w-0">
                  {/* Customer info */}
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FEF2F2] dark:bg-[#D72444]/20 flex items-center justify-center text-[#D72444] text-xs font-semibold shrink-0">
                      {selectedTicket.customer.split(' ').map((n) => n.charAt(0)).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selectedTicket.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTicket.customer_email} &middot; Enterprise Plan</p>
                    </div>
                  </div>

                  {/* Conversation thread */}
                  <div className="px-6 py-4 max-h-96 overflow-y-auto space-y-4">
                    {conversation.map((msg) => (
                      <div key={msg.id} className={cn('flex gap-3', msg.sender_type === 'admin' && 'flex-row-reverse')}>
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
                          msg.sender_type === 'admin'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        )}>
                          {msg.sender_type === 'admin' ? 'SA' : msg.sender.split(' ').map((n) => n.charAt(0)).join('')}
                        </div>
                        <div className={cn('flex-1 min-w-0', msg.sender_type === 'admin' && 'flex flex-col items-end')}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{msg.sender}</span>
                            <span className="text-[10px] text-gray-400">{msg.time}</span>
                          </div>
                          <div className={cn(
                            'rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 max-w-[85%]',
                            msg.sender_type === 'admin'
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'bg-gray-100 dark:bg-gray-800'
                          )}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply area */}
                  {selectedTicket.status !== 'closed' && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex justify-end mt-2">
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
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-4 space-y-4 shrink-0">
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</Label>
                    <Select value={detailStatus} onValueChange={setDetailStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleUpdateStatus}>
                      Update Status
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</Label>
                    <Select value={detailPriority} onValueChange={setDetailPriority}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleUpdatePriority}>
                      Update Priority
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assign To</Label>
                    <Select value={detailAssignee} onValueChange={setDetailAssignee}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGENTS.map((agent) => (
                          <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleAssign}>
                      Assign
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                      <StickyNote className="h-3.5 w-3.5" />
                      Internal Note
                    </Label>
                    <Textarea
                      placeholder="Add internal note..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      rows={3}
                      className="resize-none text-xs"
                    />
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleSaveInternalNote} disabled={!internalNote.trim()}>
                      Save Note
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
