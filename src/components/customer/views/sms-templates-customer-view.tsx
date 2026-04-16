'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ArrowUpDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  MoreVertical,
  Eye,
  Copy,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// ── Types ───────────────────────────────────────────────────────────────────

interface SmsTemplate {
  id: number;
  name: string;
  message: string;
  status: 'ACTIVE' | 'INACTIVE';
}

type SortField = 'name' | 'message' | 'status';
type SortDirection = 'asc' | 'desc';

// ── Mock Data ───────────────────────────────────────────────────────────────

const initialTemplates: SmsTemplate[] = [];

// ── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { className: string }> = {
  ACTIVE: {
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  INACTIVE: {
    className:
      'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  },
};

// ── SortIcon (declared outside render) ───────────────────────────────────────

function SortIcon({ field, sortField }: { field: SortField; sortField: SortField | null }) {
  return (
    <ArrowUpDown
      className={`ml-1 h-3.5 w-3.5 inline ${
        sortField === field
          ? 'text-[#D72444]'
          : 'text-gray-400 dark:text-gray-500'
      }`}
    />
  );
}

// ── Component ───────────────────────────────────────────────────────────────

export function SmsTemplatesCustomerView() {
  const [templates, setTemplates] = useState<SmsTemplate[]>(initialTemplates);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<SmsTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<string>('ACTIVE');

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Sorting
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  // Pagination
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filtered & sorted data ──
  const filtered = useMemo(() => {
    let data = templates.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.message.toLowerCase().includes(search.toLowerCase())
    );
    if (sortField) {
      data = [...data].sort((a, b) => {
        const cmp = a[sortField].localeCompare(b[sortField]);
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return data;
  }, [templates, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * entriesPerPage,
    safePage * entriesPerPage
  );
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * entriesPerPage + 1;
  const rangeEnd = Math.min(safePage * entriesPerPage, filtered.length);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // ── Select all / individual ──
  const allOnPageSelected =
    paged.length > 0 && paged.every((t) => selectedIds.has(t.id));
  const toggleAll = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paged.forEach((t) => next.delete(t.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paged.forEach((t) => next.add(t.id));
        return next;
      });
    }
  };

  // ── CRUD ──
  const openAddDialog = () => {
    setEditingId(null);
    setFormName('');
    setFormMessage('');
    setFormStatus('ACTIVE');
    setDialogOpen(true);
  };

  const openEditDialog = (item: SmsTemplate) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormMessage(item.message);
    setFormStatus(item.status);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Template name is required');
      return;
    }
    if (!formMessage.trim()) {
      toast.error('Template message is required');
      return;
    }
    if (editingId) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, name: formName, message: formMessage, status: formStatus as SmsTemplate['status'] }
            : t
        )
      );
      toast.success('Template updated successfully');
    } else {
      const newTemplate: SmsTemplate = {
        id: Date.now(),
        name: formName,
        message: formMessage,
        status: formStatus as SmsTemplate['status'],
      };
      setTemplates((prev) => [...prev, newTemplate]);
      toast.success('Template created successfully');
    }
    setDialogOpen(false);
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      setTemplates((prev) => prev.filter((t) => t.id !== deletingId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingId);
        return next;
      });
      toast.success('Template deleted successfully');
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) {
      toast.error('No templates selected');
      return;
    }
    setTemplates((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    toast.success(`${selectedIds.size} template(s) deleted successfully`);
    setSelectedIds(new Set());
  };

  const copyToClipboard = (message: string) => {
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard');
  };

  const openPreview = (item: SmsTemplate) => {
    setPreviewTemplate(item);
    setPreviewDialogOpen(true);
  };

  // ── Page numbers ──
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="space-y-4">
      {/* ─── Top action bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedIds.size})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={openAddDialog}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add New
        </Button>
      </div>

      {/* ─── Table card ─── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Show
              </span>
              <Select
                value={String(entriesPerPage)}
                onValueChange={(v) => {
                  setEntriesPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8 text-xs">
                  {entriesPerPage}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                entries
              </span>
            </div>
            <div className="relative w-full sm:w-auto sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="w-10 px-4 py-3">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={toggleAll}
                      className="rounded border-gray-300 text-[#D72444] focus:ring-[#D72444]"
                    />
                  </th>
                  <th
                    className="text-left text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort('name')}
                  >
                    Name
                    <SortIcon field="name" sortField={sortField} />
                  </th>
                  <th
                    className="text-left text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort('message')}
                  >
                    Message
                    <SortIcon field="message" sortField={sortField} />
                  </th>
                  <th
                    className="text-left text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort('status')}
                  >
                    Status
                    <SortIcon field="status" sortField={sortField} />
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-sm text-gray-400 dark:text-gray-500"
                    >
                      No results available
                    </td>
                  </tr>
                )}
                {paged.map((item) => {
                  const cfg = statusConfig[item.status] || statusConfig.INACTIVE;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Checkbox */}
                      <td className="w-10 px-4 py-3">
                        <Checkbox
                          checked={selectedIds.has(item.id)}
                          onCheckedChange={(checked) => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (checked) next.add(item.id);
                              else next.delete(item.id);
                              return next;
                            });
                          }}
                          className="rounded border-gray-300 text-[#D72444] focus:ring-[#D72444]"
                        />
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Message */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">
                          {item.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${cfg.className}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-[#D72444] hover:bg-[#D72444]/10"
                            onClick={() => openPreview(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-[#D72444] hover:bg-[#D72444]/10"
                            onClick={() => copyToClipboard(item.message)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-[#D72444] hover:bg-[#D72444]/10"
                            onClick={() => openEditDialog(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => confirmDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {rangeStart} to {rangeEnd} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {pageNumbers.map((num) => (
                <Button
                  key={num}
                  variant={num === safePage ? 'default' : 'outline'}
                  size="icon"
                  className={`h-8 w-8 text-xs ${
                    num === safePage
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : ''
                  }`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Add / Edit Dialog ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Template Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Welcome Message"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Type your template message..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                rows={5}
                maxLength={1000}
                className="resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formMessage.length} / 1000 characters
              </p>
            </div>
            {editingId && (
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Status
                </Label>
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger>
                    {formStatus}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSave}
            >
              {editingId ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this template? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Preview Dialog ─── */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {previewTemplate?.message.replace(/\{(\w+)\}/g, '[$1]')}
            </p>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Variables are shown in [brackets] for preview
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
