'use client';

import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export function MaintenanceModeView() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('We are performing scheduled maintenance. Please try again later.');
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Maintenance Mode</h1>
        <p className="text-sm text-gray-500 mt-0.5">Enable/disable maintenance mode for the platform</p>
      </div>

      <Card className="border-0 shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Maintenance Mode Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-800">Enable Maintenance Mode</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {enabled
                  ? '⚠️ Your platform is currently in maintenance mode. Users will see the maintenance message.'
                  : 'Platform is running normally. Users can access all features.'}
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Message shown to users during maintenance..."
            />
          </div>

          {enabled && (
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm font-medium text-yellow-800">Preview</p>
              </div>
              <p className="text-sm text-yellow-700">{message}</p>
            </div>
          )}

          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
              Maintenance settings saved successfully!
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
