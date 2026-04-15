'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Info, Database, Server, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function UpdateAppView() {
  const [checking, setChecking] = useState(false);
  const [upToDate, setUpToDate] = useState(false);

  const checkUpdates = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setUpToDate(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Version */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-5 w-5 text-[#D72444]" />
              Application Version
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">v3.2.1</p>
                  <p className="text-xs text-gray-400 mt-1">Released: January 5, 2025</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <Button
              className="w-full bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={checkUpdates}
              disabled={checking}
            >
              {checking ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Checking for updates...</>
              ) : (
                <><RefreshCw className="h-4 w-4 mr-2" /> Check for Updates</>
              )}
            </Button>

            {upToDate && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                You are running the latest version (v3.2.1)
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-5 w-5 text-[#D72444]" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { icon: <Server className="h-4 w-4 text-gray-400" />, label: 'Node.js', value: 'v20.11.0' },
                { icon: <Database className="h-4 w-4 text-gray-400" />, label: 'Database', value: 'MySQL 8.0.35' },
                { icon: <HardDrive className="h-4 w-4 text-gray-400" />, label: 'Framework', value: 'Next.js 16.1.1' },
                { icon: <Info className="h-4 w-4 text-gray-400" />, label: 'Environment', value: 'Production' },
                { icon: <Server className="h-4 w-4 text-gray-400" />, label: 'Web Server', value: 'Nginx 1.24.0' },
                { icon: <Database className="h-4 w-4 text-gray-400" />, label: 'Cache', value: 'Redis 7.2.3' },
                { icon: <HardDrive className="h-4 w-4 text-gray-400" />, label: 'Storage', value: 'Local / S3 Compatible' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm text-gray-500">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Changelog */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Changelog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { version: 'v3.2.1', date: 'Jan 5, 2025', changes: ['Fixed SMS delivery tracking issue', 'Improved dashboard performance', 'Added new currency support'] },
              { version: 'v3.2.0', date: 'Dec 15, 2024', changes: ['New WhatsApp Business API integration', 'Campaign scheduling improvements', 'Updated payment gateway configurations'] },
              { version: 'v3.1.0', date: 'Nov 20, 2024', changes: ['Added AI-powered content generation', 'New admin role permissions', 'Improved report analytics'] },
            ].map((release) => (
              <div key={release.version} className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-[#D72444]">{release.version}</span>
                  <span className="text-xs text-gray-400">{release.date}</span>
                </div>
                <ul className="space-y-1">
                  {release.changes.map((change, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
