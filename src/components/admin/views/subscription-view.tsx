'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, XCircle } from 'lucide-react';

interface Subscription {
  id: number; customer: string; plan: string; start_date: string;
  end_date: string; status: string; amount: number;
}

export function SubscriptionView() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/subscriptions').then((r) => r.json()).then((r) => setSubscriptions(r.data || [])).catch(() => {});
  }, []);

  const filtered = subscriptions.filter((s) => statusFilter === 'all' || s.status === statusFilter);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      expired: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      new: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage customer subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: subscriptions.length, color: 'text-gray-800' },
          { label: 'Active', value: subscriptions.filter(s => s.status === 'active').length, color: 'text-green-600' },
          { label: 'Expired', value: subscriptions.filter(s => s.status === 'expired').length, color: 'text-gray-500' },
          { label: 'Cancelled', value: subscriptions.filter(s => s.status === 'cancelled').length, color: 'text-red-600' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-end mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-xs text-gray-500 font-medium">Customer</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Plan</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">Start Date</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">End Date</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Amount</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-sm font-medium text-gray-800">{sub.customer}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#6366F1]">{sub.plan}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 hidden md:table-cell">{sub.start_date}</TableCell>
                    <TableCell className="text-sm text-gray-500 hidden md:table-cell">{sub.end_date}</TableCell>
                    <TableCell>{statusBadge(sub.status)}</TableCell>
                    <TableCell className="text-sm font-semibold text-gray-800">${sub.amount}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {sub.status !== 'active' && (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50">
                            <RefreshCw className="h-3 w-3 mr-1" /> Renew
                          </Button>
                        )}
                        {sub.status === 'active' && (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">
                            <XCircle className="h-3 w-3 mr-1" /> Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
