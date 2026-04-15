'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, FolderOpen } from 'lucide-react';
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

interface ContactGroup {
  id: number;
  name: string;
  contacts: number;
  created: string;
  description: string;
}

const mockGroups: ContactGroup[] = [
  { id: 1, name: 'VIP Customers', contacts: 450, created: '2024-01-15', description: 'High-value customer contacts' },
  { id: 2, name: 'Newsletter', contacts: 1200, created: '2024-02-20', description: 'Newsletter subscribers' },
  { id: 3, name: 'Promotions', contacts: 800, created: '2024-03-10', description: 'Promotional campaign recipients' },
  { id: 4, name: 'Staff', contacts: 45, created: '2024-04-18', description: 'Internal staff members' },
  { id: 5, name: 'Partners', contacts: 120, created: '2024-05-22', description: 'Business partners' },
];

export function ContactGroupsView() {
  const [groups, setGroups] = useState<ContactGroup[]>(mockGroups);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingGroup(null);
    setFormName('');
    setFormDescription('');
    setDialogOpen(true);
  };

  const openEditDialog = (group: ContactGroup) => {
    setEditingGroup(group);
    setFormName(group.name);
    setFormDescription(group.description);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Group name is required');
      return;
    }
    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name: formName, description: formDescription }
            : g
        )
      );
      toast.success('Group updated');
    } else {
      const newGroup: ContactGroup = {
        id: Date.now(),
        name: formName,
        contacts: 0,
        created: new Date().toISOString().split('T')[0],
        description: formDescription,
      };
      setGroups((prev) => [newGroup, ...prev]);
      toast.success('Group created');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    toast.success('Group deleted');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-1" /> Create Group
        </Button>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#D72444]/10 text-[#D72444]">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{group.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Created {group.created}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(group)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(group.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">{group.description}</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Users className="h-3.5 w-3.5" />
                  <span>{group.contacts.toLocaleString()} contacts</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-[#D72444]">
                  View Contacts
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No groups found</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Edit Group' : 'Create Group'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Group Name *</Label>
              <Input placeholder="e.g., VIP Customers" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</Label>
              <Textarea
                placeholder="Brief description of this group..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={handleSave}>
              {editingGroup ? 'Update' : 'Create'} Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
