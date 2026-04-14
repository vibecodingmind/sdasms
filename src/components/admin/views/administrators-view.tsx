'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAdministrators } from '@/lib/mock-data';

export function AdministratorsView() {
  const [admins, setAdmins] = useState(mockAdministrators);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Administrators</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage admin users</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white"><Plus className="h-4 w-4 mr-2" /> Add Administrator</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Administrator</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><Input placeholder="John" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><Input placeholder="Doe" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><Input type="email" placeholder="john@admin.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><Input type="password" placeholder="••••••••" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Select defaultValue="viewer">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="support-admin">Support Admin</SelectItem>
                    <SelectItem value="billing-admin">Billing Admin</SelectItem>
                    <SelectItem value="tech-admin">Technical Admin</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#D72444] hover:bg-[#C01E3A] text-white">Create</Button>
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
                <TableHead className="text-xs text-gray-500 font-medium">Name</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Email</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Role</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">Last Login</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((a) => (
                <TableRow key={a.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#D72444] flex items-center justify-center text-white text-xs font-semibold">
                        {a.first_name[0]}{a.last_name[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{a.first_name} {a.last_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{a.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FEF2F2] text-[#D72444]">{a.role}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 hidden md:table-cell">{a.last_login}</TableCell>
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
