'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, MoreHorizontal, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useApp } from '../app-context';
import { toast } from '@/hooks/use-toast';

interface Customer {
  id: number; first_name: string; last_name: string; email: string; phone: string;
  plan: string; sms_balance: number; status: string; joined: string;
}

export function CustomersView() {
  const { impersonatedCustomer, loginAsCustomer, exitImpersonation } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const perPage = 8;

  useEffect(() => {
    fetch('/api/customers').then((r) => r.json()).then((r) => setCustomers(r.data || [])).catch(() => {});
  }, []);

  const filtered = customers.filter((c) => {
    const matchSearch = `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

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
      toast({
        title: 'Switched to Customer Account',
        description: `You are now viewing as ${selectedCustomer.first_name} ${selectedCustomer.last_name}. You can exit impersonation from the top banner.`,
      });
      setConfirmDialogOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleExitImpersonation = () => {
    exitImpersonation();
    toast({
      title: 'Returned to Admin View',
      description: 'You have exited customer impersonation.',
    });
  };

  // If currently impersonating a customer, show customer dashboard-like view
  if (impersonatedCustomer) {
    return (
      <div className="space-y-6">
        {/* Customer Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Customer Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Viewing as {impersonatedCustomer.first_name} {impersonatedCustomer.last_name}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExitImpersonation}
            className="gap-2 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <UserCheck className="h-4 w-4" />
            Exit Customer View
          </Button>
        </div>

        {/* Customer Info Card */}
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
                  <p className={`text-sm font-bold ${impersonatedCustomer.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {impersonatedCustomer.status.charAt(0).toUpperCase() + impersonatedCustomer.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Send SMS</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Compose new message</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Contacts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage contacts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Reports</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View analytics</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">WhatsApp</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Send via WhatsApp</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Placeholder */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'SMS Campaign Sent', detail: '3,500 messages delivered', time: '2 hours ago', type: 'sms' },
                { action: 'Contact List Updated', detail: 'Added 150 new contacts', time: '5 hours ago', type: 'contact' },
                { action: 'Top Up Completed', detail: '10,000 SMS credits added', time: '1 day ago', type: 'payment' },
                { action: 'WhatsApp Message Sent', detail: 'Campaign "Welcome Series" completed', time: '2 days ago', type: 'whatsapp' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    item.type === 'sms' ? 'bg-[#6366F1]' :
                    item.type === 'contact' ? 'bg-green-500' :
                    item.type === 'payment' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin view - Customer list
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your platform customers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <Input placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <Input placeholder="Smith" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <Input type="password" placeholder="Enter password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <Input placeholder="+1 555-0101" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <Select defaultValue="active">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Plan</label>
                <Select defaultValue="starter">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial SMS Balance</label>
                <Input type="number" placeholder="0" defaultValue="0" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#6366F1] hover:bg-[#5558E6] text-white">Create Customer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="shrink-0">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
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
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12">#</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Customer</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Phone</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Plan</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">SMS Balance</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((c, i) => (
                  <TableRow key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{(page - 1) * perPage + i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] dark:bg-[#6366F1]/20 flex items-center justify-center text-[#6366F1] text-xs font-semibold shrink-0">
                          {c.first_name.charAt(0)}{c.last_name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                          {c.first_name} {c.last_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">{c.email}</TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{c.phone}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] dark:bg-[#6366F1]/20 text-[#6366F1] dark:text-indigo-300">
                        {c.plan}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">{c.sms_balance.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">{c.joined}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleLoginAs(c)}
                            className="text-amber-600 dark:text-amber-400 focus:text-amber-600 dark:focus:text-amber-400"
                          >
                            <UserCheck className="h-4 w-4 mr-2" /> Login As Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} results
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Login As Dialog */}
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
