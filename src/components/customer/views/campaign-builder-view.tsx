'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Send, Eye, Sparkles, Info, ChevronDown, Calendar, Clock, Plus, X, Loader2,
  Zap, Timer, MessageSquare,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// ==================== TYPES ====================
interface SenderIdOption {
  id: string;
  name: string;
  status: string;
}

interface ContactGroup {
  id: string;
  name: string;
  contacts: number;
}

interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  tags: string[];
}

interface ScheduleConfig {
  enabled: boolean;
  date: string;
  time: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
}

interface AdvancedConfig {
  enabled: boolean;
  deliverySpeed: number;
  expireTime: number;
  flashSms: boolean;
}

interface CampaignFormData {
  reference: string;
  senderId: string;
  contactGroups: string[];
  templateId: string;
  selectedTag: string;
  message: string;
  schedule: ScheduleConfig;
  advanced: AdvancedConfig;
}

const GSM_7BIT_MAX = 160;

// ==================== HELPERS ====================
function formatDateTimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
}

// ==================== COMPONENT ====================
export function CampaignBuilderView() {
  // ==================== STATE ====================
  const [formData, setFormData] = useState<CampaignFormData>({
    reference: '',
    senderId: '',
    contactGroups: [],
    templateId: '',
    selectedTag: '',
    message: '',
    schedule: { enabled: false, date: '', time: '', frequency: 'once' },
    advanced: { enabled: false, deliverySpeed: 1, expireTime: 72, flashSms: false },
  });

  const [sending, setSending] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [requestNewOpen, setRequestNewOpen] = useState(false);
  const [requestSenderId, setRequestSenderId] = useState('');
  const [requestingSender, setRequestingSender] = useState(false);
  const [groupsDropdownOpen, setGroupsDropdownOpen] = useState(false);
  const [groupsSearch, setGroupsSearch] = useState('');
  const groupsDropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic data
  const [senderIds, setSenderIds] = useState<SenderIdOption[]>([]);
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // ==================== Fetch data on mount ====================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingData(true);
        const [senderRes, groupsRes, templateRes] = await Promise.all([
          fetch('/api/sender-ids'),
          fetch('/api/contact-groups'),
          fetch('/api/user/sms-templates'),
        ]);

        if (senderRes.ok) {
          const senderJson = await senderRes.json();
          if (senderJson.success && senderJson.data) {
            const sids = senderJson.data
              .filter((s: any) => s.status === 'active' || s.status === 'pending')
              .map((s: any) => ({ id: String(s.id), name: s.sender_id, status: s.status }));
            setSenderIds(sids);
            if (sids.length > 0) setFormData((prev) => ({ ...prev, senderId: sids[0].id }));
          }
        }

        if (groupsRes.ok) {
          const groupsJson = await groupsRes.json();
          if (groupsJson.success && groupsJson.data) {
            setContactGroups(groupsJson.data.map((g: any) => ({ id: String(g.id), name: g.name, contacts: g.contact_count || 0 })));
          }
        }

        if (templateRes.ok) {
          const templateJson = await templateRes.json();
          if (templateJson.success && templateJson.data) {
            setTemplates(templateJson.data.map((t: any) => ({
              id: String(t.id),
              name: t.title,
              content: t.message,
              tags: [],
            })));
          }
        }
      } catch {
        toast.error('Failed to load campaign data');
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  // ==================== DERIVED ====================
  const selectedSender = senderIds.find((s) => s.id === formData.senderId);
  const selectedTemplate = templates.find((t) => t.id === formData.templateId);
  const selectedGroups = contactGroups.filter((g) => formData.contactGroups.includes(g.id));
  const totalRecipients = selectedGroups.reduce((sum, g) => sum + g.contacts, 0);
  const availableTags = selectedTemplate?.tags || [];

  const filteredGroups = useMemo(() => {
    if (!groupsSearch.trim()) return contactGroups.filter((g) => !formData.contactGroups.includes(g.id));
    const q = groupsSearch.toLowerCase();
    return contactGroups.filter((g) => !formData.contactGroups.includes(g.id) && g.name.toLowerCase().includes(q));
  }, [groupsSearch, formData.contactGroups, contactGroups]);

  const charCount = formData.message.length;
  const messageParts = charCount === 0 ? 0 : Math.ceil(charCount / GSM_7BIT_MAX);
  const remaining = charCount === 0 ? GSM_7BIT_MAX : GSM_7BIT_MAX - ((charCount - 1) % GSM_7BIT_MAX + 1);

  const isFormValid = useMemo(() => {
    if (!formData.reference.trim()) return false;
    if (formData.contactGroups.length === 0) return false;
    if (!formData.message.trim()) return false;
    return true;
  }, [formData]);

  // ==================== HANDLERS ====================
  const updateField = useCallback(<K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateSchedule = useCallback(<K extends keyof ScheduleConfig>(key: K, value: ScheduleConfig[K]) => {
    setFormData((prev) => ({ ...prev, schedule: { ...prev.schedule, [key]: value } }));
  }, []);

  const updateAdvanced = useCallback(<K extends keyof AdvancedConfig>(key: K, value: AdvancedConfig[K]) => {
    setFormData((prev) => ({ ...prev, advanced: { ...prev.advanced, [key]: value } }));
  }, []);

  const handleToggleGroup = useCallback((groupId: string) => {
    setFormData((prev) => {
      const exists = prev.contactGroups.includes(groupId);
      return { ...prev, contactGroups: exists ? prev.contactGroups.filter((id) => id !== groupId) : [...prev.contactGroups, groupId] };
    });
  }, []);

  const handleRemoveGroup = useCallback((groupId: string) => {
    setFormData((prev) => ({ ...prev, contactGroups: prev.contactGroups.filter((id) => id !== groupId) }));
  }, []);

  const handleTemplateSelect = useCallback((templateId: string) => {
    if (!templateId) { updateField('templateId', ''); updateField('selectedTag', ''); return; }
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      updateField('templateId', templateId);
      updateField('message', template.content);
      updateField('selectedTag', '');
      toast.success(`Template "${template.name}" applied`);
    }
  }, [updateField, templates]);

  const handleInsertTag = useCallback((tag: string) => {
    if (!tag) return;
    const textarea = document.querySelector('textarea[data-message-area]') as HTMLTextAreaElement | null;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = formData.message.substring(0, start) + tag + formData.message.substring(end);
      updateField('message', newMessage);
      setTimeout(() => { textarea.focus(); const newPos = start + tag.length; textarea.setSelectionRange(newPos, newPos); }, 0);
    } else {
      updateField('message', formData.message + tag);
    }
    toast.success(`Tag ${tag} inserted`);
  }, [formData.message, updateField]);

  const handlePreview = () => {
    if (!formData.message.trim()) { toast.error('Enter a message to preview'); return; }
    setPreviewOpen(true);
  };

  const handleSend = async () => {
    if (!isFormValid) {
      if (!formData.reference.trim()) toast.error('Reference is required');
      else if (formData.contactGroups.length === 0) toast.error('Select at least one contact group');
      else toast.error('Message cannot be empty');
      return;
    }

    setSending(true);
    try {
      const scheduleTime = formData.schedule.enabled && formData.schedule.date && formData.schedule.time
        ? new Date(`${formData.schedule.date}T${formData.schedule.time}`).toISOString()
        : undefined;

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.reference,
          type: 'sms',
          message: formData.message,
          contact_ids: formData.contactGroups,
          schedule_time: scheduleTime,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Campaign "${formData.reference}" created with ${totalRecipients} contacts across ${selectedGroups.length} group(s)!`);
      } else {
        toast.error(json.message || 'Failed to create campaign');
      }
    } catch {
      toast.error('Failed to send campaign. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleRequestNewSender = async () => {
    if (!requestSenderId.trim()) { toast.error('Sender ID is required'); return; }
    if (!/^[A-Za-z0-9]{3,11}$/.test(requestSenderId)) { toast.error('Sender ID must be 3-11 alphanumeric characters'); return; }

    setRequestingSender(true);
    try {
      const res = await fetch('/api/sender-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: requestSenderId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Sender ID "${requestSenderId}" submitted for approval`);
        setRequestNewOpen(false);
        setRequestSenderId('');
        // Refresh
        const senderRes = await fetch('/api/sender-ids');
        if (senderRes.ok) {
          const senderJson = await senderRes.json();
          if (senderJson.success && senderJson.data) {
            const sids = senderJson.data
              .filter((s: any) => s.status === 'active' || s.status === 'pending')
              .map((s: any) => ({ id: String(s.id), name: s.sender_id, status: s.status }));
            setSenderIds(sids);
          }
        }
      } else {
        toast.error(json.message || 'Failed to submit sender ID');
      }
    } catch {
      toast.error('Failed to submit sender ID');
    } finally {
      setRequestingSender(false);
    }
  };

  const handleGenerateAI = () => { toast.info('AI generation coming soon!'); };

  // Close groups dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (groupsDropdownRef.current && !groupsDropdownRef.current.contains(e.target as Node)) {
        setGroupsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const frequencyLabels: Record<string, string> = { once: 'Once', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

  // ==================== LOADING STATE ====================
  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#D72444]" />
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <p className="font-semibold">Create a new SMS campaign</p>
          <p className="text-xs opacity-80">Fill in the form below to configure and launch your campaign. Fields marked with <span className="text-red-500">*</span> are required.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 1. REFERENCE SECTION */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Reference (for tracking) <span className="text-red-500">*</span></Label>
              <p className="text-xs text-muted-foreground">A unique name to help you identify this campaign later.</p>
              <Input placeholder="e.g. Invitation, Information, Promo, Alert, etc" value={formData.reference} onChange={(e) => updateField('reference', e.target.value)} maxLength={100} />
            </div>
          </CardContent>
        </Card>

        {/* 2. ORIGINATOR SECTION */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Originator</h2>
              <Separator className="flex-1" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Sender ID</Label>
                <button className="text-xs font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300" onClick={() => setRequestNewOpen(true)}>REQUEST NEW</button>
              </div>
              <Select value={formData.senderId} onValueChange={(val) => updateField('senderId', val)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select sender ID" /></SelectTrigger>
                <SelectContent>
                  {senderIds.length === 0 ? (
                    <SelectItem value="none" disabled>No sender IDs available</SelectItem>
                  ) : (
                    senderIds.map((sender) => (
                      <SelectItem key={sender.id} value={sender.id}>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${sender.status === 'active' ? 'bg-purple-600 dark:bg-purple-400' : 'bg-yellow-500'}`} />
                          <span>{sender.name}</span>
                          {sender.status !== 'active' && <span className="text-xs text-muted-foreground">({sender.status})</span>}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 3. CONTACT GROUPS SECTION */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Contact Groups <span className="text-red-500">*</span></Label>
              <p className="text-xs text-muted-foreground">Select one or more groups to send this campaign to.</p>
            </div>

            {selectedGroups.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedGroups.map((group) => (
                  <Badge key={group.id} variant="secondary" className="pl-3 pr-1.5 py-1.5 gap-1.5 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-950/60">
                    <span className="text-xs font-medium">{group.name}</span>
                    <span className="text-xs text-purple-500 dark:text-purple-400">({group.contacts})</span>
                    <button onClick={() => handleRemoveGroup(group.id)} className="ml-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors" aria-label={`Remove ${group.name}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="relative" ref={groupsDropdownRef}>
              <button
                type="button"
                onClick={() => setGroupsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-between w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className={formData.contactGroups.length === 0 ? 'text-muted-foreground' : 'text-foreground'}>
                  {formData.contactGroups.length === 0 ? 'Select contact groups...' : `${formData.contactGroups.length} group(s) selected — ${totalRecipients} contacts total`}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${groupsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {groupsDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-lg max-h-64 overflow-hidden">
                  <div className="p-2 border-b border-border">
                    <Input placeholder="Search groups..." value={groupsSearch} onChange={(e) => setGroupsSearch(e.target.value)} className="h-8 text-sm" autoFocus />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredGroups.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">No groups available</div>
                    ) : (
                      filteredGroups.map((group) => (
                        <button key={group.id} type="button" onClick={() => { handleToggleGroup(group.id); setGroupsSearch(''); }} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left hover:bg-accent transition-colors">
                          <div className="flex items-center justify-center h-5 w-5 rounded border border-input bg-background shrink-0"><Plus className="h-3 w-3 text-muted-foreground" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{group.name}</p>
                            <p className="text-xs text-muted-foreground">{group.contacts} contacts</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedGroups.length > 0 && (
              <p className="text-xs font-semibold text-muted-foreground">Total recipients across selected groups: <span className="text-foreground">{totalRecipients}</span></p>
            )}
          </CardContent>
        </Card>

        {/* 4. SMS TEMPLATE SECTION */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">SMS Template</h2>
                <Separator className="flex-1" />
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950" onClick={handleGenerateAI}>
                <Sparkles className="mr-1 h-3 w-3" />Generate with AI
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">SMS Template</Label>
                <Select value={formData.templateId} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select one" /></SelectTrigger>
                  <SelectContent>
                    {templates.length === 0 ? (
                      <SelectItem value="none" disabled>No templates available</SelectItem>
                    ) : (
                      templates.map((tpl) => (<SelectItem key={tpl.id} value={tpl.id}>{tpl.name}</SelectItem>))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Available Tag</Label>
                <Select value={formData.selectedTag} onValueChange={(val) => { updateField('selectedTag', val); handleInsertTag(val); }} disabled={availableTags.length === 0}>
                  <SelectTrigger className="w-full"><SelectValue placeholder={availableTags.length === 0 ? 'No tags available' : 'Select a tag to insert'} /></SelectTrigger>
                  <SelectContent>
                    {availableTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        <div className="flex items-center gap-2"><Zap className="h-3 w-3 text-amber-500" /><span className="font-mono">{tag}</span></div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. MESSAGE SECTION */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Message <span className="text-red-500">*</span></Label>
              <p className="text-xs text-muted-foreground">Supports spintax randomization syntax: {'{Hello|Hi|Hey}'} will randomly pick one word.</p>
            </div>
            <Textarea data-message-area placeholder={"Type your message here...\n\nSupports spintax syntax: {Hello|Hi|Hey} {friend|buddy|mate}!"} value={formData.message} onChange={(e) => updateField('message', e.target.value)} rows={8} className="resize-none" maxLength={1600} />
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">REMAINING: {remaining} / {GSM_7BIT_MAX} ({charCount} CHARACTERS)</span>
              <span className="text-xs text-muted-foreground">MESSAGE(S): {messageParts} (ENCODING: GSM_7BIT)</span>
            </div>
          </CardContent>
        </Card>

        {/* 6. SCHEDULE SECTION */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Schedule</h2>
              <Separator className="flex-1" />
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="schedule-campaign" checked={formData.schedule.enabled} onCheckedChange={(checked) => updateSchedule('enabled', !!checked)} className="mt-0.5" />
              <div className="space-y-0.5">
                <Label htmlFor="schedule-campaign" className="text-sm font-medium cursor-pointer">Schedule campaign ?</Label>
                <p className="text-xs text-blue-600 dark:text-blue-400">Set a specific date, time, and frequency for your campaign</p>
              </div>
            </div>
            {formData.schedule.enabled && (
              <div className="grid gap-4 sm:grid-cols-3 pt-3 border-t">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Date</Label>
                  <Input type="date" value={formData.schedule.date} onChange={(e) => updateSchedule('date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Time</Label>
                  <Input type="time" value={formData.schedule.time} onChange={(e) => updateSchedule('time', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Timer className="h-3.5 w-3.5" />Frequency</Label>
                  <Select value={formData.schedule.frequency} onValueChange={(val) => updateSchedule('frequency', val as ScheduleConfig['frequency'])}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 7. ADVANCED SECTION */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Options</h2>
              <Separator className="flex-1" />
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="advanced-options" checked={formData.advanced.enabled} onCheckedChange={(checked) => updateAdvanced('enabled', !!checked)} className="mt-0.5" />
              <Label htmlFor="advanced-options" className="text-sm font-medium cursor-pointer">Advanced</Label>
            </div>
            {formData.advanced.enabled && (
              <div className="grid gap-4 sm:grid-cols-3 pt-3 border-t">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" />Delivery Speed</Label>
                  <Select value={String(formData.advanced.deliverySpeed)} onValueChange={(val) => updateAdvanced('deliverySpeed', parseInt(val, 10))}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 message/sec (Normal)</SelectItem><SelectItem value="10">10 messages/sec (Fast)</SelectItem><SelectItem value="50">50 messages/sec (Burst)</SelectItem><SelectItem value="100">100 messages/sec (Max)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Expire Time (hours)</Label>
                  <Select value={String(formData.advanced.expireTime)} onValueChange={(val) => updateAdvanced('expireTime', parseInt(val, 10))}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem><SelectItem value="24">24 hours</SelectItem><SelectItem value="48">48 hours</SelectItem><SelectItem value="72">72 hours (Default)</SelectItem><SelectItem value="168">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Flash SMS</Label>
                  <div className="flex items-center gap-3 h-10 rounded-md border border-input bg-background px-3">
                    <Checkbox id="flash-sms" checked={formData.advanced.flashSms} onCheckedChange={(checked) => updateAdvanced('flashSms', !!checked)} />
                    <Label htmlFor="flash-sms" className="text-sm cursor-pointer">Enable flash SMS</Label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" className="bg-teal-600 text-white border-teal-600 hover:bg-teal-700 hover:text-white" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />Preview
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={handleSend} disabled={sending || !isFormValid}>
            {sending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : (<><Send className="mr-2 h-4 w-4" />Send</>)}
          </Button>
        </div>
      </div>

      {/* PREVIEW DIALOG */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Preview</DialogTitle>
            <DialogDescription>Review your campaign details before sending</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reference</span>
              <p className="text-sm font-medium text-foreground">{formData.reference || '—'}</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-medium">{selectedSender?.name || 'Not selected'}</span>
                  {selectedSender?.status === 'active' && <span className="inline-block h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400" />}
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recipients — {selectedGroups.length} group(s), {totalRecipients} contacts</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedGroups.map((group) => (<Badge key={group.id} variant="secondary" className="text-xs">{group.name} ({group.contacts})</Badge>))}
              </div>
            </div>
            <Separator />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Schedule</span>
              <p className="text-sm text-foreground">{formData.schedule.enabled ? `${formData.schedule.date || 'Not set'} at ${formData.schedule.time || 'Not set'} — ${frequencyLabels[formData.schedule.frequency]}` : 'Immediate (not scheduled)'}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</span>
              <div className="rounded-lg border bg-muted/50 p-4"><p className="text-sm whitespace-pre-wrap">{formData.message}</p></div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{charCount} characters</span><span>{messageParts} message(s)</span><span>GSM_7BIT encoding</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => { setPreviewOpen(false); handleSend(); }} disabled={!isFormValid}>
              <Send className="mr-2 h-4 w-4" />Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REQUEST NEW SENDER ID DIALOG */}
      <Dialog open={requestNewOpen} onOpenChange={setRequestNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Sender ID</DialogTitle>
            <DialogDescription>Submit a new sender ID for approval. Approval typically takes 1-2 business days.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium mb-1.5">Sender ID *</Label>
              <Input placeholder="e.g., MYBRAND" value={requestSenderId} onChange={(e) => setRequestSenderId(e.target.value.toUpperCase())} maxLength={11} className="font-mono uppercase" />
              <p className="text-xs text-muted-foreground mt-1">Max 11 characters, alphanumeric only. No spaces or special characters.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestNewOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleRequestNewSender} disabled={requestingSender}>
              {requestingSender && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
