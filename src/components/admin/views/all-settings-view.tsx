'use client';

import React, { useState, useMemo } from 'react';
import {
  Save, Eye, EyeOff, Loader2, CheckCircle2, XCircle, Wifi, WifiOff,
  Settings, Mail, Shield, Users, Bell, Radio, FileText, Clock, KeyRound,
  Upload, Copy, Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// ==================== TAB DEFINITIONS ====================
const settingTabs = [
  { value: 'general', label: 'General', icon: Settings },
  { value: 'system-email', label: 'System Email', icon: Mail },
  { value: 'authentication', label: 'Authentication', icon: Shield },
  { value: 'customer-permissions', label: 'Customer Permissions', icon: Users },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'pusher', label: 'Pusher', icon: Radio },
  { value: 'dlt', label: 'DLT', icon: FileText },
  { value: 'cron-jobs', label: 'Cron Jobs', icon: Clock },
  { value: 'license', label: 'License', icon: KeyRound },
];

// ==================== PERMISSION SECTIONS ====================
const permissionSections = [
  {
    title: 'DASHBOARD',
    permissions: [
      { key: 'dashboard', label: 'DASHBOARD', defaultChecked: true },
    ],
  },
  {
    title: 'REPORTS',
    permissions: [
      { key: 'view_reports', label: 'VIEW REPORTS', defaultChecked: true },
    ],
  },
  {
    title: 'AUTOMATIONS',
    permissions: [
      { key: 'automations', label: 'AUTOMATIONS', defaultChecked: true },
    ],
  },
  {
    title: 'CONTACTS',
    permissions: [
      { key: 'view_contact_group', label: 'VIEW CONTACT GROUP', defaultChecked: true },
      { key: 'create_contact_group', label: 'CREATE CONTACT GROUP', defaultChecked: true },
      { key: 'update_contact_group', label: 'UPDATE CONTACT GROUP', defaultChecked: true },
      { key: 'delete_contact_group', label: 'DELETE CONTACT GROUP', defaultChecked: true },
      { key: 'view_contact', label: 'VIEW CONTACT', defaultChecked: true },
      { key: 'create_contact', label: 'CREATE CONTACT', defaultChecked: true },
      { key: 'update_contact', label: 'UPDATE CONTACT', defaultChecked: true },
      { key: 'delete_contact', label: 'DELETE CONTACT', defaultChecked: true },
    ],
  },
  {
    title: 'PHONE NUMBERS',
    permissions: [
      { key: 'view_numbers', label: 'VIEW NUMBERS', defaultChecked: false },
      { key: 'buy_predefined_numbers', label: 'BUY PREDEFINED NUMBERS', defaultChecked: false },
      { key: 'release_numbers', label: 'RELEASE NUMBERS', defaultChecked: false },
    ],
  },
  {
    title: 'KEYWORDS',
    permissions: [
      { key: 'view_keywords', label: 'VIEW KEYWORDS', defaultChecked: false },
      { key: 'create_keywords', label: 'CREATE KEYWORDS', defaultChecked: false },
      { key: 'buy_keywords', label: 'BUY KEYWORDS', defaultChecked: false },
      { key: 'update_keywords', label: 'UPDATE KEYWORDS', defaultChecked: false },
      { key: 'release_keywords', label: 'RELEASE KEYWORDS', defaultChecked: false },
    ],
  },
  {
    title: 'SENDER ID',
    permissions: [
      { key: 'view_sender_id', label: 'VIEW SENDER ID', defaultChecked: true },
      { key: 'request_sender_id', label: 'REQUEST SENDER ID', defaultChecked: true },
      { key: 'delete_sender_id', label: 'DELETE SENDER ID', defaultChecked: false },
    ],
  },
  {
    title: 'BLACKLIST',
    permissions: [
      { key: 'view_blacklist', label: 'VIEW BLACKLIST', defaultChecked: true },
      { key: 'create_blacklist', label: 'CREATE BLACKLIST', defaultChecked: true },
      { key: 'delete_blacklist', label: 'DELETE BLACKLIST', defaultChecked: true },
    ],
  },
  {
    title: 'SMS',
    permissions: [
      { key: 'sms_campaign_builder', label: 'SMS CAMPAIGN BUILDER', defaultChecked: true },
      { key: 'sms_quick_send', label: 'SMS QUICK SEND', defaultChecked: true },
      { key: 'sms_send_using_file', label: 'SEND SMS USING FILE', defaultChecked: true },
    ],
  },
  {
    title: 'VOICE',
    permissions: [
      { key: 'voice_campaign_builder', label: 'SMS CAMPAIGN BUILDER', defaultChecked: false },
      { key: 'voice_quick_send', label: 'SMS QUICK SEND', defaultChecked: false },
      { key: 'voice_send_using_file', label: 'SEND SMS USING FILE', defaultChecked: false },
    ],
  },
  {
    title: 'MMS',
    permissions: [
      { key: 'mms_campaign_builder', label: 'SMS CAMPAIGN BUILDER', defaultChecked: false },
      { key: 'mms_quick_send', label: 'SMS QUICK SEND', defaultChecked: false },
      { key: 'mms_send_using_file', label: 'SEND SMS USING FILE', defaultChecked: false },
    ],
  },
];

// ==================== PHP PATHS ====================
const phpPaths = [
  '/usr/bin/php',
  '/usr/local/bin/php',
  '/bin/php',
  '/opt/alt/php81/usr/bin/php',
  '/opt/alt/php82/usr/bin/php',
  '/opt/alt/php83/usr/bin/php',
  '/usr/lib64/php',
  '/usr/local/lib/php',
];

// ==================== NOTIFICATION CHECKBOXES ====================
const notificationOptions = [
  { key: 'sender_id_email', label: 'Enable Sender ID Request notification by Email', defaultChecked: true },
  { key: 'user_registration_email', label: 'Enable User Registration notification by Email', defaultChecked: true },
  { key: 'subscription_email', label: 'Enable Subscription notification by Email', defaultChecked: true },
  { key: 'keyword_purchase_email', label: 'Enable Keyword purchase notification by Email', defaultChecked: true },
  { key: 'phone_number_purchase_email', label: 'Enable Phone number purchase notification by Email', defaultChecked: true },
  { key: 'login_email', label: 'Enable Login notification by Email', defaultChecked: true },
];

// ==================== MAIN COMPONENT ====================
export function AllSettingsView() {
  const [activeTab, setActiveTab] = useState('general');

  // ---- General State ----
  const [appName, setAppName] = useState('SDASMS');
  const [appTitle, setAppTitle] = useState('Digital Evangelism Messaging Platform');
  const [appKeyword, setAppKeyword] = useState('sdasms, bulk sms, sms, sms marketing, digital evangelism');
  const [address, setAddress] = useState('Sokoine Rd, ACU Building, 2nd Floor, Office No.203, Arusha, Tanzania');
  const [footerText, setFooterText] = useState('Copyright © SDASMS - 2025');
  const [country, setCountry] = useState('TZ');
  const [timezone, setTimezone] = useState('Africa/Dar_es_Salaam');
  const [dateFormat, setDateFormat] = useState('d M Y');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [customScripts, setCustomScripts] = useState('');

  // ---- System Email State ----
  const [emailMethod, setEmailMethod] = useState('smtp');
  const [emailHost, setEmailHost] = useState('mail.sdasms.com');
  const [emailPort, setEmailPort] = useState('465');
  const [emailEncryption, setEmailEncryption] = useState('ssl');
  const [emailUsername, setEmailUsername] = useState('hello@sdasms.com');
  const [emailPassword, setEmailPassword] = useState('Mails@GutengT@E511713');
  const [emailFromEmail, setEmailFromEmail] = useState('hello@sdasms.com');
  const [emailFromName, setEmailFromName] = useState('SDASMS Africa');
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // ---- Authentication State ----
  const [allowClientRegistration, setAllowClientRegistration] = useState('no');
  const [allowCustomerDeleteAccount, setAllowCustomerDeleteAccount] = useState('no');
  const [allowCustomerSubaccounts, setAllowCustomerSubaccounts] = useState('yes');
  const [allowCustomerDeleteSubaccounts, setAllowCustomerDeleteSubaccounts] = useState('yes');
  const [verificationAfterRegistration, setVerificationAfterRegistration] = useState('no');
  const [twoFactorAuth, setTwoFactorAuth] = useState('yes');
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState('6LeY73MpAAAAAJmHek_mWuzHdNyLtQGrPmhqmn-N');
  const [recaptchaSecretKey, setRecaptchaSecretKey] = useState('6LeY73MpAAAAA8zf0Xz_qIKcz_6jyININnZLMOW');
  const [captchaInLogin, setCaptchaInLogin] = useState('no');
  const [captchaInRegistration, setCaptchaInRegistration] = useState('yes');
  const [loginFacebook, setLoginFacebook] = useState('no');
  const [loginTwitter, setLoginTwitter] = useState('no');
  const [loginGoogle, setLoginGoogle] = useState('no');
  const [loginGithub, setLoginGithub] = useState('no');

  // ---- Customer Permissions State ----
  const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    permissionSections.forEach(section => {
      section.permissions.forEach(p => {
        initial[p.key] = p.defaultChecked;
      });
    });
    return initial;
  });
  const selectAll = useMemo(() => {
    const allKeys = permissionSections.flatMap(s => s.permissions.map(p => p.key));
    return allKeys.every(k => permissions[k]);
  }, [permissions]);

  // ---- Notifications State ----
  const [notifSmsGateway, setNotifSmsGateway] = useState('StarLink5G');
  const [notifSenderId, setNotifSenderId] = useState('SDASMS');
  const [notifPhoneNumber, setNotifPhoneNumber] = useState('255658600302');
  const [notifFromName, setNotifFromName] = useState('SDASMS');
  const [notifEmailAddress, setNotifEmailAddress] = useState('hello@sdasms.com');
  const [notifChecks, setNotifChecks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    notificationOptions.forEach(n => {
      initial[n.key] = n.defaultChecked;
    });
    return initial;
  });

  // ---- Cron Jobs State ----
  const [selectedPhpPath, setSelectedPhpPath] = useState('/usr/local/bin/php');
  const [copied, setCopied] = useState(false);

  // ---- Pusher State ----
  const [pusherEnabled, setPusherEnabled] = useState(false);
  const [pusherAppId, setPusherAppId] = useState('');
  const [pusherAppKey, setPusherAppKey] = useState('');
  const [pusherAppSecret, setPusherAppSecret] = useState('');
  const [pusherCluster, setPusherCluster] = useState('us-east-1');
  const [showPusherSecret, setShowPusherSecret] = useState(false);

  // ---- DLT State ----
  const [dltEnabled, setDltEnabled] = useState(false);
  const [dltApiUrl, setDltApiUrl] = useState('');
  const [dltApiKey, setDltApiKey] = useState('');
  const [dltSenderId, setDltSenderId] = useState('');

  // ---- License State ----
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseEmail, setLicenseEmail] = useState('');
  const [showLicenseKey, setShowLicenseKey] = useState(false);

  // ---- Save State ----
  const [saved, setSaved] = useState(false);

  // Handle select all permissions

  const handleSelectAll = (checked: boolean) => {
    const updated = { ...permissions };
    permissionSections.forEach(section => {
      section.permissions.forEach(p => {
        updated[p.key] = checked;
      });
    });
    setPermissions(updated);
  };

  const handlePermissionChange = (key: string, checked: boolean) => {
    setPermissions(prev => ({ ...prev, [key]: checked }));
  };

  const handleNotifCheckChange = (key: string, checked: boolean) => {
    setNotifChecks(prev => ({ ...prev, [key]: checked }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  // Cron command
  const cronCommand = `****/${selectedPhpPath} -d register_argc_argv=On /home/sdasms/public_html/my.sdasms.com/artisan schedule:run >> /dev/null 2>&1`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-gray-200 rounded-lg p-0 h-auto flex-wrap gap-0">
          {settingTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 text-gray-500 text-sm font-medium transition-all"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ==================== GENERAL TAB ==================== */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              {/* App Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Application Name</Label>
                  <Input value={appName} onChange={(e) => setAppName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Application Title</Label>
                  <Input value={appTitle} onChange={(e) => setAppTitle(e.target.value)} className="mt-1.5" />
                </div>
              </div>

              {/* App Keyword */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Application Keyword</Label>
                <Input value={appKeyword} onChange={(e) => setAppKeyword(e.target.value)} className="mt-1.5" />
              </div>

              {/* Address */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5" rows={3} />
              </div>

              {/* Footer Text */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Footer Text</Label>
                <Input value={footerText} onChange={(e) => setFooterText(e.target.value)} className="mt-1.5" />
              </div>

              <Separator />

              {/* Logo Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Logo</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4" />
                    Choose File
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                  <span className="text-xs text-gray-400">No file chosen</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Recommended size: Width 150px x Height 26px</p>
              </div>

              {/* Favicon Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Favicon</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4" />
                    Choose File
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                  <span className="text-xs text-gray-400">No file chosen</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Recommended size: Width 32px x Height 32px</p>
              </div>

              <Separator />

              {/* Country / Timezone / Date Format / Time Format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TZ">Tanzania</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="ZA">South Africa</SelectItem>
                      <SelectItem value="UG">Uganda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dar_es_Salaam">(UTC +03:00) Africa/Dar_es_Salaam</SelectItem>
                      <SelectItem value="Africa/Nairobi">(UTC +03:00) Africa/Nairobi</SelectItem>
                      <SelectItem value="Africa/Lagos">(UTC +01:00) Africa/Lagos</SelectItem>
                      <SelectItem value="UTC">(UTC +00:00) UTC</SelectItem>
                      <SelectItem value="America/New_York">(UTC -05:00) Eastern Time</SelectItem>
                      <SelectItem value="Asia/Kolkata">(UTC +05:30) India Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="d M Y">15th May 16</SelectItem>
                      <SelectItem value="M d, Y">May 15, 2016</SelectItem>
                      <SelectItem value="Y-m-d">2016-05-15</SelectItem>
                      <SelectItem value="d/m/Y">15/05/2016</SelectItem>
                      <SelectItem value="m/d/Y">05/15/2016</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Time Format</Label>
                  <Select value={timeFormat} onValueChange={setTimeFormat}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12-hour">12-hour</SelectItem>
                      <SelectItem value="24-hour">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Default Language</Label>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Custom Scripts */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Custom Scripts</Label>
                <Textarea
                  className="mt-1.5"
                  rows={6}
                  placeholder="Copy and paste your custom scripts in the box below. It will be included in every page"
                  value={customScripts}
                  onChange={(e) => setCustomScripts(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== SYSTEM EMAIL TAB ==================== */}
        <TabsContent value="system-email" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              {/* Method */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Method for sending system mail</Label>
                <Select value={emailMethod} onValueChange={setEmailMethod}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendmail">Sendmail</SelectItem>
                    <SelectItem value="php">PHP Mail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Host / Port */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Host name</Label>
                  <Input value={emailHost} onChange={(e) => setEmailHost(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Port</Label>
                  <Input value={emailPort} onChange={(e) => setEmailPort(e.target.value)} className="mt-1.5" />
                </div>
              </div>

              {/* Encryption */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Encryption</Label>
                <Select value={emailEncryption} onValueChange={setEmailEncryption}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ssl">SSL</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Username / Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Username</Label>
                  <Input value={emailUsername} onChange={(e) => setEmailUsername(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showEmailPassword ? 'text' : 'password'}
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowEmailPassword(!showEmailPassword)}
                    >
                      {showEmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* From Email / From Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">From Email</Label>
                  <Input value={emailFromEmail} onChange={(e) => setEmailFromEmail(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">From Name</Label>
                  <Input value={emailFromName} onChange={(e) => setEmailFromName(e.target.value)} className="mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== AUTHENTICATION TAB ==================== */}
        <TabsContent value="authentication" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              {/* Registration Settings */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Allow client registration</Label>
                    <Select value={allowClientRegistration} onValueChange={setAllowClientRegistration}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Allow Customer to delete own account</Label>
                    <Select value={allowCustomerDeleteAccount} onValueChange={setAllowCustomerDeleteAccount}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Allow Customer to create subaccounts</Label>
                    <Select value={allowCustomerSubaccounts} onValueChange={setAllowCustomerSubaccounts}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Allow Customer to delete subaccounts</Label>
                    <Select value={allowCustomerDeleteSubaccounts} onValueChange={setAllowCustomerDeleteSubaccounts}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Verification after client registration</Label>
                    <Select value={verificationAfterRegistration} onValueChange={setVerificationAfterRegistration}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Two factor authentication in login</Label>
                    <Select value={twoFactorAuth} onValueChange={setTwoFactorAuth}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* reCAPTCHA Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase">reCAPTCHA Information</h3>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-semibold">reCAPTCHA</span> is a free service that protects your site from spam and abuse, developed by{' '}
                    <span className="font-semibold">Google</span>. For this reason you will need a Google Account first. If you don&apos;t have, simply{' '}
                    <span className="underline cursor-pointer">Create a new Google account</span>.
                    Once you have an account with Google, log into the reCaptcha Admin page and setup your application install URL. For more details please{' '}
                    <span className="underline cursor-pointer">check Ultimate SMS Blog</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">reCaptcha site key</Label>
                    <Input value={recaptchaSiteKey} onChange={(e) => setRecaptchaSiteKey(e.target.value)} className="mt-1.5 font-mono text-xs" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">reCaptcha secret key</Label>
                    <div className="relative mt-1.5">
                      <Input
                        type={showEmailPassword ? 'text' : 'password'}
                        value={recaptchaSecretKey}
                        onChange={(e) => setRecaptchaSecretKey(e.target.value)}
                        className="font-mono text-xs"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                      >
                        {showEmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Captcha in login</Label>
                    <Select value={captchaInLogin} onValueChange={setCaptchaInLogin}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Captcha in client registration</Label>
                    <Select value={captchaInRegistration} onValueChange={setCaptchaInRegistration}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Social Login Section */}
              <div className="space-y-5">
                {/* Facebook */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase mb-3">FACEBOOK LOGIN</h3>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Login with Facebook</Label>
                    <Select value={loginFacebook} onValueChange={setLoginFacebook}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Twitter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase mb-3">TWITTER LOGIN</h3>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Login with Twitter</Label>
                    <Select value={loginTwitter} onValueChange={setLoginTwitter}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Google */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase mb-3">GOOGLE LOGIN</h3>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Login with Google</Label>
                    <Select value={loginGoogle} onValueChange={setLoginGoogle}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Github */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase mb-3">GITHUB LOGIN</h3>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Login with Github</Label>
                    <Select value={loginGithub} onValueChange={setLoginGithub}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== CUSTOMER PERMISSIONS TAB ==================== */}
        <TabsContent value="customer-permissions" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  />
                  <label htmlFor="select-all" className="text-sm font-semibold text-gray-800 uppercase cursor-pointer">
                    SELECT ALL
                  </label>
                </div>
              </div>

              <div className="space-y-5">
                {permissionSections.map((section) => (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-gray-800 uppercase">{section.title}</h3>
                    </div>
                    <div className="space-y-2.5 pl-2">
                      {section.permissions.map((perm) => (
                        <div key={perm.key} className="flex items-center gap-2.5">
                          <Checkbox
                            id={perm.key}
                            checked={permissions[perm.key]}
                            onCheckedChange={(checked) => handlePermissionChange(perm.key, checked === true)}
                          />
                          <label htmlFor={perm.key} className="text-sm text-gray-600 cursor-pointer">
                            {perm.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== NOTIFICATIONS TAB ==================== */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">SMS gateway for SMS notification <span className="text-red-500">*</span></Label>
                  <Select value={notifSmsGateway} onValueChange={setNotifSmsGateway}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="StarLink5G">StarLink5G</SelectItem>
                      <SelectItem value="Turbo5G">Turbo5G</SelectItem>
                      <SelectItem value="Beem">Beem Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Sender ID for SMS notification <span className="text-red-500">*</span></Label>
                  <Input value={notifSenderId} onChange={(e) => setNotifSenderId(e.target.value)} className="mt-1.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone number for SMS notification <span className="text-red-500">*</span></Label>
                  <Input value={notifPhoneNumber} onChange={(e) => setNotifPhoneNumber(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">From name for email notification <span className="text-red-500">*</span></Label>
                  <Input value={notifFromName} onChange={(e) => setNotifFromName(e.target.value)} className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Email address for email notification <span className="text-red-500">*</span></Label>
                <Input value={notifEmailAddress} onChange={(e) => setNotifEmailAddress(e.target.value)} className="mt-1.5" />
              </div>

              <Separator />

              <div className="space-y-3">
                {notificationOptions.map((opt) => (
                  <div key={opt.key} className="flex items-center gap-2.5">
                    <Checkbox
                      id={opt.key}
                      checked={notifChecks[opt.key]}
                      onCheckedChange={(checked) => handleNotifCheckChange(opt.key, checked === true)}
                    />
                    <label htmlFor={opt.key} className="text-sm text-gray-600 cursor-pointer">
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== PUSHER TAB ==================== */}
        <TabsContent value="pusher" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Pusher Configuration</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Enable real-time notifications via Pusher</p>
                </div>
                <Switch checked={pusherEnabled} onCheckedChange={setPusherEnabled} />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Pusher App ID</Label>
                  <Input value={pusherAppId} onChange={(e) => setPusherAppId(e.target.value)} className="mt-1.5" placeholder="Enter Pusher App ID" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Pusher App Key</Label>
                  <Input value={pusherAppKey} onChange={(e) => setPusherAppKey(e.target.value)} className="mt-1.5" placeholder="Enter Pusher App Key" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Pusher App Secret</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPusherSecret ? 'text' : 'password'}
                      value={pusherAppSecret}
                      onChange={(e) => setPusherAppSecret(e.target.value)}
                      placeholder="Enter Pusher App Secret"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPusherSecret(!showPusherSecret)}
                    >
                      {showPusherSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Cluster</Label>
                  <Select value={pusherCluster} onValueChange={setPusherCluster}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
                      <SelectItem value="ap-south-1">AP South (Mumbai)</SelectItem>
                      <SelectItem value="ap-southeast-1">AP Southeast (Singapore)</SelectItem>
                      <SelectItem value="sa-east-1">SA East (Sao Paulo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!pusherEnabled && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700">Pusher is currently disabled. Enable the switch above to configure real-time notifications.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== DLT TAB ==================== */}
        <TabsContent value="dlt" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">DLT Compliance</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Configure Distributed Ledger Technology for message template registration</p>
                </div>
                <Switch checked={dltEnabled} onCheckedChange={setDltEnabled} />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">DLT API URL</Label>
                  <Input value={dltApiUrl} onChange={(e) => setDltApiUrl(e.target.value)} className="mt-1.5" placeholder="https://api.dlt-provider.com" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">API Key</Label>
                  <Input value={dltApiKey} onChange={(e) => setDltApiKey(e.target.value)} className="mt-1.5" placeholder="Enter DLT API Key" type="password" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Default Sender ID</Label>
                <Input value={dltSenderId} onChange={(e) => setDltSenderId(e.target.value)} className="mt-1.5" placeholder="Enter default DLT Sender ID" />
              </div>

              {!dltEnabled && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700">DLT compliance is currently disabled. Enable the switch above to configure DLT settings.</p>
                </div>
              )}

              {dltEnabled && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700">DLT compliance is active. All SMS messages will be validated against registered templates before sending.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== CRON JOBS TAB ==================== */}
        <TabsContent value="cron-jobs" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">PHP Path</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  If you want to run cron jobs or background jobs on cPanel based applications then please copy the following commands without **** and login with your cPanel and search Cron Jobs in the search field on the top. Then click on the Cron Jobs option and select the Every minutes option from the common setting dropdown. For Plesk based hosting please select Scheduled Tasks from the right side and click on Add Task button. Then select Run a PHP script option and open file folder. After that go ultimate SMS installation folder and select artisan file. Then insert scheduler:run on arguments field. Finally, select your PHP version, cron style from the Run dropdown and insert **** For Cloud or VPS based hosting open your Terminal or Bash and Type crontab -e for ubuntu or Debian and Type sudo nano /etc/crontab for Centos operating system. Then insert the following command on the Crontab file.
                </p>
              </div>

              <RadioGroup value={selectedPhpPath} onValueChange={setSelectedPhpPath}>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {phpPaths.map((path) => (
                    <div key={path} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value={path} id={`php-${path}`} />
                      <label htmlFor={`php-${path}`} className="text-sm text-gray-600 font-mono cursor-pointer">
                        {path}
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Background Jobs</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Insert the following line to your system&apos;s crontab. Please note, below timings for running the cron jobs are the recommended, you can change it if you want.
                </p>

                <div className="relative bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-white"
                      onClick={() => handleCopy(cronCommand)}
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <span className="text-gray-400 text-[10px] absolute top-2 right-10 uppercase font-bold">PHP</span>
                  <pre className="whitespace-pre-wrap break-all pr-16">{cronCommand}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== LICENSE TAB ==================== */}
        <TabsContent value="license" className="mt-6 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">License Activation</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter your license key to activate the full version of SDASMS. Your license key can be found in your purchase confirmation email or on your account dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">License Key</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showLicenseKey ? 'text' : 'password'}
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      placeholder="Enter your license key"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowLicenseKey(!showLicenseKey)}
                    >
                      {showLicenseKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">License Email</Label>
                  <Input
                    type="email"
                    value={licenseEmail}
                    onChange={(e) => setLicenseEmail(e.target.value)}
                    className="mt-1.5"
                    placeholder="Enter your purchase email"
                  />
                </div>
              </div>

              <Separator />

              {/* License Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Product:</span>
                    <span className="ml-2 font-medium text-gray-800">SDASMS - SMS Platform</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Version:</span>
                    <span className="ml-2 font-medium text-gray-800">v3.2.1</span>
                  </div>
                  <div>
                    <span className="text-gray-500">License Type:</span>
                    <span className="ml-2 font-medium text-gray-800">Regular License</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium text-green-700">Active</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Support Expires:</span>
                    <span className="ml-2 font-medium text-gray-800">Dec 15, 2026</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Environment:</span>
                    <span className="ml-2 font-medium text-gray-800">Production</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700">
                Verify License
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Indicator */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Settings saved successfully!
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Save
        </Button>
      </div>
    </div>
  );
}
