'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AiSettingView() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">AI Setting</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure AI integration settings</p>
      </div>
      <Card className="border-0 shadow-sm max-w-2xl">
        <CardHeader><CardTitle className="text-base">AI Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Enable AI Features</p>
              <p className="text-xs text-gray-400">Enable AI-powered content generation and analysis</p>
            </div>
            <Switch />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <Input type="password" placeholder="sk-..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
            <Select defaultValue="gpt-3.5-turbo">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
            <Input type="number" step="0.1" min="0" max="2" defaultValue="0.7" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
            <Input type="number" defaultValue="2048" />
          </div>
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
              AI settings saved successfully!
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white" onClick={() => setSaved(true)}>
              <Save className="h-4 w-4 mr-2" /> Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
