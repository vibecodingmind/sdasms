'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, CheckCircle2, XCircle, Settings, Eye, EyeOff,
  ExternalLink, ArrowRightLeft, TrendingUp, Clock, AlertTriangle,
  Check, Ban, RefreshCw, ChevronDown, ChevronUp, DollarSign,
  Globe, Shield, Smartphone, Building2, Copy, Info, Loader2, AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── Types ────────────────────────────────────────────────────────
interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  mode: string;
  supported_currencies: string[];
  supported_methods: string[];
  total_transactions: number;
  total_revenue: number;
  fields: Record<string, string>;
}

interface PaymentTransaction {
  id: number;
  transaction_id: string;
  gateway: string;
  customer: string;
  customer_email: string;
  description: string;
  method: string;
  currency: string;
  amount: number;
  status: string;
  created_at: string;
}

// ── Gateway logo component ──────────────────────────────────
function GatewayLogo({ name }: { name: string }) {
  const configs: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
    Pesapal: { color: '#F59E0B', icon: <Smartphone className="h-6 w-6" />, bg: 'bg-amber-50 dark:bg-amber-950/30' },
    PayPal: { color: '#003087', icon: <Globe className="h-6 w-6" />, bg: 'bg-blue-50 dark:bg-blue-950/30' },
    Stripe: { color: '#635BFF', icon: <CreditCard className="h-6 w-6" />, bg: 'bg-rose-50 dark:bg-rose-950/30' },
    'Manual Payment': { color: '#059669', icon: <Building2 className="h-6 w-6" />, bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  };
  const cfg = configs[name] || { color: '#D72444', icon: <CreditCard className="h-6 w-6" />, bg: 'bg-rose-50 dark:bg-rose-950/30' };
  return (
    <div className={`${cfg.bg} p-3 rounded-xl`} style={{ color: cfg.color }}>
      {cfg.icon}
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    completed: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: <CheckCircle2 className="h-3 w-3" />, label: 'Completed' },
    pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: <Clock className="h-3 w-3" />, label: 'Pending' },
    failed: { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: <XCircle className="h-3 w-3" />, label: 'Failed' },
    refunded: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', icon: <ArrowRightLeft className="h-3 w-3" />, label: 'Refunded' },
    rejected: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: <Ban className="h-3 w-3" />, label: 'Rejected' },
  };
  const cfg = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── Gateway Card ─────────────────────────────────────────────
function GatewayCard({ gw, onSelect }: { gw: PaymentGateway; onSelect: () => void }) {
  const [enabled, setEnabled] = useState(gw.status === 'active');
  const isActive = enabled;

  return (
    <Card className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${isActive ? 'ring-1 ring-[#D72444]/20' : 'opacity-80'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <GatewayLogo name={gw.name} />
            <div>
              <CardTitle className="text-base font-semibold">{gw.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5 line-clamp-2 max-w-[220px]">{gw.description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={isActive ? 'default' : 'secondary'} className={`${isActive ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''} text-xs`}>
              {isActive ? 'Active' : 'Disabled'}
            </Badge>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{gw.total_transactions.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">${gw.total_revenue.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Mode</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 capitalize">{gw.mode}</p>
          </div>
        </div>
        {/* Supported methods */}
        <div className="flex items-center gap-1 flex-wrap mb-3">
          {(gw.supported_methods || gw.supported_currencies || []).slice(0, 4).map((m) => (
            <Badge key={m} variant="outline" className="text-[10px] px-1.5 py-0 font-mono">{m}</Badge>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs border-[#D72444]/30 text-[#D72444] hover:bg-[#D72444] hover:text-white"
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          <Settings className="h-3 w-3 mr-1" /> Configure & View Transactions
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Configuration Form ───────────────────────────────────────
function ConfigPanel({ gw }: { gw: PaymentGateway }) {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<'test' | 'live'>(gw.mode === 'live' ? 'live' : 'test');
  const [saved, setSaved] = useState(false);
  const isManual = gw.type === 'manual';
  const isPassword = (key: string) => isManual
    ? ['consumer_secret', 'secret_key'].includes(key)
    : true;

  const toggleSecret = (key: string) => {
    setShowSecrets((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fieldLabels: Record<string, string> = {
    consumer_key: 'Consumer Key',
    consumer_secret: 'Consumer Secret',
    client_id: 'Client ID',
    client_secret: 'Client Secret',
    webhook_id: 'Webhook ID',
    publishable_key: 'Publishable Key',
    secret_key: 'Secret Key',
    webhook_secret: 'Webhook Secret',
    ipn_url: 'IPN Notification URL',
    callback_url: 'Callback URL',
    webhook_url: 'Webhook URL',
    bank_name: 'Bank Name',
    account_name: 'Account Name',
    account_number: 'Account Number',
    branch: 'Branch',
    swift_code: 'SWIFT Code',
    payment_instructions: 'Payment Instructions',
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Environment</span>
          <Info className="h-3 w-3 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${mode === 'test' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setMode('test')}
          >
            Test Mode
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${mode === 'live' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setMode('live')}
          >
            Live Mode
          </button>
        </div>
      </div>

      {mode === 'test' && (
        <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          Test mode is active. Use sandbox credentials for testing. No real payments will be processed.
        </div>
      )}

      {/* Configuration fields */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Key className="h-4 w-4 text-[#D72444]" />
            API Credentials & Settings
          </CardTitle>
          <CardDescription className="text-xs">
            {isManual ? 'Bank account details shown to customers for manual payments' : `Configure your ${gw.name} API credentials for ${mode} mode`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.keys(gw.fields).length > 0 ? (
            Object.entries(gw.fields).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {fieldLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                {key === 'payment_instructions' ? (
                  <textarea
                    defaultValue={value as string}
                    className="w-full min-h-[80px] text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D72444]/30 resize-none"
                  />
                ) : (
                  <div className="relative">
                    <Input
                      type={(isPassword(key) && !showSecrets[key]) ? 'password' : 'text'}
                      defaultValue={value as string}
                      className="h-9 text-xs pr-20 bg-white dark:bg-gray-800"
                    />
                    {isPassword(key) && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => toggleSecret(key)}
                      >
                        {showSecrets[key] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    {!isPassword(key) && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => navigator.clipboard?.writeText(value as string)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No configuration fields available for this gateway.</p>
          )}

          <Button
            onClick={handleSave}
            className="w-full bg-[#D72444] hover:bg-[#C01E3A] text-white h-9 text-sm mt-2"
          >
            {saved ? (
              <><Check className="h-4 w-4 mr-1" /> Saved Successfully</>
            ) : (
              <><Settings className="h-4 w-4 mr-1" /> Save Configuration</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Webhook / Integration info */}
      {!isManual && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-[#D72444]" />
              Webhook & Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span>Webhook Events</span>
              <Badge variant="outline" className="text-[10px]">payment.completed, payment.failed</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span>Auto-verify</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Enabled
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span>Retry on failure</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">3 attempts</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Key icon (used in ConfigPanel) ───────────────────────────
function Key(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.3 9.3" /><path d="m15.5 7.5 3 3L22 7l-3-3" /><path d="m2 22 5-5" />
    </svg>
  );
}

// ── Transaction Table ────────────────────────────────────────
function TransactionTable({ transactions }: { transactions: PaymentTransaction[] }) {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.status === filter);

  return (
    <div className="space-y-3">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Completed</span>
          </div>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {transactions.filter((t) => t.status === 'completed').length}
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pending</span>
          </div>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
            {transactions.filter((t) => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">Failed / Rejected</span>
          </div>
          <p className="text-lg font-bold text-red-700 dark:text-red-300">
            {transactions.filter((t) => t.status === 'failed' || t.status === 'rejected').length}
          </p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-[#D72444]" />
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Total Revenue</span>
          </div>
          <p className="text-lg font-bold text-rose-700 dark:text-rose-300">
            ${transactions.filter((t) => t.status === 'completed').reduce((s, t) => s + t.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'completed', 'pending', 'failed', 'refunded', 'rejected'].map((s) => (
          <button
            key={s}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors capitalize ${
              filter === s
                ? 'bg-[#D72444] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setFilter(s)}
          >
            {s} {s !== 'all' && `(${transactions.filter((t) => t.status === s).length})`}
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <RefreshCw className="h-3 w-3" /> Refresh
          </Button>
        </div>
      </div>

      {/* Transaction table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Transaction ID</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Description</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Method</th>
                <th className="text-right py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-center py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-center py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-[#D72444]">{tx.transaction_id}</td>
                  <td className="py-2.5 px-3">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{tx.customer}</p>
                      <p className="text-gray-400 dark:text-gray-500">{tx.customer_email}</p>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400 max-w-[150px] truncate">{tx.description}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="outline" className="text-[10px]">{tx.method}</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-800 dark:text-gray-200">
                    {tx.currency} {tx.amount.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {tx.created_at.replace(/:\d{2}$/, '')}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 dark:text-gray-500">
                    No transactions found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main View ────────────────────────────────────────────────
export function PaymentGatewaysView() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('config');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payment-gateways');
      const json = await res.json();
      if (json.data) {
        const mapped = json.data.map((g: Record<string, unknown>) => ({
          id: g.id as string,
          name: (g.name as string) || (g.id as string),
          description: (g.description as string) || '',
          type: g.id === 'manual' ? 'manual' : 'online',
          status: (g.status as string) || 'active',
          mode: (g.mode as string) || 'live',
          supported_currencies: (g.supported_currencies as string[]) || (g.supported_methods as string[]) || [],
          supported_methods: (g.supported_methods as string[]) || [],
          total_transactions: (g.total_transactions as number) || 0,
          total_revenue: (g.total_revenue as number) || 0,
          fields: (g.fields as Record<string, string>) || {},
        }));
        setGateways(mapped);
      } else {
        setGateways([]);
      }
      setTransactions([]);
    } catch {
      setError('Failed to load payment gateways');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selected = gateways.find((g) => g.name === selectedGateway);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Loading payment gateways...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertCircle className="h-6 w-6 text-red-400" />
        <p className="text-sm text-gray-500">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {selectedGateway && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => { setSelectedGateway(null); setActiveTab('config'); }}
          >
            Back to All Gateways
          </Button>
        )}

      {!selectedGateway ? (
        /* ── Gateway overview grid ── */
        <>
          {/* Summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-[#D72444]/10 p-2 rounded-lg">
                    <CreditCard className="h-4 w-4 text-[#D72444]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active Gateways</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {gateways.filter((g) => g.status === 'active').length}/{gateways.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Transactions</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {gateways.reduce((s, g) => s + g.total_transactions, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                    <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      ${gateways.reduce((s, g) => s + g.total_revenue, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pending Payments</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {transactions.filter((t) => t.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gateway cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {gateways.map((gw) => (
              <GatewayCard
                key={gw.id}
                gw={gw}
                onSelect={() => { setSelectedGateway(gw.name); setActiveTab('config'); }}
              />
            ))}
          </div>

          {/* Recent transactions across all gateways */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-[#D72444]" />
                Recent Transactions (All Gateways)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No transactions recorded yet.</p>
              ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">ID</th>
                          <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Gateway</th>
                          <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                          <th className="text-right py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                          <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {transactions.slice(0, 8).map((tx) => (
                          <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="py-2 px-3 font-mono font-medium text-[#D72444]">{tx.transaction_id}</td>
                            <td className="py-2 px-3">
                              <Badge variant="outline" className="text-[10px]">{tx.gateway}</Badge>
                            </td>
                            <td className="py-2 px-3 text-gray-800 dark:text-gray-200 font-medium">{tx.customer}</td>
                            <td className="py-2 px-3 text-right font-semibold text-gray-800 dark:text-gray-200">
                              {tx.currency} {tx.amount.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-center"><StatusBadge status={tx.status} /></td>
                            <td className="py-2 px-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {tx.created_at.replace(/:\d{2}$/, '')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : selected ? (
        /* ── Selected gateway detail ── */
        <>
          {/* Gateway header */}
          <div className="flex items-center gap-4">
            <GatewayLogo name={selected.name} />
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{selected.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{selected.description}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                {(selected.supported_currencies || selected.supported_methods || []).join(', ')}
              </Badge>
              <Badge className={`${selected.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'} text-white text-xs`}>
                {selected.status === 'active' ? 'Active' : 'Disabled'}
              </Badge>
            </div>
          </div>

          {/* Config / Transactions tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="config" className="text-xs">
                <Settings className="h-3.5 w-3.5 mr-1" /> Configuration
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs">
                <ArrowRightLeft className="h-3.5 w-3.5 mr-1" /> Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="config" className="mt-4">
              <ConfigPanel gw={selected} />
            </TabsContent>
            <TabsContent value="transactions" className="mt-4">
              <TransactionTable transactions={transactions.filter((t) => t.gateway === selected.name)} />
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}
