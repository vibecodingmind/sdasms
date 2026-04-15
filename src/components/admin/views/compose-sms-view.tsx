'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Send, Plus, X, Loader2, Users, MessageSquare, DollarSign,
  Clock, CalendarDays, CheckCircle2, AlertCircle, RefreshCw, Eye, Trash2,
  FileText, UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Recipient {
  id: string;
  number: string;
}

interface SenderName {
  id: number;
  senderid: string;
  status: string;
}

interface SendResult {
  success: boolean;
  request_id?: number;
  valid?: number;
  invalid?: number;
  invalid_numbers?: string[];
  message?: string;
}

export function ComposeSmsView() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [phoneInput, setPhoneInput] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSenderId, setSelectedSenderId] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [senderNames, setSenderNames] = useState<SenderName[]>([]);
  const [loadingSenders, setLoadingSenders] = useState(false);
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [deliveryReports, setDeliveryReports] = useState<Array<{ dest_addr: string; status: string; request_id: string }>>([]);
  const [loadingDelivery, setLoadingDelivery] = useState(false);

  useEffect(() => {
    fetchSenderNames();
  }, []);

  const fetchSenderNames = async () => {
    setLoadingSenders(true);
    try {
      const res = await fetch('/api/sms/sender-names?status=active');
      const data = await res.json();
      if (data.success && data.data) {
        setSenderNames(data.data);
        if (data.data.length > 0 && !selectedSenderId) {
          setSelectedSenderId(data.data[0].senderid);
        }
      }
    } catch {
      // Use fallback sender names
      setSenderNames([
        { id: 1, senderid: 'SDASMS', status: 'active' },
        { id: 2, senderid: 'ACMECORP', status: 'active' },
      ]);
      if (!selectedSenderId) setSelectedSenderId('SDASMS');
    } finally {
      setLoadingSenders(false);
    }
  };

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
      let scheduleTimeStr: string | undefined;
      if (scheduleEnabled && scheduleDate && scheduleTime) {
        scheduleTimeStr = `${scheduleDate} ${scheduleTime}`;
      }

      const body = {
        message: message.trim(),
        recipients: recipients.map((r, i) => ({
          recipient_id: i + 1,
          dest_addr: r.number,
        })),
        ...(scheduleTimeStr && { schedule_time: scheduleTimeStr }),
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
          request_id: data.request_id,
          valid: data.valid,
          invalid: data.invalid,
          invalid_numbers: data.invalid_numbers,
          message: data.message,
        });
        toast.success(`SMS sent! ${data.valid} messages delivered. Request ID: ${data.request_id}`);
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

  const checkDelivery = async () => {
    if (!sendResult?.request_id || recipients.length === 0) return;
    setLoadingDelivery(true);
    setDeliveryDialogOpen(true);
    try {
      const params = new URLSearchParams({
        request_id: String(sendResult.request_id),
        dest_addr: recipients[0].number,
      });
      const res = await fetch(`/api/sms/delivery-reports?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDeliveryReports(data.data);
      } else {
        setDeliveryReports([]);
      }
    } catch {
      setDeliveryReports([]);
    } finally {
      setLoadingDelivery(false);
    }
  };

  const resetForm = () => {
    setRecipients([]);
    setPhoneInput('');
    setMessage('');
    setSendResult(null);
    setDeliveryReports([]);
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
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-gray-800">SMS Sent Successfully!</p>
                <p className="text-xs text-gray-500">
                  Request ID: <span className="font-mono">{sendResult.request_id}</span> | {sendResult.valid} valid | {sendResult.invalid} invalid
                </p>
                {sendResult.invalid_numbers && sendResult.invalid_numbers.length > 0 && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-md">
                    <p className="font-semibold">Invalid Numbers:</p>
                    <ul className="list-disc ml-4 mt-1">
                      {sendResult.invalid_numbers.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={checkDelivery} className="h-7 text-xs">
                    <RefreshCw className="h-3 w-3 mr-1" /> Check Delivery Status
                  </Button>
                </div>
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
                <Label className="block text-sm font-medium text-gray-700 mb-1.5">Sender ID</Label>
                {loadingSenders ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading sender names...
                  </div>
                ) : (
                  <Select value={selectedSenderId} onValueChange={setSelectedSenderId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sender ID" />
                    </SelectTrigger>
                    <SelectContent>
                      {senderNames.map((sn) => (
                        <SelectItem key={sn.id} value={sn.senderid}>
                          <div className="flex items-center gap-2">
                            <span>{sn.senderid}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                              {sn.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Separator />

              {/* Recipients */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1.5">Recipients</Label>
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
                  <Button variant="outline" type="button" className="text-gray-500">
                    <UserPlus className="h-4 w-4 mr-1" /> Import
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Enter phone number with country code (e.g., +255700000000)</p>

                {/* Recipient chips */}
                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                    {recipients.map((r) => (
                      <Badge
                        key={r.id}
                        variant="secondary"
                        className="pl-2.5 pr-1 py-1 text-xs font-normal gap-1.5 bg-white border border-gray-200 text-gray-700"
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
                <Label className="block text-sm font-medium text-gray-700 mb-1.5">Message</Label>
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
                    {charsRemaining} chars remaining in current SMS
                  </span>
                </div>
              </div>

              <Separator />

              {/* Schedule */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <Label className="text-sm font-medium text-gray-700">Schedule for Later</Label>
                </div>
                <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
              </div>

              {scheduleEnabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">Date</Label>
                    <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">Time (GMT+0)</Label>
                    <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                  </div>
                </div>
              )}

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
              <CardTitle className="text-sm font-semibold text-gray-700">Message Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Recipients</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{recipients.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">Message Length</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{message.length} chars</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">SMS Count</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{smsCount} per recipient</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Total SMS</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{smsCount * recipients.length}</span>
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

          {/* Quick Stats */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Sender Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Sender ID</span>
                <Badge variant="outline" className="text-xs">{selectedSenderId || 'Not selected'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Schedule</span>
                <span className="text-xs text-gray-700">
                  {scheduleEnabled ? (scheduleDate && scheduleTime ? `${scheduleDate} ${scheduleTime}` : 'Not set') : 'Immediate'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Gateway</span>
                <span className="text-xs text-gray-700">Beem Africa</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delivery Report Dialog */}
      <Dialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delivery Reports</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loadingDelivery ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-400">Checking delivery status...</span>
              </div>
            ) : deliveryReports.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No delivery reports available yet.</p>
                <p className="text-xs text-gray-400 mt-1">Reports may take a few minutes to appear after sending.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {deliveryReports.map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{report.dest_addr}</p>
                      <p className="text-xs text-gray-400">Request: {report.request_id}</p>
                    </div>
                    <Badge
                      variant={report.status === 'delivered' ? 'default' : report.status === 'failed' ? 'destructive' : 'secondary'}
                      className={
                        report.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : report.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
