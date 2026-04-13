'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface Announcement {
  id: number; title: string; message: string; status: string; created: string;
}

export function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch('/api/announcements').then((r) => r.json()).then((r) => setAnnouncements(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Announcements</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage system announcements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white">
              <Plus className="h-4 w-4 mr-2" /> New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input placeholder="Announcement title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea placeholder="Write your announcement..." rows={4} />
              </div>
              <div className="flex items-center gap-3">
                <Switch defaultChecked />
                <label className="text-sm text-gray-700">Active</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#6366F1] hover:bg-[#5558E6] text-white">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-xs text-gray-500 font-medium">Title</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">Message</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium">Created</TableHead>
                  <TableHead className="text-xs text-gray-500 font-medium w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((a) => (
                  <TableRow key={a.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-sm font-medium text-gray-800">{a.title}</TableCell>
                    <TableCell className="text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">{a.message}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {a.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{a.created}</TableCell>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
