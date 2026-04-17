'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Plus, ChevronDown, Trash2, Edit, Gift, LogIn, UserCheck,
  Users, Ban, DollarSign, Camera, X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
import { useApp } from '../app-context';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────
interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  plan: string;
  sms_balance: number;
  status: string;
  joined: string;
}

interface CustomerForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  timezone: string;
  language: string;
  status: string;
  avatar: string; // base64
  avatarPreview: string; // objectURL for preview
  sendWelcome: boolean;
}

const emptyForm: CustomerForm = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  phone: '',
  timezone: 'UTC',
  language: 'English',
  status: 'active',
  avatar: '',
  avatarPreview: '',
  sendWelcome: true,
};

const TIMEZONES = [
  'UTC',
  'Africa/Dar_es_Salaam',
  'Africa/Nairobi',
  'Africa/Lagos',
  'Africa/Cairo',
  'US/Eastern',
  'US/Pacific',
  'US/Central',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Australia/Sydney',
  'America/Sao_Paulo',
];

const LANGUAGES = ['English', 'Swahili', 'French', 'Spanish', 'Arabic'];

// ─── Component ────────────────────────────────────────────────────
export function CustomersView() {
  const { impersonatedCustomer, loginAsCustomer, exitImpersonation } = useApp();

  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const perPage = 10;

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');

  // Form
  const [form, setForm] = useState<CustomerForm>({ ...emptyForm });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Mock data generator for stats ─────────────────────────
  const generateMockCustomers = (): Customer[] => {
    const names = [
      { first: 'John', last: 'Smith' }, { first: 'Sarah', last: 'Johnson' },
      { first: 'Michael', last: 'Chen' }, { first: 'Emma', last: 'Williams' },
      { first: 'David', last: 'Brown' }, { first: 'Lisa', last: 'Martinez' },
      { first: 'James', last: 'Wilson' }, { first: 'Aisha', last: 'Patel' },
      { first: 'Robert', last: 'Taylor' }, { first: 'Maria', last: 'Garcia' },
      { first: 'Tom', last: 'Anderson' }, { first: 'Nina', last: 'Kowalski' },
    ];
    const plans = ['Starter', 'Business', 'Enterprise'];
    const statuses: ('active' | 'inactive')[] = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'inactive', 'inactive'];

    const result: Customer[] = names.map((n, i) => ({
      id: i + 1,
      first_name: n.first,
      last_name: n.last,
      email: `${n.first.toLowerCase()}.${n.last.toLowerCase()}@example.com`,
      phone: `+1 555-0${String(i + 1).padStart(3, '0')}`,
      plan: plans[i % 3],
      sms_balance: Math.floor(Math.random() * 100000),
      status: statuses[i],
      joined: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    }));

    // Generate remaining to reach 201
    for (let i = names.length; i < 201; i++) {
      const status: 'active' | 'inactive' = i < 197 ? 'active' : 'inactive';
      result.push({
        id: i + 1,
        first_name: `User${i + 1}`,
        last_name: 'Test',
        email: `user${i + 1}@example.com`,
        phone: `+1 555-${String(i + 1).padStart(4, '0')}`,
        plan: plans[i % 3],
        sms_balance: Math.floor(Math.random() * 50000),
        status,
        joined: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      });
    }
    return result;
  };

  // Load data
  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((r) => {
        if (r.data && r.data.length > 0) {
          setCustomers(r.data);
        } else {
          // fallback: use mock data structure — generate 201 entries for stats
          const base = generateMockCustomers();
          setCustomers(base);
        }
      })
      .catch(() => {
        setCustomers(generateMockCustomers());
      });
  }, []);

  // ─── Derived data ──────────────────────────────────────────
  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        `${c.first_name} ${c.last_name} ${c.email}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [customers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingEnd = Math.min(page * perPage, filtered.length);

  const activeCount = customers.filter((c) => c.status === 'active').length;
  const inactiveCount = customers.filter((c) => c.status === 'inactive').length;
  const totalBalance = customers.reduce((sum, c) => sum + (c.sms_balance ?? 0), 0);

  // ─── Selection logic ───────────────────────────────────────
  const allOnPageSelected = paged.length > 0 && paged.every((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      const newSet = new Set(selectedIds);
      paged.forEach((c) => newSet.delete(c.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      paged.forEach((c) => newSet.add(c.id));
      setSelectedIds(newSet);
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

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

  // ─── Form helpers ──────────────────────────────────────────
  const openAddForm = () => {
    setEditingCustomer(null);
    setForm({ ...emptyForm });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      email: customer.email,
      password: '',
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      timezone: 'UTC',
      language: 'English',
      status: customer.status,
      avatar: '',
      avatarPreview: '',
      sendWelcome: false,
    });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({
        ...prev,
        avatar: base64,
        avatarPreview: URL.createObjectURL(file),
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.first_name.trim()) errors.first_name = 'First name is required';
    if (!form.last_name.trim()) errors.last_name = 'Last name is required';
    if (!editingCustomer && !form.password.trim()) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;

    const newCustomer: Customer = {
      id: editingCustomer ? editingCustomer.id : Math.max(...customers.map((c) => c.id), 0) + 1,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      plan: 'Starter',
      sms_balance: 0,
      status: form.status,
      joined: new Date().toISOString().split('T')[0],
    };

    if (editingCustomer) {
      setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...newCustomer } : c)));
      toast.success('Customer updated successfully');
    } else {
      setCustomers((prev) => [newCustomer, ...prev]);
      toast.success('Customer added successfully');
    }
    setFormDialogOpen(false);
  };

  // ─── Action handlers ───────────────────────────────────────
  const handleLoginAs = (customer: Customer) => {
    setSelectedCustomer(customer);
    setConfirmDialogOpen(true);
  };

  const confirmLoginAs = () => {
    if (selectedCustomer) {
      loginAsCustomer({
        id: selectedCustomer.id,
        uid: `c-${String(selectedCustomer.id).padStart(3, '0')}`,
        first_name: selectedCustomer.first_name,
        last_name: selectedCustomer.last_name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        plan: selectedCustomer.plan,
        sms_balance: selectedCustomer.sms_balance,
        status: selectedCustomer.status,
      });
      toast.success(`Switched to ${selectedCustomer.first_name} ${selectedCustomer.last_name}'s account`);
      setConfirmDialogOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleExitImpersonation = () => {
    exitImpersonation();
    toast.success('Returned to Admin View');
  };

  const handleDelete = (customer: Customer) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    toast.success(`${customer.first_name} ${customer.last_name} deleted`);
  };

  const handleBulkAction = (action: string) => {
    const count = selectedIds.size;
    if (count === 0) {
      toast.error('No customers selected');
      return;
    }
    toast.info(`${count} customer(s) selected — ${action}`);
  };

  const handleAssignPackage = () => {
    toast.success(`Package assigned to ${selectedCustomer?.first_name} ${selectedCustomer?.last_name}`);
    setAssignDialogOpen(false);
    setSelectedPlan('');
  };

  // ─── Impersonation view ────────────────────────────────────
  if (impersonatedCustomer) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleExitImpersonation}
            className="gap-2 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <UserCheck className="h-4 w-4" />
            Exit Customer View
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
                {impersonatedCustomer.first_name.charAt(0)}{impersonatedCustomer.last_name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {impersonatedCustomer.first_name} {impersonatedCustomer.last_name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{impersonatedCustomer.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{impersonatedCustomer.phone}</p>
              </div>
              <div className="flex gap-3">
                <div className="text-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Plan</p>
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-200">{impersonatedCustomer.plan}</p>
                </div>
                <div className="text-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">SMS Balance</p>
                  <p className="text-sm font-bold text-green-800 dark:text-green-200">{impersonatedCustomer.sms_balance.toLocaleString()}</p>
                </div>
                <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</p>
                  <p className={`text-sm font-bold ${impersonatedCustomer.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {impersonatedCustomer.status.charAt(0).toUpperCase() + impersonatedCustomer.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <svg className="w-5 h-5 text-[#D72444]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, title: 'Send SMS', desc: 'Compose new message', bg: 'bg-[#FEF2F2]' },
            { icon: <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Contacts', desc: 'Manage contacts', bg: 'bg-green-50 dark:bg-green-900/20' },
            { icon: <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: 'Reports', desc: 'View analytics', bg: 'bg-rose-50 dark:bg-rose-900/20' },
            { icon: <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, title: 'WhatsApp', desc: 'Send via WhatsApp', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          ].map((item) => (
            <Card key={item.title} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-sm">
          <Card className="border-0 shadow-none">
            <div className="p-4 pb-2">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h3>
            </div>
            <div className="px-4 pb-4 space-y-3">
              {[
                { action: 'SMS Campaign Sent', detail: '3,500 messages delivered', time: '2 hours ago', color: 'bg-[#D72444]' },
                { action: 'Contact List Updated', detail: 'Added 150 new contacts', time: '5 hours ago', color: 'bg-green-500' },
                { action: 'Top Up Completed', detail: '10,000 SMS credits added', time: '1 day ago', color: 'bg-amber-500' },
                { action: 'WhatsApp Message Sent', detail: 'Campaign "Welcome Series" completed', time: '2 days ago', color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </Card>
      </div>
    );
  }

  // ─── Admin view ────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Customers</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {activeCount} <span className="text-sm font-normal text-gray-400">/ {customers.length}</span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
              <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Inactive Customers</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {inactiveCount} <span className="text-sm font-normal text-gray-400">/ {customers.length}</span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FEF2F2] dark:bg-[#D72444]/10 flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6 text-[#D72444]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Balances</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {totalBalance.toLocaleString()}
              </p>
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
            <DropdownMenuItem onClick={() => handleBulkAction('Enable')}>
              Enable
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('Disable')}>
              Disable
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('Delete')} className="text-red-600 focus:text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className="bg-[#28a745] hover:bg-[#218838] text-white gap-2"
          onClick={openAddForm}
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
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
                <SelectItem value="inactive">Inactive</SelectItem>
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
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Name</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Current Plan</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">SMS Units</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium w-40">Actions</TableHead>
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
                  paged.map((c) => (
                    <TableRow key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(c.id)}
                          onCheckedChange={() => toggleSelect(c.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FEF2F2] dark:bg-[#D72444]/20 flex items-center justify-center text-[#D72444] text-xs font-semibold shrink-0">
                            {c.first_name.charAt(0)}{c.last_name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                            {c.first_name} {c.last_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">{c.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF2F2] dark:bg-[#D72444]/20 text-[#D72444] dark:text-rose-300">
                          {c.plan}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                        {(c.sms_balance ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            c.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                          }
                        >
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete"
                            onClick={() => handleDelete(c)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Edit Customer"
                            onClick={() => openEditForm(c)}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-[#FEF2F2] dark:hover:bg-[#D72444]/10"
                            title="Assign Package"
                            onClick={() => {
                              setSelectedCustomer(c);
                              setSelectedPlan('');
                              setAssignDialogOpen(true);
                            }}
                          >
                            <Gift className="h-4 w-4 text-[#D72444]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Login As Customer"
                            onClick={() => handleLoginAs(c)}
                          >
                            <LogIn className="h-4 w-4 text-green-600" />
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

      {/* Add / Edit Customer Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div
                className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-[#D72444] dark:hover:border-[#D72444] transition-colors overflow-hidden bg-gray-50 dark:bg-gray-800"
                onClick={() => fileInputRef.current?.click()}
              >
                {form.avatarPreview ? (
                  <>
                    <img
                      src={form.avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm((prev) => ({ ...prev, avatar: '', avatarPreview: '' }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <Camera className="h-8 w-8 text-gray-400" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <p className="text-xs text-center text-gray-400">Click to upload profile photo</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{editingCustomer ? 'Password (leave blank to keep)' : 'Password *'}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                />
                {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  value={form.first_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                />
                {formErrors.first_name && <p className="text-xs text-red-500">{formErrors.first_name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  placeholder="Smith"
                  value={form.last_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                />
                {formErrors.last_name && <p className="text-xs text-red-500">{formErrors.last_name}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 555-0101"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select
                  value={form.timezone}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, timezone: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Language</Label>
                <Select
                  value={form.language}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, language: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
              >
                <SelectTrigger className="w-full sm:w-1/2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Checkbox
                id="sendWelcome"
                checked={form.sendWelcome}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, sendWelcome: checked === true }))
                }
              />
              <Label htmlFor="sendWelcome" className="cursor-pointer">
                Send welcome email to customer
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setFormDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#D72444] hover:bg-[#B91E3A] text-white"
                onClick={handleFormSubmit}
              >
                {editingCustomer ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Package Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-gray-500">
              Assign a plan to <strong>{selectedCustomer?.first_name} {selectedCustomer?.last_name}</strong>
            </p>
            <div className="space-y-1.5">
              <Label>Select Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
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
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
              <Button
                className="bg-[#D72444] hover:bg-[#B91E3A] text-white"
                onClick={handleAssignPackage}
                disabled={!selectedPlan}
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login As Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-500" />
              Login As Customer
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                You are about to switch to this customer&apos;s account:
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                  {selectedCustomer?.first_name.charAt(0)}{selectedCustomer?.last_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {selectedCustomer?.first_name} {selectedCustomer?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedCustomer?.email}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You will be able to view the customer&apos;s dashboard. Click &quot;Exit Impersonation&quot; in the banner at any time to return to admin view.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={confirmLoginAs}
                className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Login As {selectedCustomer?.first_name}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
