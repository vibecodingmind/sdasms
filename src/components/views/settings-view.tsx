'use client';

import { useApp } from '@/components/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Key, Bell, Globe, Shield, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function SettingsView() {
  const { user } = useApp();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    timezone: user?.timezone || 'UTC',
    dltEntityId: user?.dltEntityId || '',
    dltTelemarketerId: user?.dltTelemarketerId || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    deliveryReport: true,
    campaignComplete: true,
    lowBalance: true,
    newContact: false,
    weeklyReport: true,
  });
  const [webhookUrl, setWebhookUrl] = useState('https://myapp.example.com/webhooks/smspro');
  const [webhookEvents, setWebhookEvents] = useState({
    delivery_report: true,
    campaign_completed: true,
    contact_unsubscribed: false,
  });

  const handleSaveProfile = async () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('smspro_sk_a1b2c3d4e5f6g7h8i9j0');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5"><User className="h-3.5 w-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="api" className="gap-1.5"><Key className="h-3.5 w-3.5" />API Keys</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-1.5"><Globe className="h-3.5 w-3.5" />Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>First Name</Label><Input value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} /></div>
                <div className="space-y-2"><Label>Last Name</Label><Input value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" value={profileForm.timezone} onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3">DLT Compliance (India)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>DLT Entity ID</Label><Input value={profileForm.dltEntityId} onChange={(e) => setProfileForm({ ...profileForm, dltEntityId: e.target.value })} placeholder="Enter DLT Entity ID" /></div>
                  <div className="space-y-2"><Label>DLT Telemarketer ID</Label><Input value={profileForm.dltTelemarketerId} onChange={(e) => setProfileForm({ ...profileForm, dltTelemarketerId: e.target.value })} placeholder="Enter Telemarketer ID" /></div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                  {profileSaved ? <><CheckCircle2 className="h-4 w-4 mr-2" />Saved!</> : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="Enter current password" /></div>
              <div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="Enter new password" /></div>
              <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" placeholder="Confirm new password" /></div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your REST API credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>API Key</Label>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Active</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-mono text-sm text-slate-600 overflow-hidden">
                    smspro_sk_a1b2c3d4e5f6g7h8i9j0
                  </div>
                  <Button variant="outline" size="icon" onClick={copyApiKey}>
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">Use this key to authenticate API requests. Keep it secret.</p>
              </div>

              <Separator />

              <div>
                <Label className="mb-2 block">API Base URL</Label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-mono text-sm text-slate-600">
                  https://api.smspro.example.com/v1
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Start</h3>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono whitespace-pre">
{`# Send an SMS via API
curl -X POST https://api.smspro.example.com/v1/sms/send \\
  -H "Authorization: Bearer smspro_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+919876543210",
    "from": "SMSPro",
    "message": "Hello from SMSPro!"
  }'`}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Regenerate Key</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Create New Key</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'deliveryReport', label: 'Delivery Reports', desc: 'Get notified about message delivery status' },
                { key: 'campaignComplete', label: 'Campaign Completed', desc: 'Receive notification when campaigns finish' },
                { key: 'lowBalance', label: 'Low Balance Alert', desc: 'Warning when SMS credits are running low' },
                { key: 'newContact', label: 'New Contact Added', desc: 'Notify when new contacts are imported' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary of weekly messaging activity' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Receive real-time event notifications via webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex items-center gap-2">
                  <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-app.com/webhook" />
                  <Button variant="outline">Test</Button>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Events</Label>
                <div className="space-y-3">
                  {[
                    { key: 'delivery_report', label: 'Delivery Report', desc: 'Message delivery status updates' },
                    { key: 'campaign_completed', label: 'Campaign Completed', desc: 'When a campaign finishes sending' },
                    { key: 'contact_unsubscribed', label: 'Contact Unsubscribed', desc: 'When a contact opts out' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                      <Switch checked={webhookEvents[item.key as keyof typeof webhookEvents]} onCheckedChange={(checked) => setWebhookEvents({ ...webhookEvents, [item.key]: checked })} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Example webhook payload:</p>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`{
  "event": "delivery_report",
  "message_id": "msg_12345",
  "status": "delivered",
  "to": "+919876543210",
  "timestamp": "2024-12-01T10:30:15Z"
}`}
                </pre>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Delete Webhook</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Webhook</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
