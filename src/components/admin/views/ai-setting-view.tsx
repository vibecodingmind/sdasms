'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2, CheckCircle2, XCircle, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function AiSettingView() {
  const [activeTab, setActiveTab] = useState('ai');

  // AI State
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiModel, setAiModel] = useState('gpt-3.5-turbo');
  const [aiTemperature, setAiTemperature] = useState('0.7');
  const [aiMaxTokens, setAiMaxTokens] = useState('2048');
  const [aiSaved, setAiSaved] = useState(false);

  // Beem State
  const [beemEnabled, setBeemEnabled] = useState(false);
  const [beemApiKey, setBeemApiKey] = useState('');
  const [beemSecretKey, setBeemSecretKey] = useState('');
  const [beemSenderId, setBeemSenderId] = useState('SDASMS');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [balance, setBalance] = useState<number | null>(null);
  const [beemSaved, setBeemSaved] = useState(false);

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

    const aiStored = localStorage.getItem('sdasms_ai_config');
    if (aiStored) {
      try {
        const config = JSON.parse(aiStored);
        if (config.enabled !== undefined) setAiEnabled(config.enabled);
        if (config.apiKey) setAiApiKey(config.apiKey);
        if (config.model) setAiModel(config.model);
        if (config.temperature) setAiTemperature(config.temperature);
        if (config.maxTokens) setAiMaxTokens(config.maxTokens);
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

  const saveBeemSettings = () => {
    const config = {
      enabled: beemEnabled,
      apiKey: beemApiKey,
      secretKey: beemSecretKey,
      senderId: beemSenderId,
    };
    localStorage.setItem('sdasms_beem_config', JSON.stringify(config));
    setBeemSaved(true);
    toast.success('SMS Gateway settings saved!');
    setTimeout(() => setBeemSaved(false), 3000);
  };

  const saveAiSettings = () => {
    const config = {
      enabled: aiEnabled,
      apiKey: aiApiKey,
      model: aiModel,
      temperature: aiTemperature,
      maxTokens: aiMaxTokens,
    };
    localStorage.setItem('sdasms_ai_config', JSON.stringify(config));
    setAiSaved(true);
    toast.success('AI settings saved!');
    setTimeout(() => setAiSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="sms-gateway" className="text-xs">📡 SMS Gateway</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">🤖 AI Settings</TabsTrigger>
        </TabsList>

        {/* SMS Gateway Tab */}
        <TabsContent value="sms-gateway" className="space-y-6 mt-4">
          <Card className="border-0 shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-base">Beem Africa SMS Gateway</CardTitle>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <div className="relative">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="Enter your Beem API key"
                    value={beemApiKey}
                    onChange={(e) => setBeemApiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <div className="relative">
                  <Input
                    type={showSecretKey ? 'text' : 'password'}
                    placeholder="Enter your Beem secret key"
                    value={beemSecretKey}
                    onChange={(e) => setBeemSecretKey(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                <p className="text-xs text-gray-400 mt-1">Max 11 characters, alphanumeric only</p>
              </div>

              {/* Connection Status & Test */}
              <div className="rounded-lg border border-gray-200 p-4 space-y-3">
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

                {connectionStatus === 'connected' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Connected successfully</span>
                    {balance !== null && (
                      <span className="ml-auto text-sm font-semibold">
                        Balance: {balance.toLocaleString()} credits
                      </span>
                    )}
                  </div>
                )}

                {connectionStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">Connection failed. Check your API credentials.</span>
                  </div>
                )}
              </div>

              {beemSaved && (
                <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
                  SMS Gateway settings saved successfully!
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={saveBeemSettings}>
                  <Save className="h-4 w-4 mr-2" /> Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings Tab */}
        <TabsContent value="ai" className="space-y-6 mt-4">
          <Card className="border-0 shadow-sm max-w-2xl">
            <CardHeader><CardTitle className="text-base">AI Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Enable AI Features</p>
                  <p className="text-xs text-gray-400">Enable AI-powered content generation and analysis</p>
                </div>
                <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <Input type="password" placeholder="sk-..." value={aiApiKey} onChange={(e) => setAiApiKey(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
                <Select value={aiModel} onValueChange={setAiModel}>
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
                <Input type="number" step="0.1" min="0" max="2" value={aiTemperature} onChange={(e) => setAiTemperature(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                <Input type="number" value={aiMaxTokens} onChange={(e) => setAiMaxTokens(e.target.value)} />
              </div>
              {aiSaved && (
                <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
                  AI settings saved successfully!
                </div>
              )}
              <div className="flex justify-end pt-2">
                <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={saveAiSettings}>
                  <Save className="h-4 w-4 mr-2" /> Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
