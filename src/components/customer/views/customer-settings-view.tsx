'use client';

import React, { useState } from 'react';
import { User, Key, Bell, Shield, Save, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCustomer } from '../customer-context';

export function CustomerSettingsView() {
  const { customerUser } = useCustomer();

  const [profileForm, setProfileForm] = useState({
    first_name: customerUser?.first_name || '',
    last_name: customerUser?.last_name || '',
    email: customerUser?.email || '',
    phone: customerUser?.phone || '',
    company: 'Acme Corp',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new_password: '',
    confirm: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const [notifications, setNotifications] = useState({
    email_alerts: true,
    sms_delivery: true,
    low_balance: true,
    weekly_report: false,
    marketing: false,
  });

  const handleProfileSave = () => {
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.new_password || !passwordForm.confirm) {
      toast.error('All fields are required');
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully');
    setPasswordForm({ current: '', new_password: '', confirm: '' });
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('sdasms_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6');
    setCopied(true);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#D72444]" />
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Profile Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</Label>
              <Input
                value={profileForm.first_name}
                onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</Label>
              <Input
                value={profileForm.last_name}
                onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</Label>
            <Input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</Label>
            <Input
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company</Label>
            <Input
              value={profileForm.company}
              onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handleProfileSave}>
              <Save className="h-4 w-4 mr-1" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#D72444]" />
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notification Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email_alerts' as const, label: 'Email Alerts', desc: 'Receive email notifications for important events' },
            { key: 'sms_delivery' as const, label: 'SMS Delivery Reports', desc: 'Get notified when SMS delivery reports are available' },
            { key: 'low_balance' as const, label: 'Low Balance Alert', desc: 'Alert when SMS balance falls below threshold' },
            { key: 'weekly_report' as const, label: 'Weekly Report', desc: 'Receive weekly SMS usage summary via email' },
            { key: 'marketing' as const, label: 'Marketing Updates', desc: 'Receive news about new features and promotions' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Key */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-[#D72444]" />
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">API Key</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use this API key to integrate SDASMS with your applications. Keep it secret.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-mono text-sm text-gray-600 dark:text-gray-400">
              {showApiKey
                ? 'sdasms_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
                : 'sk_••••••••••••••••••••••••••••••••••••'}
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={copyApiKey}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            API Access Enabled
          </Badge>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#D72444]" />
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Change Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</Label>
            <Input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handlePasswordChange}>
              <Key className="h-4 w-4 mr-1" /> Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
