'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2, CheckCircle2, XCircle, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function AllSettingsView() {
  const [saved, setSaved] = useState(false);

  // General settings
  const [appName, setAppName] = useState('SDASMS');
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [defaultCountry, setDefaultCountry] = useState('US');
  const [defaultTimezone, setDefaultTimezone] = useState('UTC');
  const [smsUnitCost, setSmsUnitCost] = useState('0.012');

  // Feature settings
  const [senderIdVerification, setSenderIdVerification] = useState(true);
  const [dltCompliance, setDltCompliance] = useState(false);
  const [customerRegistration, setCustomerRegistration] = useState(true);
  const [apiAccess, setApiAccess] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Beem SMS Gateway settings
  const [beemEnabled, setBeemEnabled] = useState(false);
  const [beemApiKey, setBeemApiKey] = useState('');
  const [beemSecretKey, setBeemSecretKey] = useState('');
  const [beemSenderId, setBeemSenderId] = useState('SDASMS');
  const [showBeemApiKey, setShowBeemApiKey] = useState(false);
  const [showBeemSecretKey, setShowBeemSecretKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('sdasms_beem_config');
    if (stored) {
      try {
        const config = JSON.parse(stored);
        if (config.enabled !== undefined) setBeemEnabled(config.enabled);
        if (config.apiKey) setBeemApiKey(config.apiKey);
        if (config.secretKey) setBeemSecretKey(config.secretKey);
        if (config.senderId) setBeemSenderId(config.senderId);
      } catch {
        // ignore
      }
    }
  }, []);

  const testBeemConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus('idle');
    try {
      const res = await fetch('/api/sms/balance');
      const data = await res.json();
      if (data.success) {
        setConnectionStatus('connected');
        setBalance(data.data.credit_balance);
        toast.success('Connection successful! Beem API is reachable.');
      } else {
        setConnectionStatus('error');
        toast.error('Connection failed: ' + (data.error || 'Unknown error'));
      }
    } catch {
      setConnectionStatus('error');
      toast.error('Connection failed. Check your network.');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = () => {
    // Save Beem config to localStorage
    const beemConfig = {
      enabled: beemEnabled,
      apiKey: beemApiKey,
      secretKey: beemSecretKey,
      senderId: beemSenderId,
    };
    localStorage.setItem('sdasms_beem_config', JSON.stringify(beemConfig));

    setSaved(true);
    toast.success('All settings saved successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">All Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">General application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">General Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
              <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Country</label>
                <Select value={defaultCountry} onValueChange={setDefaultCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="TZ">Tanzania</SelectItem>
                    <SelectItem value="KE">Kenya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                <Select value={defaultTimezone} onValueChange={setDefaultTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="IST">India Standard</SelectItem>
                    <SelectItem value="EAT">East Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMS Unit Cost</label>
              <Input type="number" step="0.001" value={smsUnitCost} onChange={(e) => setSmsUnitCost(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Feature Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Sender ID Verification</p>
                <p className="text-xs text-gray-400">Require verification for new sender IDs</p>
              </div>
              <Switch checked={senderIdVerification} onCheckedChange={setSenderIdVerification} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">DLT Compliance</p>
                <p className="text-xs text-gray-400">Enable DLT template requirements</p>
              </div>
              <Switch checked={dltCompliance} onCheckedChange={setDltCompliance} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Customer Registration</p>
                <p className="text-xs text-gray-400">Allow self-registration</p>
              </div>
              <Switch checked={customerRegistration} onCheckedChange={setCustomerRegistration} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">API Access</p>
                <p className="text-xs text-gray-400">Enable REST API for customers</p>
              </div>
              <Switch checked={apiAccess} onCheckedChange={setApiAccess} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                <p className="text-xs text-gray-400">Send email alerts for important events</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* SMS Gateway Settings */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>📡</span> SMS Gateway (Beem Africa)
            </CardTitle>
            <CardDescription>Configure your Beem Africa API credentials for sending SMS messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Enable SMS Gateway</p>
                <p className="text-xs text-gray-400">Enable sending SMS via Beem Africa API</p>
              </div>
              <Switch checked={beemEnabled} onCheckedChange={setBeemEnabled} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <div className="relative">
                  <Input
                    type={showBeemApiKey ? 'text' : 'password'}
                    placeholder="Enter Beem API key"
                    value={beemApiKey}
                    onChange={(e) => setBeemApiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowBeemApiKey(!showBeemApiKey)}
                  >
                    {showBeemApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <div className="relative">
                  <Input
                    type={showBeemSecretKey ? 'text' : 'password'}
                    placeholder="Enter Beem secret key"
                    value={beemSecretKey}
                    onChange={(e) => setBeemSecretKey(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowBeemSecretKey(!showBeemSecretKey)}
                  >
                    {showBeemSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Sender ID</label>
                <Input
                  placeholder="SDASMS"
                  value={beemSenderId}
                  onChange={(e) => setBeemSenderId(e.target.value)}
                />
              </div>
            </div>

            {/* Connection Status & Test */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : connectionStatus === 'error' ? (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Wifi className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Connection Status</span>
                </div>
                <div className="flex items-center gap-3">
                  {balance !== null && connectionStatus === 'connected' && (
                    <span className="text-sm font-semibold text-green-600">
                      Balance: {balance.toLocaleString()} credits
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={testBeemConnection}
                    disabled={testingConnection}
                  >
                    {testingConnection ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : null}
                    Test Connection
                  </Button>
                </div>
              </div>

              {connectionStatus === 'connected' && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md mt-3">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Connected to Beem Africa API</span>
                </div>
              )}

              {connectionStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md mt-3">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm">Connection failed. Check your API credentials.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      <div className="flex justify-end">
        <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
