'use client';

import React, { useState } from 'react';
import { Plus, Unlock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockBlockedSenderIds } from '@/lib/mock-data';

export function BlockedSenderIdView() {
  const [blocked, setBlocked] = useState(mockBlockedSenderIds);
  const [dialogOpen, setDialogOpen] = useState(false);

  const unblock = (id: number) => setBlocked(blocked.filter((b) => b.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Blocked Sender ID</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage blocked sender IDs</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white"><Plus className="h-4 w-4 mr-2" /> Block Sender ID</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Block Sender ID</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Sender ID</label><Input placeholder="SENDERID" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Reason</label><Textarea placeholder="Reason for blocking" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#6366F1] hover:bg-[#5558E6] text-white">Block</Button>
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
                <TableHead className="text-xs text-gray-500 font-medium">Sender ID</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Reason</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Blocked Date</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocked.map((b) => (
                <TableRow key={b.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-sm font-mono font-semibold text-red-600">{b.sender_id}</TableCell>
                  <TableCell className="text-sm text-gray-500 max-w-xs truncate">{b.reason}</TableCell>
                  <TableCell className="text-sm text-gray-500">{b.blocked_date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50" onClick={() => unblock(b.id)}>
                      <Unlock className="h-3 w-3 mr-1" /> Unblock
                    </Button>
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
