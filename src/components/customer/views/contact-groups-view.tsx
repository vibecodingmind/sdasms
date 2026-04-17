'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Plus, Search, Download, Copy, Pencil, Trash2, UserPlus,
  ChevronUp, ChevronDown, ArrowUpDown, Trash, FileText, Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// ==================== TYPES ====================
interface ContactGroup {
  id: number;
  name: string;
  description?: string;
  contact_count?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

type SortField = 'id' | 'name' | 'contacts' | 'created_at';
type SortDirection = 'asc' | 'desc';

// ==================== COMPONENT ====================
export function ContactGroupsView() {
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [groupContactsOpen, setGroupContactsOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<ContactGroup | null>(null);
  const [viewingGroup, setViewingGroup] = useState<ContactGroup | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Group contacts for viewing
  const [groupContacts, setGroupContacts] = useState<unknown[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/contact-groups');
      const json = await res.json();
      if (json.success) {
        setGroups(json.data || []);
      } else {
        setError('Failed to load contact groups');
      }
    } catch {
      setError('Failed to load contact groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const fetchGroupContacts = async (groupId: number) => {
    try {
      setContactsLoading(true);
      const res = await fetch(`/api/contacts?group_id=${groupId}`);
      const json = await res.json();
      if (json.success) {
        setGroupContacts(json.data || []);
      }
    } catch {
      setGroupContacts([]);
    } finally {
      setContactsLoading(false);
    }
  };

  // ==================== DERIVED DATA ====================
  const filteredGroups = useMemo(() => {
    let result = [...groups];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) => g.name.toLowerCase().includes(q) || String(g.id).includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'id':
          cmp = a.id - b.id;
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'contacts':
          cmp = (a.contact_count || 0) - (b.contact_count || 0);
          break;
        case 'created_at': {
          const da = a.created_at || '';
          const db = b.created_at || '';
          cmp = da.localeCompare(db);
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [groups, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / entriesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedGroups = useMemo(() => {
    const start = (safeCurrentPage - 1) * entriesPerPage;
    return filteredGroups.slice(start, start + entriesPerPage);
  }, [filteredGroups, safeCurrentPage, entriesPerPage]);

  const startIdx = filteredGroups.length === 0 ? 0 : (safeCurrentPage - 1) * entriesPerPage + 1;
  const endIdx = Math.min(safeCurrentPage * entriesPerPage, filteredGroups.length);

  const allOnPageSelected =
    paginatedGroups.length > 0 &&
    paginatedGroups.every((g) => selectedIds.has(g.id));
  const someSelected =
    paginatedGroups.some((g) => selectedIds.has(g.id)) && !allOnPageSelected;

  // ==================== HANDLERS ====================
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedGroups.forEach((g) => next.delete(g.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedGroups.forEach((g) => next.add(g.id));
        return next;
      });
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAddDialog = () => {
    setFormName('');
    setFormDescription('');
    setAddDialogOpen(true);
  };

  const openEditDialog = (group: ContactGroup) => {
    setEditingGroup(group);
    setFormName(group.name);
    setFormDescription(group.description || '');
    setEditDialogOpen(true);
  };

  const handleAdd = async () => {
    if (!formName.trim()) {
      toast.error('Group name is required');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/contact-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName.trim(), description: formDescription.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Group created successfully');
        setAddDialogOpen(false);
        fetchGroups();
      } else {
        toast.error(json.error || 'Failed to create group');
      }
    } catch {
      toast.error('Failed to create group');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!formName.trim()) {
      toast.error('Group name is required');
      return;
    }
    if (!editingGroup) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/contact-groups/${editingGroup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName.trim(), description: formDescription.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Group updated successfully');
        setEditDialogOpen(false);
        setEditingGroup(null);
        fetchGroups();
      } else {
        toast.error(json.error || 'Failed to update group');
      }
    } catch {
      toast.error('Failed to update group');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (group: ContactGroup) => {
    setDeletingGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingGroup) return;
    try {
      const res = await fetch(`/api/contact-groups/${deletingGroup.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deletingGroup.id);
          return next;
        });
        setDeleteDialogOpen(false);
        setDeletingGroup(null);
        toast.success('Group deleted successfully');
        fetchGroups();
      } else {
        toast.error(json.error || 'Failed to delete group');
      }
    } catch {
      toast.error('Failed to delete group');
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await fetch(`/api/contact-groups/${id}`, { method: 'DELETE' });
      }
      toast.success(`${selectedIds.size} group(s) deleted successfully`);
      setSelectedIds(new Set());
      setBulkDeleteDialogOpen(false);
      fetchGroups();
    } catch {
      toast.error('Failed to delete some groups');
    }
  };

  const handleCopyId = (id: number) => {
    navigator.clipboard.writeText(String(id));
    toast.success('Group ID copied to clipboard');
  };

  const openGroupContacts = (group: ContactGroup) => {
    setViewingGroup(group);
    setGroupContactsOpen(true);
    fetchGroupContacts(group.id);
  };

  const handleExport = () => {
    const csv = [
      'ID,Name,Contacts,Description,Created',
      ...filteredGroups.map((g) =>
        `${g.id},"${g.name}",${g.contact_count || 0},${g.description || ''},${g.created_at || ''}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact-groups.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported as CSV');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#D72444]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-red-500">{error}</p>
        <Button variant="outline" onClick={fetchGroups}>
          <FileText className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:text-white"
                  >
                    Actions
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400"
                    onClick={() => {
                      if (selectedIds.size > 0) setBulkDeleteDialogOpen(true);
                      else toast.error('No groups selected');
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedIds.size})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExport}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add New */}
              <Button
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={openAddDialog}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add New
              </Button>

              {/* Export */}
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950"
                onClick={handleExport}
              >
                <Download className="mr-1 h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <Select
                value={String(entriesPerPage)}
                onValueChange={(v) => {
                  setEntriesPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-8 pl-8 w-48 text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10 px-3">
                    <Checkbox
                      checked={allOnPageSelected}
                      ref={(el) => {
                        if (el) {
                          (el as unknown as HTMLInputElement).indeterminate = someSelected;
                        }
                      }}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="px-3">
                    <button
                      className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort('id')}
                    >
                      ID {sortField === 'id' ? (sortDir === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />) : <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />}
                    </button>
                  </TableHead>
                  <TableHead className="px-3">
                    <button
                      className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort('name')}
                    >
                      Name {sortField === 'name' ? (sortDir === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />) : <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />}
                    </button>
                  </TableHead>
                  <TableHead className="px-3">
                    <button
                      className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort('contacts')}
                    >
                      Contacts {sortField === 'contacts' ? (sortDir === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />) : <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />}
                    </button>
                  </TableHead>
                  <TableHead className="px-3">
                    <button
                      className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort('created_at')}
                    >
                      Created At {sortField === 'created_at' ? (sortDir === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />) : <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />}
                    </button>
                  </TableHead>
                  <TableHead className="px-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No contact groups found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGroups.map((group) => (
                    <TableRow key={group.id} data-state={selectedIds.has(group.id) ? 'selected' : undefined}>
                      <TableCell className="px-3">
                        <Checkbox
                          checked={selectedIds.has(group.id)}
                          onCheckedChange={() => toggleSelect(group.id)}
                          aria-label={`Select ${group.name}`}
                        />
                      </TableCell>
                      <TableCell className="px-3">
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          {group.id}
                        </code>
                      </TableCell>
                      <TableCell className="px-3">
                        <button
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => openGroupContacts(group)}
                        >
                          {group.name}
                        </button>
                      </TableCell>
                      <TableCell className="px-3 text-sm font-medium">
                        {(group.contact_count || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-3 text-sm text-muted-foreground">
                        {group.created_at ? new Date(group.created_at).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                            onClick={() => handleCopyId(group.id)}
                            title="Copy ID"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                            onClick={() => openGroupContacts(group)}
                            title="View Contacts"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                            onClick={() => openEditDialog(group)}
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => openDeleteDialog(group)}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              Showing {startIdx} to {endIdx} of {filteredGroups.length} entries
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronDown className="h-3 w-3 rotate-90" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`h-7 w-7 rounded-full text-xs font-medium transition-colors ${
                    page === safeCurrentPage
                      ? 'bg-purple-600 text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronDown className="h-3 w-3 -rotate-90" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium mb-1.5">Group Name *</Label>
              <Input
                placeholder="Enter group name..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1.5">Description</Label>
              <Textarea
                placeholder="Enter group description (optional)..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={handleAdd}
              disabled={saving}
            >
              {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium mb-1.5">Group Name *</Label>
              <Input
                placeholder="Enter group name..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1.5">Description</Label>
              <Textarea
                placeholder="Enter group description (optional)..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
            {editingGroup && (
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Contacts: <strong className="text-foreground">{editingGroup.contact_count || 0}</strong></span>
                <span>Created: <strong className="text-foreground">{editingGroup.created_at ? new Date(editingGroup.created_at).toLocaleDateString() : '—'}</strong></span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); setEditingGroup(null); }}>
              Cancel
            </Button>
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Update Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingGroup?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Groups</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected group(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBulkDelete}
            >
              Delete {selectedIds.size} Group(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Group Contacts Dialog */}
      <Dialog open={groupContactsOpen} onOpenChange={setGroupContactsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contacts in: {viewingGroup?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {contactsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#D72444]" />
              </div>
            ) : groupContacts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No contacts in this group</p>
            ) : (
              <div className="space-y-2">
                {groupContacts.map((c: unknown) => {
                  const contact = c as Record<string, unknown>;
                  const name = [
                    contact.first_name,
                    contact.last_name,
                  ].filter(Boolean).join(' ') || contact.name || 'Unknown';
                  return (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{name}</p>
                        <p className="text-xs text-gray-500">{contact.phone || contact.email || ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
