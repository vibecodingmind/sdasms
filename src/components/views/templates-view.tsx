'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, FileText, Copy, Edit, Trash2, Hash } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  message: string;
  status: string;
  dltTemplateId?: string;
  createdAt: string;
}

export function TemplatesView() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', message: '', dltTemplateId: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/templates').then(r => r.ok && r.json()).then(setTemplates).catch(() => {});
  }, []);

  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.message.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ name: '', message: '', dltTemplateId: '' });
        const data = await fetch('/api/templates').then(r => r.json());
        setTemplates(data);
      }
    } catch {}
    setSubmitting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Message Templates</h2>
          <p className="text-sm text-slate-500">Create reusable templates with DLT compliance for Indian SMS delivery</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />New Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
              <DialogDescription>Use {{variable}} placeholders for dynamic content</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Template Name</Label><Input placeholder="e.g., OTP Verification" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Message Content</Label><Textarea placeholder="Your OTP for {{service}} is {{otp}}..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /><p className="text-xs text-slate-400">{form.message.length} characters</p></div>
              <div className="space-y-2"><Label>DLT Template ID</Label><Input placeholder="e.g., 1107163284567890123" value={form.dltTemplateId} onChange={(e) => setForm({ ...form, dltTemplateId: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting || !form.name || !form.message} className="bg-blue-600 hover:bg-blue-700">{submitting ? 'Creating...' : 'Create Template'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((template) => (
          <Card key={template.id} className="border-slate-200 hover:shadow-md transition-shadow group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{template.name}</h3>
                    <Badge variant="secondary" className={`text-xs mt-0.5 ${template.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {template.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(template.message)} title="Copy"><Copy className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-600 whitespace-pre-wrap line-clamp-3">{template.message}</p>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                {template.dltTemplateId && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono">{template.dltTemplateId}</span>
                  </div>
                )}
                <span className="text-xs text-slate-400 ml-auto">{new Date(template.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No templates found. Create your first message template.</p>
          </div>
        )}
      </div>
    </div>
  );
}
