'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Upload, Users, MoreHorizontal, Phone, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ContactGroup {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface Contact {
  id: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone: string;
  email?: string;
  group_id?: number | null;
  group?: ContactGroup | null;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [saving, setSaving] = useState(false);
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGroupId, setFormGroupId] = useState<string>('');

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterGroup !== 'all') params.set('group_id', filterGroup);
      const res = await fetch(`/api/contacts?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setContacts(json.data || []);
      } else {
        setError('Failed to load contacts');
      }
    } catch {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [search, filterGroup]);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch('/api/contact-groups');
      const json = await res.json();
      if (json.success) {
        setGroups(json.data || []);
      }
    } catch {
      // groups are secondary, don't block
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const getContactName = (c: Contact) => {
    if (c.name) return c.name;
    return [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Unknown';
  };

  const getGroupName = (c: Contact) => {
    if (c.group && typeof c.group === 'object') return c.group.name;
    return 'None';
  };

  const getGroupId = (c: Contact) => {
    if (c.group_id) return String(c.group_id);
    return '';
  };

  const filteredContacts = contacts.filter((c) => {
    const name = getContactName(c).toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || phone.includes(q) || email.includes(q);
  });

  const openAddDialog = () => {
    setEditingContact(null);
    setFormFirstName('');
    setFormLastName('');
    setFormPhone('');
    setFormEmail('');
    setFormGroupId(groups.length > 0 ? String(groups[0].id) : '');
    setDialogOpen(true);
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setFormFirstName(contact.first_name || '');
    setFormLastName(contact.last_name || '');
    setFormPhone(contact.phone || '');
    setFormEmail(contact.email || '');
    setFormGroupId(getGroupId(contact));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formFirstName.trim() || !formPhone.trim()) {
      toast.error('First name and phone are required');
      return;
    }
    try {
      setSaving(true);
      if (editingContact) {
        const res = await fetch(`/api/contacts/${editingContact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formFirstName.trim(),
            last_name: formLastName.trim(),
            phone: formPhone.trim(),
            email: formEmail.trim(),
            group_id: formGroupId ? Number(formGroupId) : null,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success('Contact updated');
          setDialogOpen(false);
          fetchContacts();
        } else {
          toast.error(json.error || 'Failed to update contact');
        }
      } else {
        const res = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formFirstName.trim(),
            last_name: formLastName.trim(),
            phone: formPhone.trim(),
            email: formEmail.trim(),
            group_id: formGroupId ? Number(formGroupId) : null,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success('Contact added');
          setDialogOpen(false);
          fetchContacts();
        } else {
          toast.error(json.error || 'Failed to create contact');
        }
      }
    } catch {
      toast.error(editingContact ? 'Failed to update contact' : 'Failed to create contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success('Contact deleted');
      } else {
        toast.error('Failed to delete contact');
      }
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      }
      setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      toast.success(`${selectedIds.size} contacts deleted`);
      setSelectedIds(new Set());
    } catch {
      toast.error('Failed to delete some contacts');
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

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c.id)));
    }
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
        <Button variant="outline" onClick={fetchContacts}>
          <Users className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete ({selectedIds.size})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" /> Import
          </Button>
          <Button size="sm" className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-1" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Contacts Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 w-10">
                    <Checkbox
                      checked={selectedIds.size === filteredContacts.length && filteredContacts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Name</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Phone</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Email</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Group</th>
                  <th className="text-right text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={() => toggleSelect(contact.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#D72444]/10 flex items-center justify-center text-[#D72444] text-xs font-semibold shrink-0">
                          {getContactName(contact).charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{getContactName(contact)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{contact.email || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{getGroupName(contact)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(contact)}>
                            <Edit2 className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(contact.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No contacts found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name *</Label>
                <Input placeholder="John" value={formFirstName} onChange={(e) => setFormFirstName(e.target.value)} />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</Label>
                <Input placeholder="Doe" value={formLastName} onChange={(e) => setFormLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone *</Label>
              <Input placeholder="+255700000000" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</Label>
              <Input placeholder="john@example.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Group</Label>
              <Select value={formGroupId} onValueChange={setFormGroupId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Group</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              {editingContact ? 'Update' : 'Add'} Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
