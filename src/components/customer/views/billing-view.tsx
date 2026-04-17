'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, DollarSign, Zap, Check, Plus, Download,
  CalendarDays, CreditCard as CreditIcon, Loader2, RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCustomer } from '../customer-context';
import { toast } from 'sonner';

interface Invoice {
  id: number;
  invoice_no?: string;
  uid?: string;
  amount?: number;
  status?: string;
  date?: string;
  created_at?: string;
  description?: string;
  type?: string;
  [key: string]: unknown;
}

interface Subscription {
  id: number;
  plan?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  amount?: number;
  [key: string]: unknown;
}

interface Plan {
  id: number;
  name?: string;
  price?: number;
  billing_cycle?: string;
  features?: Record<string, unknown>;
  status?: string;
  [key: string]: unknown;
}

export function BillingView() {
  const { customerUser } = useCustomer();
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [invRes, subRes, planRes] = await Promise.allSettled([
        fetch('/api/invoices'),
        fetch('/api/subscriptions'),
        fetch('/api/plans'),
      ]);

      if (invRes.status === 'fulfilled') {
        const json = await invRes.value.json();
        if (json.success) setInvoices(json.data || []);
      }
      if (subRes.status === 'fulfilled') {
        const json = await subRes.value.json();
        if (json.success) setSubscriptions(json.data || []);
      }
      if (planRes.status === 'fulfilled') {
        const json = await planRes.value.json();
        if (json.success) setPlans(json.data || []);
      }
    } catch {
      setError('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  // Derive current plan from active subscription
  const activeSubscription = subscriptions.find(
    (s) => s.status === 'active'
  );
  const currentPlanName = activeSubscription?.plan || customerUser?.plan || 'Starter';
  const currentPlan = plans.find(
    (p) => p.name?.toLowerCase() === currentPlanName.toLowerCase()
  );
  const renewalDate = activeSubscription?.end_date || 'N/A';

  const planFeatures = currentPlan?.features
    ? Object.keys(currentPlan.features).map((k) =>
        `${k.replace(/_/g, ' ')}: ${String(currentPlan.features![k])}`
      )
    : [];

  const statusConfig: Record<string, string> = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    expired: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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
        <Button variant="outline" onClick={fetchBillingData}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#D72444]/10 text-[#D72444]">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{currentPlanName} Plan</h3>
                  <p className="text-sm text-gray-500">Renews on {renewalDate}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Monthly Price</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    ${currentPlan?.price?.toFixed(2) || activeSubscription?.amount?.toFixed(2) || '49.99'}/mo
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">SMS Included</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {String(currentPlan?.features?.sms || '5,000')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contacts Limit</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {String(currentPlan?.features?.contacts || '1,000')}
                  </p>
                </div>
              </div>

              {planFeatures.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Plan Features</p>
                  <div className="flex flex-wrap gap-2">
                    {planFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium"
                      >
                        <Check className="h-3 w-3" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex lg:flex-col gap-2 lg:w-48">
              <Button
                className="flex-1 bg-[#D72444] hover:bg-[#C01E3A] text-white"
                onClick={() => setTopUpDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Top Up Balance
              </Button>
              <Button variant="outline" className="flex-1">
                <CreditIcon className="h-4 w-4 mr-1" /> Upgrade Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">SMS Balance</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                  {customerUser?.sms_balance?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#D72444]/10 flex items-center justify-center text-[#D72444]">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                  {subscriptions.filter((s) => s.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                  {invoices.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Visa ending in 4242</p>
                <p className="text-xs text-gray-400">Expires 12/2026</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">Change</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Invoices</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              <Download className="h-3.5 w-3.5 mr-1" /> Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Invoice</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Description</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Amount</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-sm text-gray-400">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => {
                    const invNo = invoice.invoice_no || invoice.uid || `INV-${invoice.id}`;
                    const invDate = invoice.date || (invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : '—');
                    const invDesc = invoice.description || invoice.type || '—';
                    const invStatus = invoice.status || 'pending';
                    return (
                      <tr key={invoice.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-3">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">{invNo}</span>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{invDesc}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            ${Number(invoice.amount || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="text-xs text-gray-400">{invDate}</span>
                        </td>
                        <td className="px-5 py-3">
                          <Badge className={`text-[10px] ${statusConfig[invStatus] || statusConfig.pending || ''}`}>
                            {invStatus}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Up Dialog */}
      <div className={`fixed inset-0 bg-black/30 z-50 flex items-center justify-center transition-opacity ${topUpDialogOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Top Up SMS Balance</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['$10', '$25', '$50', '$100', '$250', '$500'].map((amount) => (
              <button
                key={amount}
                onClick={() => { toast.success(`Top-up of ${amount} initiated`); setTopUpDialogOpen(false); }}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-center hover:border-[#D72444] hover:bg-[#D72444]/5 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{amount}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setTopUpDialogOpen(false)}>Cancel</Button>
            <Button
              className="flex-1 bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={() => { toast.success('Top-up request submitted'); setTopUpDialogOpen(false); }}
            >
              Custom Amount
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
