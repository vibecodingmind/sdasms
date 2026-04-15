'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Plus, X, Loader2, Users, MessageSquare, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Recipient {
  id: string;
  number: string;
}

export function ComposeSmsCustomerView() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [phoneInput, setPhoneInput] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSenderId, setSelectedSenderId] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message?: string; valid?: number } | null>(null);
  const [senderNames] = useState([
    { id: 1, senderid: 'SDASMS', status: 'active' },
    { id: 2, senderid: 'ACMECORP', status: 'active' },
  ]);

  useEffect(() => {
    if (senderNames.length > 0 && !selectedSenderId) {
      setSelectedSenderId(senderNames[0].senderid);
    }
  }, []);

  const addRecipient = useCallback(() => {
    const cleaned = phoneInput.replace(/[\s\-()]/g, '');
    if (!cleaned) return;
    if (!/^\+?[1-9]\d{6,14}$/.test(cleaned)) {
      toast.error('Invalid phone number format');
      return;
    }
    if (recipients.some((r) => r.number === cleaned)) {
      toast.error('Recipient already added');
      return;
    }
    setRecipients((prev) => [...prev, { id: `r-${Date.now()}`, number: cleaned }]);
    setPhoneInput('');
  }, [phoneInput, recipients]);

  const removeRecipient = useCallback((id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRecipient();
    }
  };

  const smsCount = Math.ceil(message.length / 160) || 0;
  const costPerSms = 0.012;
  const totalCost = smsCount * recipients.length * costPerSms;
  const charsRemaining = 160 - (message.length % 160 || 160);

  const handleSend = async () => {
    if (recipients.length === 0) {
      toast.error('Add at least one recipient');
      return;
    }
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const body = {
        message: message.trim(),
        recipients: recipients.map((r, i) => ({
          recipient_id: i + 1,
          dest_addr: r.number,
        })),
        ...(selectedSenderId && { source_addr: selectedSenderId }),
      };

      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setSendResult({
          success: true,
          valid: data.valid,
          message: data.message,
        });
        toast.success(`SMS sent! ${data.valid} messages delivered.`);
      } else {
        setSendResult({
          success: false,
          message: data.error || 'Failed to send SMS',
        });
        toast.error(data.error || 'Failed to send SMS');
      }
    } catch {
      setSendResult({
        success: false,
        message: 'Network error. Please try again.',
      });
      toast.error('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setRecipients([]);
    setPhoneInput('');
    setMessage('');
    setSendResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        {sendResult?.success && (
          <Button variant="outline" onClick={resetForm}>
            <Send className="h-4 w-4 mr-2" /> Compose New
          </Button>
        )}
      </div>

      {sendResult?.success && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">SMS Sent Successfully!</p>
                <p className="text-xs text-gray-500">{sendResult.valid} valid recipients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {sendResult && !sendResult.success && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Failed to Send SMS</p>
                <p className="text-xs text-gray-500">{sendResult.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Compose */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-5">
              {/* Sender ID */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sender ID</Label>
                <div className="flex gap-2 flex-wrap">
                  {senderNames.map((sn) => (
                    <button
                      key={sn.id}
                      onClick={() => setSelectedSenderId(sn.senderid)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSenderId === sn.senderid
                          ? 'bg-[#D72444] text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {sn.senderid}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recipients */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Recipients</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="+255700000000"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    onKeyDown={handlePhoneKeyDown}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={addRecipient} type="button" disabled={!phoneInput.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Enter phone number with country code (e.g., +255700000000)</p>

                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 max-h-32 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {recipients.map((r) => (
                      <Badge
                        key={r.id}
                        variant="secondary"
                        className="pl-2.5 pr-1 py-1 text-xs font-normal gap-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        <span>{r.number}</span>
                        <button
                          type="button"
                          onClick={() => removeRecipient(r.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Message */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</Label>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="resize-none"
                  maxLength={1600}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{message.length} / 1600 characters</span>
                    <span>{smsCount} SMS{smsCount !== 1 ? 's' : ''}</span>
                  </div>
                  <span className={`text-xs ${charsRemaining < 20 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                    {charsRemaining} chars remaining
                  </span>
                </div>
              </div>

              <Separator />

              {/* Send Button */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#D72444] hover:bg-[#C01E3A] text-white"
                  onClick={handleSend}
                  disabled={sending || recipients.length === 0 || !message.trim()}
                >
                  {sending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="h-4 w-4 mr-2" /> Send SMS ({recipients.length})</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Summary */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Message Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Recipients</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{recipients.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">Message Length</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{message.length} chars</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Total SMS</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{smsCount * recipients.length}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Estimated Cost</span>
                </div>
                <span className="text-lg font-bold text-[#D72444]">
                  ${totalCost.toFixed(3)}
                </span>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                ${costPerSms} per SMS | 160 chars per SMS
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
