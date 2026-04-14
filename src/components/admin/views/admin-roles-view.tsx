'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockRoles } from '@/lib/mock-data';

const allPermissions = [
  'customers.view', 'customers.edit', 'customers.delete',
  'reports.view', 'invoices.view', 'invoices.manage',
  'plans.manage', 'servers.manage', 'settings.manage',
  'announcements.manage', 'dashboard.view', 'all',
];

export function AdminRolesView() {
  const [roles, setRoles] = useState(mockRoles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const togglePerm = (perm: string) => {
    setSelectedPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Admin Roles</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage roles and permissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white"><Plus className="h-4 w-4 mr-2" /> Add Role</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Role</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <Input placeholder="Custom Admin Role" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {allPermissions.map((perm) => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(perm)}
                        onChange={() => togglePerm(perm)}
                        className="w-4 h-4 rounded border-gray-300 text-[#D72444] focus:ring-[#D72444]"
                      />
                      <span className="text-xs text-gray-600">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#D72444] hover:bg-[#C01E3A] text-white">Create Role</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs text-gray-500 font-medium">Role Name</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Users</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Permissions</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#D72444]" />
                      <span className="text-sm font-medium text-gray-800">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{role.users_count}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((p) => (
                        <Badge key={p} variant="secondary" className="text-[10px] px-1.5 py-0">{p}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Edit className="h-4 w-4 text-gray-400" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Trash2 className="h-4 w-4 text-red-400" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
