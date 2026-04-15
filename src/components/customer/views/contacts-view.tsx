'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Upload, Users, MoreHorizontal, Phone, Mail } from 'lucide-react';
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

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  group: string;
  status: 'active' | 'inactive';
}

const mockContacts: Contact[] = [
  { id: 1, name: 'Alice Johnson', phone: '+1 555-0201', email: 'alice@example.com', group: 'VIP Customers', status: 'active' },
  { id: 2, name: 'Bob Martinez', phone: '+1 555-0301', email: 'bob@example.com', group: 'Newsletter', status: 'active' },
  { id: 3, name: 'Carol White', phone: '+44 7700-0401', email: 'carol@example.com', group: 'VIP Customers', status: 'active' },
  { id: 4, name: 'David Lee', phone: '+86 138-0001', email: 'david@example.com', group: 'Newsletter', status: 'inactive' },
  { id: 5, name: 'Eva Schmidt', phone: '+49 151-0801', email: 'eva@example.com', group: 'Promotions', status: 'active' },
  { id: 6, name: 'Frank Brown', phone: '+1 555-0601', email: 'frank@example.com', group: 'Staff', status: 'active' },
  { id: 7, name: 'Grace Kim', phone: '+82 10-7001', email: 'grace@example.com', group: 'VIP Customers', status: 'active' },
  { id: 8, name: 'Henry Davis', phone: '+1 555-0801', email: 'henry@example.com', group: 'Newsletter', status: 'active' },
];

const groupOptions = ['VIP Customers', 'Newsletter', 'Promotions', 'Staff', 'Partners'];

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGroup, setFormGroup] = useState('Newsletter');

  const filteredContacts = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchGroup = filterGroup === 'all' || c.group === filterGroup;
    return matchSearch && matchGroup;
  });

  const openAddDialog = () => {
    setEditingContact(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormGroup('Newsletter');
    setDialogOpen(true);
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setFormEmail(contact.email);
    setFormGroup(contact.group);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPhone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingContact.id
            ? { ...c, name: formName, phone: formPhone, email: formEmail, group: formGroup }
            : c
        )
      );
      toast.success('Contact updated');
    } else {
      const newContact: Contact = {
        id: Date.now(),
        name: formName,
        phone: formPhone,
        email: formEmail,
        group: formGroup,
        status: 'active',
      };
      setContacts((prev) => [newContact, ...prev]);
      toast.success('Contact added');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success('Contact deleted');
  };

  const handleBulkDelete = () => {
    setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} contacts deleted`);
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
              {groupOptions.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
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
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Status</th>
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
                          {contact.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{contact.group}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge className={`text-[10px] ${contact.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {contact.status}
                      </Badge>
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
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</Label>
              <Input placeholder="John Doe" value={formName} onChange={(e) => setFormName(e.target.value)} />
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
              <Select value={formGroup} onValueChange={setFormGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groupOptions.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handleSave}>
              {editingContact ? 'Update' : 'Add'} Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
