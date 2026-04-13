'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Plan {
  id: number; name: string; price: number; billing_cycle: string;
  features: Record<string, string | boolean>; status: string; credit_price: number;
}

export function PlansView() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch('/api/plans').then((r) => r.json()).then((r) => setPlans(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Plans</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage subscription plans</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Plan</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <Input placeholder="Enterprise" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <Input type="number" placeholder="49.99" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                  <Select defaultValue="monthly">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (JSON)</label>
                <Textarea placeholder='{"sms": "50000", "contacts": "25000"}' rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Price</label>
                  <Input type="number" step="0.001" placeholder="0.008" />
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Switch />
                    <span className="text-sm text-gray-700">DLT</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#6366F1] hover:bg-[#5558E6] text-white">Create Plan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">{plan.billing_cycle}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {plan.status}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-800">${plan.price}</span>
                <span className="text-sm text-gray-400">/{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <div className="space-y-2 mb-4">
                {Object.entries(plan.features).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span className="text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}: {String(value)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Credit: ${plan.credit_price}/SMS</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 text-xs"><Edit className="h-3 w-3 mr-1" />Edit</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500"><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
