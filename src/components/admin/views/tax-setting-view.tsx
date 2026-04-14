'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TaxSettingView() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Tax Setting</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure tax settings for billing</p>
      </div>
      <Card className="border-0 shadow-sm max-w-2xl">
        <CardHeader><CardTitle className="text-base">Tax Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
            <Input placeholder="VAT" defaultValue="GST" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage</label>
              <Input type="number" step="0.01" placeholder="10.00" defaultValue="18.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
              <Select defaultValue="percentage">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Enable Tax</p>
              <p className="text-xs text-gray-400">Apply tax to all invoices</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Tax Inclusive Pricing</p>
              <p className="text-xs text-gray-400">Show prices including tax</p>
            </div>
            <Switch />
          </div>
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
              Settings saved successfully!
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={() => setSaved(true)}>
              <Save className="h-4 w-4 mr-2" /> Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
