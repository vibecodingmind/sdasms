'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, ChevronDown, Trash2, Send, Bell, MessageSquare,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { mockAnnouncements, mockCustomers } from '@/lib/mock-data';

// ─── Types ────────────────────────────────────────────────────────
interface Announcement {
  id: number;
  title: string;
  message: string;
  status: string;
  created: string;
}

// ─── Component ────────────────────────────────────────────────────
export function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState('announcements');

  // Announcements tab state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Send Announcement tab state
  const [annSendTo, setAnnSendTo] = useState<'all' | 'select'>('all');
  const [annSelectedCustomers, setAnnSelectedCustomers] = useState<Set<number>>(new Set());
  const [annCustomerSearch, setAnnCustomerSearch] = useState('');
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annSendEmail, setAnnSendEmail] = useState(false);

  // Send by SMS tab state
  const [smsSenderId, setSmsSenderId] = useState('SDASMS');
  const [smsMessage, setSmsMessage] = useState('');
  const [smsSendToAll, setSmsSendToAll] = useState(true);
  const [smsSelectedGroups, setSmsSelectedGroups] = useState<Set<string>>(new Set());
  const [smsSelectedCustomers, setSmsSelectedCustomers] = useState<Set<number>>(new Set());
  const [smsCustomerSearch, setSmsCustomerSearch] = useState('');

  const SENDER_IDS = ['SDASMS', 'ACMECORP', 'GLOBALTECH'];
  const CUSTOMER_GROUPS = ['All Customers', 'Royal Customers', 'Premium Customers', 'Standard Customers', 'Trial Users'];

  // Load data
  useEffect(() => {
    setAnnouncements(mockAnnouncements);
  }, []);

  // ─── Announcements Tab: Derived data ───────────────────────
  const filtered = useMemo(() => {
    return announcements.filter((a) =>
      `${a.title} ${a.message}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [announcements, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const showingEnd = Math.min(page * rowsPerPage, filtered.length);

  // ─── Page numbers for pagination ───────────────────────────
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

  // ─── Selection ─────────────────────────────────────────────
  const allOnPageSelected = paged.length > 0 && paged.every((a) => selectedIds.has(a.id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      const newSet = new Set(selectedIds);
      paged.forEach((a) => newSet.delete(a.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      paged.forEach((a) => newSet.add(a.id));
      setSelectedIds(newSet);
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // ─── Handlers ──────────────────────────────────────────────
  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast.success('Announcement deleted');
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;
    if (count === 0) {
      toast.error('No announcements selected');
      return;
    }
    setAnnouncements((prev) => prev.filter((a) => !selectedIds.has(a.id)));
    setSelectedIds(new Set());
    toast.success(`${count} announcement(s) deleted`);
  };

  // ─── Send Announcement handler ─────────────────────────────
  const handlePublishAnnouncement = () => {
    if (!annTitle.trim() || !annMessage.trim()) {
      toast.error('Title and message are required');
      return;
    }
    const newAnn: Announcement = {
      id: Math.max(...announcements.map((a) => a.id), 0) + 1,
      title: annTitle,
      message: annMessage,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    toast.success('Announcement published to dashboard');
    setAnnTitle('');
    setAnnMessage('');
    setAnnSendEmail(false);
    setAnnSelectedCustomers(new Set());
    setAnnSendTo('all');
    setActiveTab('announcements');
  };

  // ─── Send SMS handler ──────────────────────────────────────
  const handleSendSMS = () => {
    if (!smsMessage.trim()) {
      toast.error('SMS message is required');
      return;
    }
    let recipientCount = 0;
    if (smsSendToAll) {
      recipientCount = mockCustomers.length;
    } else {
      recipientCount = smsSelectedCustomers.size;
    }
    if (recipientCount === 0) {
      toast.error('Please select recipients');
      return;
    }
    toast.success(`SMS sent to ${recipientCount} customers via Beem`);
    setSmsMessage('');
    setSmsSelectedCustomers(new Set());
    setSmsSelectedGroups(new Set());
    setSmsSendToAll(true);
  };

  // ─── Customer lists ────────────────────────────────────────
  const filteredAnnCustomers = mockCustomers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email}`
      .toLowerCase()
      .includes(annCustomerSearch.toLowerCase())
  );

  const filteredSmsCustomers = mockCustomers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email}`
      .toLowerCase()
      .includes(smsCustomerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Announcements</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage system announcements and communications</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent p-0 gap-0 h-auto">
          {[
            { value: 'announcements', label: 'ANNOUNCEMENTS' },
            { value: 'send-announcement', label: 'SEND ANNOUNCEMENT' },
            { value: 'send-by-sms', label: 'SEND BY SMS' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`rounded-none border-b-2 px-4 py-2.5 text-xs font-semibold tracking-wide transition-all data-[state=active]:shadow-none ${
                activeTab === tab.value
                  ? 'bg-[#D72444] text-white border-[#D72444]'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ─── ANNOUNCEMENTS TAB ──────────────────────────── */}
        <TabsContent value="announcements" className="mt-6 space-y-4">
          {/* Actions & Filter bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2">
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600 focus:text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Select
                value={String(rowsPerPage)}
                onValueChange={(v) => {
                  setRowsPerPage(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search announcements..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-10"
                />
              </div>
            </div>
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
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Title</TableHead>
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Created At</TableHead>
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-gray-400">
                          No results available
                        </TableCell>
                      </TableRow>
                    ) : (
                      paged.map((a) => (
                        <TableRow key={a.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.has(a.id)}
                              onCheckedChange={() => toggleSelect(a.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{a.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-md">{a.message}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 dark:text-gray-400">{a.created}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete"
                              onClick={() => handleDeleteAnnouncement(a.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
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
                        className={`h-8 w-8 p-0 ${page === p ? 'bg-[#D72444] hover:bg-[#B91E3A] text-white' : ''}`}
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
        </TabsContent>

        {/* ─── SEND ANNOUNCEMENT TAB ─────────────────────── */}
        <TabsContent value="send-announcement" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6 max-w-2xl">
                {/* Send To */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Send to</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ann-send-to"
                        checked={annSendTo === 'all'}
                        onChange={() => { setAnnSendTo('all'); setAnnSelectedCustomers(new Set()); }}
                        className="accent-[#D72444]"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">All Customers</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ann-send-to"
                        checked={annSendTo === 'select'}
                        onChange={() => setAnnSendTo('select')}
                        className="accent-[#D72444]"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Select Customers</span>
                    </label>
                  </div>
                </div>

                {/* Customer multi-select */}
                {annSendTo === 'select' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Search customers..."
                      value={annCustomerSearch}
                      onChange={(e) => setAnnCustomerSearch(e.target.value)}
                    />
                    <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                      {filteredAnnCustomers.map((c) => (
                        <label
                          key={c.id}
                          className={`flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            annSelectedCustomers.has(c.id) ? 'bg-[#FEF2F2] dark:bg-[#D72444]/5' : ''
                          }`}
                        >
                          <Checkbox
                            checked={annSelectedCustomers.has(c.id)}
                            onCheckedChange={(checked) => {
                              const newSet = new Set(annSelectedCustomers);
                              if (checked) newSet.add(c.id);
                              else newSet.delete(c.id);
                              setAnnSelectedCustomers(newSet);
                            }}
                          />
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold shrink-0">
                            {c.first_name.charAt(0)}{c.last_name.charAt(0)}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{c.first_name} {c.last_name}</span>
                          <span className="text-xs text-gray-400 ml-auto truncate max-w-[160px]">{c.email}</span>
                        </label>
                      ))}
                    </div>
                    {annSelectedCustomers.size > 0 && (
                      <p className="text-xs text-gray-500">
                        {annSelectedCustomers.size} customer(s) selected
                      </p>
                    )}
                  </div>
                )}

                <Separator />

                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="ann-title">Title</Label>
                  <Input
                    id="ann-title"
                    placeholder="Announcement title"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="ann-message">Message</Label>
                  <Textarea
                    id="ann-message"
                    placeholder="Write your announcement content..."
                    rows={6}
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                  />
                </div>

                {/* Send to Email checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="ann-send-email"
                    checked={annSendEmail}
                    onCheckedChange={(checked) => setAnnSendEmail(checked === true)}
                  />
                  <Label htmlFor="ann-send-email" className="cursor-pointer">
                    Also send this announcement via email
                  </Label>
                </div>

                <Separator />

                {/* Publish Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2"
                    onClick={handlePublishAnnouncement}
                  >
                    <Bell className="h-4 w-4" />
                    Publish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── SEND BY SMS TAB ────────────────────────────── */}
        <TabsContent value="send-by-sms" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6 max-w-2xl">
                {/* Sender ID */}
                <div className="space-y-1.5">
                  <Label>Sender ID</Label>
                  <Select value={smsSenderId} onValueChange={setSmsSenderId}>
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SENDER_IDS.map((id) => (
                        <SelectItem key={id} value={id}>{id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-message">Message</Label>
                    <span className={`text-xs font-medium ${smsMessage.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                      {smsMessage.length}/160
                    </span>
                  </div>
                  <Textarea
                    id="sms-message"
                    placeholder="Type your SMS message..."
                    rows={4}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    maxLength={160}
                  />
                </div>

                <Separator />

                {/* Send To */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Send to</Label>

                  {/* Customer Groups */}
                  <div className="space-y-2">
                    {CUSTOMER_GROUPS.map((group) => (
                      <label key={group} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={
                            group === 'All Customers'
                              ? smsSendToAll
                              : smsSelectedGroups.has(group)
                          }
                          onCheckedChange={(checked) => {
                            if (group === 'All Customers') {
                              setSmsSendToAll(checked === true);
                              if (checked) setSmsSelectedGroups(new Set());
                            } else {
                              const newSet = new Set(smsSelectedGroups);
                              if (checked) newSet.add(group);
                              else newSet.delete(group);
                              setSmsSelectedGroups(newSet);
                              if (newSet.size > 0) setSmsSendToAll(false);
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{group}</span>
                      </label>
                    ))}
                  </div>

                  <Separator />

                  {/* Or individual customers */}
                  <p className="text-xs text-gray-500">Or select individual customers:</p>
                  <Input
                    placeholder="Search customers..."
                    value={smsCustomerSearch}
                    onChange={(e) => setSmsCustomerSearch(e.target.value)}
                  />
                  <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                    {filteredSmsCustomers.map((c) => (
                      <label
                        key={c.id}
                        className={`flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          smsSelectedCustomers.has(c.id) ? 'bg-[#FEF2F2] dark:bg-[#D72444]/5' : ''
                        }`}
                      >
                        <Checkbox
                          checked={smsSelectedCustomers.has(c.id)}
                          onCheckedChange={(checked) => {
                            const newSet = new Set(smsSelectedCustomers);
                            if (checked) newSet.add(c.id);
                            else newSet.delete(c.id);
                            setSmsSelectedCustomers(newSet);
                          }}
                        />
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          {c.first_name.charAt(0)}{c.last_name.charAt(0)}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{c.first_name} {c.last_name}</span>
                        <span className="text-xs text-gray-400 ml-auto truncate max-w-[160px]">{c.email}</span>
                      </label>
                    ))}
                  </div>
                  {smsSelectedCustomers.size > 0 && (
                    <p className="text-xs text-gray-500">
                      {smsSelectedCustomers.size} individual customer(s) selected
                    </p>
                  )}
                </div>

                <Separator />

                {/* Send SMS Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2"
                    onClick={handleSendSMS}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send SMS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
