'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Send, Eye, Sparkles, Info, ChevronDown, Loader2, AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// ==================== TYPES ====================
interface SenderIdOption {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
}

interface SmsTemplate {
  id: string;
  name: string;
  content: string;
}

// ==================== CONSTANTS ====================
const SENDER_IDS: SenderIdOption[] = [
  { id: '1', name: 'ALABASTER', status: 'active' },
  { id: '2', name: 'SDASMS', status: 'active' },
  { id: '3', name: 'ACMECORP', status: 'pending' },
];

const SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: '1',
    name: 'Welcome Message',
    content: 'Welcome {{name}}! Thank you for joining us. We are glad to have you on board.',
  },
  {
    id: '2',
    name: 'Event Reminder',
    content: 'Hi {{name}}, this is a reminder for our upcoming event on {{date}}. See you there!',
  },
  {
    id: '3',
    name: 'Promo Offer',
    content: 'Hi {{name}}, enjoy {{discount}}% off your next purchase! Use code {{code}} at checkout.',
  },
];

const GSM_7BIT_MAX = 160;

// ==================== COMPONENT ====================
export function ComposeSmsCustomerView() {
  // State
  const [selectedSenderId, setSelectedSenderId] = useState('1');
  const [countryCode, setCountryCode] = useState('multiple');
  const [recipientsText, setRecipientsText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [requestNewOpen, setRequestNewOpen] = useState(false);
  const [requestSenderId, setRequestSenderId] = useState('');

  // ==================== DERIVED ====================
  const selectedSender = SENDER_IDS.find((s) => s.id === selectedSenderId);

  // Parse recipients from textarea
  const recipients = useMemo(() => {
    if (!recipientsText.trim()) return [];
    // Split by comma, semicolon, or new line
    const parts = recipientsText
      .split(/[,;\n]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    // Deduplicate
    return [...new Set(parts)];
  }, [recipientsText]);

  const recipientCount = recipients.length;

  // Character counting
  const charCount = message.length;
  const remaining = GSM_7BIT_MAX - (charCount % GSM_7BIT_MAX || GSM_7BIT_MAX);
  const messageCount = Math.ceil(charCount / GSM_7BIT_MAX) || 0;

  // Template application
  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      if (!templateId) return;
      const template = SMS_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setMessage(template.content);
        toast.success(`Template "${template.name}" applied`);
      }
    },
    []
  );

  // Validate form
  const isFormValid = recipientCount > 0 && message.trim().length > 0;

  // ==================== HANDLERS ====================
  const handleSend = async () => {
    if (!isFormValid) {
      if (recipientCount === 0) toast.error('Add at least one recipient');
      else toast.error('Message cannot be empty');
      return;
    }

    setSending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`SMS sent to ${recipientCount} recipient(s)!`);
      // Reset form
      setRecipientsText('');
      setMessage('');
      setSelectedTemplate('');
    } catch {
      toast.error('Failed to send SMS. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handlePreview = () => {
    if (!message.trim()) {
      toast.error('Enter a message to preview');
      return;
    }
    setPreviewOpen(true);
  };

  const handleRequestNewSender = () => {
    if (!requestSenderId.trim()) {
      toast.error('Sender ID is required');
      return;
    }
    toast.success(`Sender ID "${requestSenderId}" submitted for approval`);
    setRequestNewOpen(false);
    setRequestSenderId('');
  };

  const handleFormatSeparator = (sep: string) => {
    if (!recipientsText.trim()) return;
    // Normalize all separators to new lines first
    const normalized = recipientsText.replace(/[,;]+/g, '\n').replace(/\n+/g, '\n');
    const lines = normalized.split('\n').filter((l) => l.trim());
    setRecipientsText(lines.join(sep === 'newline' ? '\n' : sep));
    toast.success('Recipients reformatted');
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          TEMPLATE TAGS DO NOT WORK WITH THE QUICK SEND FEATURE.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* ========== ORIGINATOR SECTION ========== */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Originator</h2>
              <Separator className="flex-1" />
            </div>

            {/* Sender ID */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Sender ID</Label>
                <button
                  className="text-xs font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  onClick={() => setRequestNewOpen(true)}
                >
                  REQUEST NEW
                </button>
              </div>
              <Select value={selectedSenderId} onValueChange={setSelectedSenderId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENDER_IDS.map((sender) => (
                    <SelectItem key={sender.id} value={sender.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            sender.status === 'active'
                              ? 'bg-purple-600'
                              : 'bg-yellow-500'
                          }`}
                        />
                        <span>{sender.name}</span>
                        {sender.status !== 'active' && (
                          <span className="text-xs text-muted-foreground">
                            ({sender.status})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Code */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Country Code</Label>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple">Multiple Self-Input</SelectItem>
                  <SelectItem value="255">+255 (Tanzania)</SelectItem>
                  <SelectItem value="254">+254 (Kenya)</SelectItem>
                  <SelectItem value="256">+256 (Uganda)</SelectItem>
                  <SelectItem value="1">+1 (USA/Canada)</SelectItem>
                  <SelectItem value="44">+44 (UK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ========== RECIPIENTS SECTION ========== */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Recipients</h2>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Recipients:</Label>
              <p className="text-xs text-muted-foreground">
                You can upload a maximum of 100 rows by copy-pasting your recipients in the box below.
                You can also add from a{' '}
                <button
                  className="text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => toast.info('Navigate to Contact Groups to select recipients')}
                >
                  contact group
                </button>
                .
              </p>
            </div>

            <Textarea
              placeholder={"Enter phone numbers here...\n+255700000000\n+255700000001\n+255700000002"}
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              rows={6}
              className="resize-none font-mono text-sm"
            />

            {/* Format buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Format:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                  onClick={() => handleFormatSeparator(',')}
                >
                  , (Comma)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                  onClick={() => handleFormatSeparator(';')}
                >
                  ; (Semicolon)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                  onClick={() => handleFormatSeparator('newline')}
                >
                  New line
                </Button>
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                TOTAL NUMBER OF RECIPIENTS: {recipientCount}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ========== SMS TEMPLATE SECTION ========== */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">SMS Template (Optional)</Label>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                onClick={() => {
                  toast.info('AI generation coming soon!');
                }}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Generate with AI
              </Button>
            </div>
            <Select
              value={selectedTemplate}
              onValueChange={(val) => {
                setSelectedTemplate(val);
                handleTemplateSelect(val);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                {SMS_TEMPLATES.map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* ========== MESSAGE SECTION ========== */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Message <span className="text-red-500">*</span>
              </Label>
            </div>

            <Textarea
              placeholder={"Type your message here...\n\nSupports spintax syntax: {Hello|Hi|Hey} {friend|buddy|mate}!"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              className="resize-none"
              maxLength={1600}
            />

            {/* Character counter bar */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                REMAINING: {remaining} / {GSM_7BIT_MAX} ({charCount} CHARACTERS)
              </span>
              <span className="text-xs text-muted-foreground">
                MESSAGE(S): {messageCount} (ENCODING: GSM_7BIT)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ========== ACTION BUTTONS ========== */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            className="bg-teal-600 text-white border-teal-600 hover:bg-teal-700 hover:text-white"
            onClick={handlePreview}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleSend}
            disabled={sending || !isFormValid}
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ========== PREVIEW DIALOG ========== */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Preview</DialogTitle>
            <DialogDescription>
              Preview of your SMS message
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold">From:</span>
                <span className="font-mono">{selectedSender?.name}</span>
                {selectedSender?.status === 'active' && (
                  <span className="inline-block h-2 w-2 rounded-full bg-purple-600" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold">To:</span>
                <span>{recipientCount} recipient(s)</span>
              </div>
              <Separator />
              <div className="text-sm whitespace-pre-wrap">{message}</div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{charCount} characters</span>
              <span>{messageCount} message(s)</span>
              <span>GSM_7BIT encoding</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => {
                setPreviewOpen(false);
                handleSend();
              }}
              disabled={!isFormValid}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== REQUEST NEW SENDER ID DIALOG ========== */}
      <Dialog open={requestNewOpen} onOpenChange={setRequestNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Sender ID</DialogTitle>
            <DialogDescription>
              Submit a new sender ID for approval. Approval typically takes 1-2 business days.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium mb-1.5">Sender ID *</Label>
              <Input
                placeholder="e.g., MYBRAND"
                value={requestSenderId}
                onChange={(e) => setRequestSenderId(e.target.value.toUpperCase())}
                maxLength={11}
                className="font-mono uppercase"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max 11 characters, alphanumeric only. No spaces or special characters.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestNewOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleRequestNewSender}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
