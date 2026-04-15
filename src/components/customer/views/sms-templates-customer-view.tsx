'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FileText, Copy, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SmsTemplate {
  id: number;
  name: string;
  message: string;
  status: 'active' | 'inactive';
  created: string;
}

const mockTemplates: SmsTemplate[] = [
  { id: 1, name: 'Welcome Message', message: 'Welcome {name}! Your account has been created successfully. Login at {url}', status: 'active', created: '2024-06-10' },
  { id: 2, name: 'Order Confirmation', message: 'Hi {name}, your order #{order_id} has been confirmed. Total: {amount}. Track at {tracking_url}', status: 'active', created: '2024-07-15' },
  { id: 3, name: 'Appointment Reminder', message: 'Dear {name}, this is a reminder for your appointment on {date} at {time}. Reply CANCEL to reschedule.', status: 'active', created: '2024-08-20' },
  { id: 4, name: 'Payment Receipt', message: 'Payment of {amount} received for invoice #{invoice_id}. Thank you for your business!', status: 'active', created: '2024-09-05' },
  { id: 5, name: 'Holiday Greeting', message: 'Happy {holiday}, {name}! Enjoy {discount}% off your next purchase. Use code {code}.', status: 'inactive', created: '2024-12-01' },
];

const availableVariables = ['{name}', '{date}', '{time}', '{amount}', '{order_id}', '{invoice_id}', '{url}', '{tracking_url}', '{code}', '{discount}', '{holiday}'];

export function SmsTemplatesCustomerView() {
  const [templates, setTemplates] = useState<SmsTemplate[]>(mockTemplates);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<SmsTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.message.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingTemplate(null);
    setFormName('');
    setFormMessage('');
    setDialogOpen(true);
  };

  const openEditDialog = (template: SmsTemplate) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormMessage(template.message);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formMessage.trim()) {
      toast.error('Name and message are required');
      return;
    }
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, name: formName, message: formMessage }
            : t
        )
      );
      toast.success('Template updated');
    } else {
      const newTemplate: SmsTemplate = {
        id: Date.now(),
        name: formName,
        message: formMessage,
        status: 'active',
        created: new Date().toISOString().split('T')[0],
      };
      setTemplates((prev) => [newTemplate, ...prev]);
      toast.success('Template created');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success('Template deleted');
  };

  const copyToClipboard = (message: string) => {
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard');
  };

  const insertVariable = (variable: string) => {
    setFormMessage((prev) => prev + variable);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-1" /> Create Template
        </Button>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#D72444]/10 text-[#D72444]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{template.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Created {template.created}</p>
                  </div>
                </div>
                <Badge className={`text-[10px] ${template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {template.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                {template.message}
              </p>

              <div className="flex items-center gap-2 mt-4">
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => copyToClipboard(template.message)}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                </Button>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setPreviewTemplate(template); setPreviewOpen(true); }}>
                  <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                </Button>
                <div className="flex-1" />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(template)}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(template.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No templates found</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create Template'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Template Name *</Label>
              <Input placeholder="e.g., Welcome Message" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</Label>
              <Textarea
                placeholder="Type your template message..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                rows={5}
                maxLength={1000}
              />
              <p className="text-xs text-gray-400 mt-1">{formMessage.length} / 1000 characters</p>
            </div>
            <div>
              <Label className="block text-xs font-medium text-gray-500 mb-1.5">Insert Variable</Label>
              <div className="flex flex-wrap gap-1.5">
                {availableVariables.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="px-2 py-1 text-[11px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-[#D72444]/10 hover:text-[#D72444] transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handleSave}>
              {editingTemplate ? 'Update' : 'Create'} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Template Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {previewTemplate?.message.replace(/\{(\w+)\}/g, '[$1]')}
            </p>
          </div>
          <p className="text-xs text-gray-400 text-center">Variables are shown in [brackets] for preview</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
