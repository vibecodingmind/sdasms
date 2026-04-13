'use client';

import React from 'react';
import { CreditCard, CheckCircle2, XCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { mockPaymentGateways } from '@/lib/mock-data';

const gwIcons: Record<string, string> = {
  Stripe: '💳', PayPal: '🅿️', Razorpay: '🏦', Paystack: '💰', Mollie: '🇪🇺',
};

export function PaymentGatewaysView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Payment Gateways</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure payment gateway integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockPaymentGateways.map((gw) => (
          <Card key={gw.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{gwIcons[gw.name] || '💳'}</span>
                  <div>
                    <CardTitle className="text-base">{gw.name}</CardTitle>
                    <p className="text-xs text-gray-400 capitalize">{gw.type}</p>
                  </div>
                </div>
                <Switch defaultChecked={gw.status === 'active'} />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {gw.status === 'active' ? (
                <div className="space-y-2">
                  {Object.keys(gw.fields).map((key) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-500 mb-0.5 capitalize">{key.replace(/_/g, ' ')}</label>
                      <Input type="password" defaultValue={gw.fields[key as keyof typeof gw.fields] as string} className="h-8 text-xs" />
                    </div>
                  ))}
                  <Button size="sm" className="w-full bg-[#6366F1] hover:bg-[#5558E6] text-white h-8 text-xs mt-2">
                    <Settings className="h-3 w-3 mr-1" /> Update
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
                  <XCircle className="h-4 w-4 mr-2" /> Gateway is disabled
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
