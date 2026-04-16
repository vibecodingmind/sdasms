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
  Hash,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { toast } from 'sonner';

// ── Types ───────────────────────────────────────────────────────────────────

interface SenderId {
  id: number;
  sender_id: string;
  price: string;
  pricePeriod: string;
  status: 'ACTIVE' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

type SortField = 'sender_id' | 'price' | 'status';
type SortDirection = 'asc' | 'desc';

// ── Mock Data ───────────────────────────────────────────────────────────────

const initialSenderIds: SenderId[] = [
  {
    id: 1,
    sender_id: 'ALABASTER',
    price: 'Sh24,900',
    pricePeriod: 'Year',
    status: 'ACTIVE',
    createdAt: '11th Oct 23, 12:40 PM',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  { className: string }
> = {
  ACTIVE: {
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  PENDING: {
    className:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  REJECTED: {
    className:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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

export function SenderIdsView() {
  const [senderIds, setSenderIds] = useState<SenderId[]>(initialSenderIds);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formSenderId, setFormSenderId] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formPeriod, setFormPeriod] = useState('Year');

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
    let data = senderIds.filter(
      (s) =>
        s.sender_id.toLowerCase().includes(search.toLowerCase()) ||
        s.status.toLowerCase().includes(search.toLowerCase())
    );
    if (sortField) {
      data = [...data].sort((a, b) => {
        const cmp =
          a[sortField].localeCompare(b[sortField]);
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return data;
  }, [senderIds, search, sortField, sortDir]);

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
    paged.length > 0 && paged.every((s) => selectedIds.has(s.id));
  const toggleAll = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paged.forEach((s) => next.delete(s.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paged.forEach((s) => next.add(s.id));
        return next;
      });
    }
  };

  // ── CRUD ──
  const openAddDialog = () => {
    setEditingId(null);
    setFormSenderId('');
    setFormPrice('Sh24,900');
    setFormPeriod('Year');
    setDialogOpen(true);
  };

  const openEditDialog = (item: SenderId) => {
    setEditingId(item.id);
    setFormSenderId(item.sender_id);
    setFormPrice(item.price);
    setFormPeriod(item.pricePeriod);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formSenderId.trim()) {
      toast.error('Sender ID is required');
      return;
    }
    if (!/^[A-Za-z0-9]{3,11}$/.test(formSenderId)) {
      toast.error('Sender ID must be 3-11 alphanumeric characters');
      return;
    }
    if (editingId) {
      setSenderIds((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, sender_id: formSenderId.toUpperCase(), price: formPrice, pricePeriod: formPeriod }
            : s
        )
      );
      toast.success('Sender ID updated successfully');
    } else {
      const newId: SenderId = {
        id: Date.now(),
        sender_id: formSenderId.toUpperCase(),
        price: formPrice,
        pricePeriod: formPeriod,
        status: 'PENDING',
        createdAt: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: '2-digit',
        }) + ', ' + new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };
      setSenderIds((prev) => [...prev, newId]);
      toast.success('New Sender ID request submitted for approval');
    }
    setDialogOpen(false);
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      setSenderIds((prev) => prev.filter((s) => s.id !== deletingId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingId);
        return next;
      });
      toast.success('Sender ID deleted successfully');
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  // ── Page numbers ──
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="space-y-4">
      {/* ─── Top action bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div />
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={openAddDialog}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Request for new one
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
                    onClick={() => toggleSort('sender_id')}
                  >
                    Sender ID
                    <SortIcon field="sender_id" sortField={sortField} />
                  </th>
                  <th
                    className="text-left text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort('price')}
                  >
                    Price
                    <SortIcon field="price" sortField={sortField} />
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
                  const cfg = statusConfig[item.status] || statusConfig.PENDING;
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

                      {/* Sender ID */}
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                            {item.sender_id}
                          </span>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Created at: {item.createdAt}
                          </p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item.price}
                          </span>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {item.pricePeriod}
                          </p>
                        </div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Sender ID' : 'Request New Sender ID'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Sender ID <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., MYCOMPANY"
                value={formSenderId}
                onChange={(e) => setFormSenderId(e.target.value.toUpperCase())}
                maxLength={11}
              />
              <p className="text-xs text-gray-400 mt-1">
                3-11 alphanumeric characters. Letters and numbers only.
              </p>
            </div>
            {editingId && (
              <>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Price
                  </Label>
                  <Input
                    placeholder="e.g., Sh24,900"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Billing Period
                  </Label>
                  <Select value={formPeriod} onValueChange={setFormPeriod}>
                    <SelectTrigger>
                      {formPeriod}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Month">Month</SelectItem>
                      <SelectItem value="Quarter">Quarter</SelectItem>
                      <SelectItem value="Year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
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
              {editingId ? 'Update' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sender ID</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this Sender ID? This action cannot
            be undone.
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
    </div>
  );
}
