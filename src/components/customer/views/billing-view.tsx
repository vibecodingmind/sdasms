'use client';

import React, { useState } from 'react';
import {
  CreditCard, DollarSign, Zap, Check, Plus, Download,
  CalendarDays, CreditCard as CreditIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCustomer } from '../customer-context';

const currentPlan = {
  name: 'Enterprise',
  price: '$499.99/month',
  smsIncluded: 'Unlimited',
  contactsLimit: 'Unlimited',
  features: ['API Access', 'Priority Support', 'Custom Sender IDs', 'Advanced Analytics', 'Dedicated Account Manager'],
  renewalDate: '2025-02-15',
};

const mockInvoices = [
  { id: 1, invoice_no: 'INV-2025-001', amount: 499.99, status: 'paid', date: '2025-01-15', description: 'Enterprise Plan - Monthly' },
  { id: 2, invoice_no: 'INV-2024-012', amount: 499.99, status: 'paid', date: '2024-12-15', description: 'Enterprise Plan - Monthly' },
  { id: 3, invoice_no: 'INV-2024-011', amount: 50.00, status: 'paid', date: '2024-11-20', description: 'SMS Credit Top-up' },
  { id: 4, invoice_no: 'INV-2024-010', amount: 499.99, status: 'paid', date: '2024-11-15', description: 'Enterprise Plan - Monthly' },
];

export function BillingView() {
  const { customerUser } = useCustomer();
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);

  const statusConfig: Record<string, string> = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

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
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{currentPlan.name} Plan</h3>
                  <p className="text-sm text-gray-500">Renews on {currentPlan.renewalDate}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Monthly Price</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{currentPlan.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">SMS Included</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{currentPlan.smsIncluded}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contacts Limit</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{currentPlan.contactsLimit}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Plan Features</p>
                <div className="flex flex-wrap gap-2">
                  {currentPlan.features.map((feature) => (
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
                  {customerUser?.sms_balance?.toLocaleString() || '45,000'}
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
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">SMS Sent (This Month)</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">12,850</p>
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
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">$154.20</p>
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
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">{invoice.invoice_no}</span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{invoice.description}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">${invoice.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-400">{invoice.date}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={`text-[10px] ${statusConfig[invoice.status] || ''}`}>
                        {invoice.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Up Dialog (simplified) */}
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
