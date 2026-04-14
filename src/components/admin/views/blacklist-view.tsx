'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface BlacklistEntry {
  id: number; number: string; customer: string; reason: string; date: string;
}

export function BlacklistView() {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch('/api/blacklists').then((r) => r.json()).then((r) => setBlacklist(r.data || [])).catch(() => {});
  }, []);

  const filtered = blacklist.filter((b) => b.number.includes(search) || b.customer.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Blacklist</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage blacklisted phone numbers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white"><Plus className="h-4 w-4 mr-2" /> Add to Blacklist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add to Blacklist</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><Input placeholder="+1 555-000-0000" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer (optional)</label><Input placeholder="Customer name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Reason</label><Input placeholder="Reason for blacklisting" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#D72444] hover:bg-[#C01E3A] text-white">Add</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs text-gray-500 font-medium">Phone Number</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Customer</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">Reason</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Date</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-sm font-mono font-medium text-gray-800">{b.number}</TableCell>
                  <TableCell className="text-sm text-gray-600">{b.customer}</TableCell>
                  <TableCell className="text-sm text-gray-500 hidden md:table-cell">{b.reason}</TableCell>
                  <TableCell className="text-sm text-gray-500">{b.date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-3 w-3 mr-1" /> Remove
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
