'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Plus, Zap, CheckCircle2, Crown, Rocket, Star, Receipt, History } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  price: number;
  billingCycle: string;
  status: string;
  features: string[];
  creditPrice: number;
}

interface Subscription {
  planName: string;
  status: string;
  smsUsed: number;
  smsLimit: number;
  price: number;
  billingCycle: string;
  currentPeriodEndsAt: string;
}

interface Topup {
  id: number;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
  transactionId: string;
  createdAt: string;
}

interface Invoice {
  id: number;
  amount: number;
  currency: string;
  status: string;
  type: string;
  transactionId: string;
  createdAt: string;
}

const planIcons: Record<string, React.ElementType> = {
  Starter: Zap,
  Business: Rocket,
  Professional: Crown,
  Enterprise: Star,
};

const planColors: Record<string, string> = {
  Starter: 'from-blue-500 to-blue-600',
  Business: 'from-violet-500 to-violet-600',
  Professional: 'bg-gradient-to-br from-amber-500 to-orange-600',
  Enterprise: 'bg-gradient-to-br from-rose-500 to-red-600',
};

export function BillingView() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [topups, setTopups] = useState<Topup[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [topupDialogOpen, setTopupDialogOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupSubmitting, setTopupSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/plans').then(r => r.ok && r.json()),
      fetch('/api/subscriptions').then(r => r.ok && r.json()),
      fetch('/api/topups').then(r => r.ok && r.json()),
    ]).then(([p, s, t]) => {
      if (p) setPlans(p);
      if (s) setSubscription(s);
      if (t) { setTopups(t.topups || []); setInvoices(t.invoices || []); }
    }).catch(() => {});
  }, []);

  const usagePercent = subscription ? Math.round((subscription.smsUsed / subscription.smsLimit) * 100) : 0;
  const remainingSMS = subscription ? subscription.smsLimit - subscription.smsUsed : 0;

  const handleTopup = async () => {
    setTopupSubmitting(true);
    // Simulate topup
    await new Promise(r => setTimeout(r, 1000));
    setTopupDialogOpen(false);
    setTopupAmount('');
    setTopupSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      {subscription && (
        <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-slate-800">Current Plan: {subscription.planName}</h2>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">{subscription.status}</Badge>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Renews on {new Date(subscription.currentPeriodEndsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {' · '}{subscription.billingCycle}
                </p>
              </div>
              <Dialog open={topupDialogOpen} onOpenChange={setTopupDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />Top Up Credits</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Credits</DialogTitle>
                    <DialogDescription>Purchase additional SMS credits</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="grid grid-cols-3 gap-2">
                      {[1000, 5000, 10000].map(amt => (
                        <Button key={amt} variant="outline" className="h-auto py-3 flex-col gap-1" onClick={() => setTopupAmount(String(amt))}>
                          <span className="font-bold">₹{amt.toLocaleString()}</span>
                          <span className="text-xs text-slate-400">{(amt * 5).toLocaleString()} SMS</span>
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Amount (₹)</Label>
                      <Input type="number" placeholder="Enter amount" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select defaultValue="razorpay">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="razorpay">Razorpay</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setTopupDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleTopup} disabled={topupSubmitting || !topupAmount} className="bg-blue-600 hover:bg-blue-700">
                      {topupSubmitting ? 'Processing...' : `Pay ₹${Number(topupAmount || 0).toLocaleString()}`}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">SMS Usage</span>
                <span className="text-sm font-medium text-slate-800">{subscription.smsUsed.toLocaleString()} / {subscription.smsLimit.toLocaleString()}</span>
              </div>
              <Progress value={usagePercent} className="h-2.5" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">{usagePercent}% used</span>
                <span className="text-xs text-green-600 font-medium">{remainingSMS.toLocaleString()} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = planIcons[plan.name] || Zap;
            const isCurrent = subscription?.planName === plan.name;
            return (
              <Card key={plan.id} className={`border-slate-200 hover:shadow-md transition-shadow relative ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}>
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Current Plan
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${planColors[plan.name] || 'from-blue-500 to-blue-600'} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{plan.name}</h3>
                      <span className="text-xs text-slate-400 capitalize">{plan.billingCycle}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-slate-800">₹{plan.price.toLocaleString()}</span>
                    <span className="text-sm text-slate-400">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={isCurrent ? 'secondary' : 'default'}
                    className={`w-full ${!isCurrent ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabs for Topups and Invoices */}
      <Tabs defaultValue="topups">
        <TabsList>
          <TabsTrigger value="topups" className="gap-1.5"><History className="h-3.5 w-3.5" />Top-up History</TabsTrigger>
          <TabsTrigger value="invoices" className="gap-1.5"><Receipt className="h-3.5 w-3.5" />Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="topups">
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topups.map((t) => (
                    <TableRow key={t.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-xs">{t.transactionId}</TableCell>
                      <TableCell className="text-sm">{t.paymentMethod}</TableCell>
                      <TableCell className="font-medium">₹{t.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={t.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices">
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Invoice</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-xs">{inv.transactionId}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{inv.type}</Badge></TableCell>
                      <TableCell className="font-medium">₹{inv.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={inv.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
