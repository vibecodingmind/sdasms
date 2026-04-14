'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SenderId {
  id: number; sender_id: string; customer: string; status: string; countries: string[];
}

export function SenderIdView() {
  const [senderIds, setSenderIds] = useState<SenderId[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch('/api/sender-ids').then((r) => r.json()).then((r) => setSenderIds(r.data || [])).catch(() => {});
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      inactive: 'bg-gray-100 text-gray-600',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || ''}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Sender ID</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage sender ID registrations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white"><Plus className="h-4 w-4 mr-2" /> Add Sender ID</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Register Sender ID</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Sender ID</label><Input placeholder="MYCOMPANY" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer</label><Input placeholder="Customer name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Countries</label><Input placeholder="US, UK, CA" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#D72444] hover:bg-[#C01E3A] text-white">Register</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', value: senderIds.filter(s => s.status === 'active').length, color: 'text-green-600' },
          { label: 'Pending', value: senderIds.filter(s => s.status === 'pending').length, color: 'text-yellow-600' },
          { label: 'Inactive', value: senderIds.filter(s => s.status === 'inactive').length, color: 'text-gray-500' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs text-gray-500 font-medium">Sender ID</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Customer</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium hidden md:table-cell">Countries</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {senderIds.map((s) => (
                <TableRow key={s.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-sm font-mono font-semibold text-gray-800">{s.sender_id}</TableCell>
                  <TableCell className="text-sm text-gray-600">{s.customer}</TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500 hidden md:table-cell">
                    <div className="flex gap-1">
                      {s.countries.map((c) => (
                        <span key={c} className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600">{c}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {s.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-200"><Check className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200"><X className="h-3 w-3" /></Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-xs text-red-500"><Trash2 className="h-3 w-3" /></Button>
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
