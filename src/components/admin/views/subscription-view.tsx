'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Plus, ChevronDown, Info, List, CalendarDays,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
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
import { mockSubscriptions, mockCustomers } from '@/lib/mock-data';

// ─── Types ────────────────────────────────────────────────────────
interface Subscription {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_avatar: string;
  plan: string;
  start_date: string;
  end_date: string;
  status: string;
  amount: number;
}

const PLANS = [
  { value: 'starter', label: 'Starter', price: 49.99, cycle: 'monthly', days: 30 },
  { value: 'business', label: 'Business', price: 199.99, cycle: 'monthly', days: 30 },
  { value: 'enterprise', label: 'Enterprise', price: 499.99, cycle: 'monthly', days: 30 },
];

// ─── Component ────────────────────────────────────────────────────
export function SubscriptionView() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const perPage = 10;

  // Dialog
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formCustomerId, setFormCustomerId] = useState('');
  const [formPlan, setFormPlan] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');

  // Load data
  useEffect(() => {
    const data: Subscription[] = mockSubscriptions.map((s) => {
      const customer = mockCustomers.find(
        (c) => `${c.first_name} ${c.last_name}` === s.customer
      );
      return {
        id: s.id,
        customer_name: s.customer,
        customer_email: customer?.email || '',
        customer_avatar: customer
          ? `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`
          : '??',
        plan: s.plan,
        start_date: s.start_date,
        end_date: s.end_date,
        status: s.status,
        amount: s.amount,
      };
    });
    setSubscriptions(data);
  }, []);

  // ─── Derived data ──────────────────────────────────────────
  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchSearch =
        `${s.customer_name} ${s.customer_email} ${s.plan}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingEnd = Math.min(page * perPage, filtered.length);

  const totalCount = subscriptions.length;
  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const inactiveCount = subscriptions.filter((s) => s.status !== 'active').length;

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
  const allOnPageSelected = paged.length > 0 && paged.every((s) => selectedIds.has(s.id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      const newSet = new Set(selectedIds);
      paged.forEach((s) => newSet.delete(s.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      paged.forEach((s) => newSet.add(s.id));
      setSelectedIds(newSet);
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // ─── Form handlers ─────────────────────────────────────────
  const openNewForm = () => {
    setFormCustomerId('');
    setFormPlan('');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate('');
    setFormDialogOpen(true);
  };

  const handlePlanChange = (planValue: string) => {
    setFormPlan(planValue);
    const plan = PLANS.find((p) => p.value === planValue);
    if (plan && formStartDate) {
      const start = new Date(formStartDate);
      const end = new Date(start);
      end.setDate(end.getDate() + plan.days);
      setFormEndDate(end.toISOString().split('T')[0]);
    }
  };

  const handleStartDateChange = (date: string) => {
    setFormStartDate(date);
    const plan = PLANS.find((p) => p.value === formPlan);
    if (plan && date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + plan.days);
      setFormEndDate(end.toISOString().split('T')[0]);
    }
  };

  const handleCreateSubscription = () => {
    if (!formCustomerId || !formPlan || !formStartDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    const customer = mockCustomers.find((c) => c.id === Number(formCustomerId));
    const plan = PLANS.find((p) => p.value === formPlan);

    const newSub: Subscription = {
      id: Math.max(...subscriptions.map((s) => s.id), 0) + 1,
      customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown',
      customer_email: customer?.email || '',
      customer_avatar: customer
        ? `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`
        : '??',
      plan: plan?.label || '',
      start_date: formStartDate,
      end_date: formEndDate,
      status: 'active',
      amount: plan?.price || 0,
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    toast.success('Subscription created successfully');
    setFormDialogOpen(false);
  };

  const handleBulkAction = (action: string) => {
    const count = selectedIds.size;
    if (count === 0) {
      toast.error('No subscriptions selected');
      return;
    }
    toast.info(`${count} subscription(s) selected — ${action}`);
  };

  // ─── Status badge ──────────────────────────────────────────
  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30',
      expired: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
    };
    return (
      <Badge className={styles[status] || styles.expired}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // ─── Customer search filter for dropdown ───────────────────
  const [customerSearch, setCustomerSearch] = useState('');
  const filteredCustomers = mockCustomers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email}`
      .toLowerCase()
      .includes(customerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Subscriptions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage customer subscriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FEF2F2] dark:bg-[#D72444]/10 flex items-center justify-center shrink-0">
              <CalendarDays className="h-6 w-6 text-[#D72444]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Subscriptions</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{totalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Subscriptions</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Inactive Subscriptions</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{inactiveCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2">
              Actions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleBulkAction('Cancel')}>
              Cancel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('Delete')} className="text-red-600 focus:text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className="bg-[#28a745] hover:bg-[#218838] text-white gap-2"
          onClick={openNewForm}
        >
          <Plus className="h-4 w-4" />
          New Subscription
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subscriptions..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
                  <TableHead className="w-12">
                    <Checkbox checked={allOnPageSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Customer</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Plan</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Subscribed On</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Ends At</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                      No results available
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((sub) => (
                    <TableRow key={sub.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(sub.id)}
                          onCheckedChange={() => toggleSelect(sub.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FEF2F2] dark:bg-[#D72444]/20 flex items-center justify-center text-[#D72444] text-xs font-semibold shrink-0">
                            {sub.customer_avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                              {sub.customer_name}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">{sub.customer_email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF2F2] dark:bg-[#D72444]/20 text-[#D72444] dark:text-rose-300">
                          {sub.plan}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {sub.start_date}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {sub.end_date}
                      </TableCell>
                      <TableCell>{statusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Info"
                          >
                            <Info className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-[#FEF2F2] dark:hover:bg-[#D72444]/10"
                            title="Details"
                          >
                            <List className="h-4 w-4 text-[#D72444]" />
                          </Button>
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

      {/* New Subscription Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Select Customer</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                <div className="max-h-40 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors ${
                        formCustomerId === String(c.id)
                          ? 'bg-[#FEF2F2] dark:bg-[#D72444]/10 text-[#D72444]'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setFormCustomerId(String(c.id))}
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {c.first_name.charAt(0)}{c.last_name.charAt(0)}
                      </div>
                      <span className="truncate">{c.first_name} {c.last_name}</span>
                      <span className="text-xs text-gray-400 truncate ml-auto">{c.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Select Plan</Label>
              <Select value={formPlan} onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter — $49.99/mo</SelectItem>
                  <SelectItem value="business">Business — $199.99/mo</SelectItem>
                  <SelectItem value="enterprise">Enterprise — $499.99/mo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formEndDate}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setFormDialogOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#D72444] hover:bg-[#B91E3A] text-white"
                onClick={handleCreateSubscription}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
