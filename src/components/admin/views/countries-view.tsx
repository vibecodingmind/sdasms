'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Country { id: number; name: string; code: string; phone_code: string; status: string; }

export function CountriesView() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch('/api/countries').then((r) => r.json()).then((r) => setCountries(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Countries</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage supported countries</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white"><Plus className="h-4 w-4 mr-2" /> Add Country</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Country</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label><Input placeholder="Germany" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Code</label><Input placeholder="DE" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Code</label><Input placeholder="+49" /></div>
              </div>
              <div className="flex items-center gap-3"><Switch defaultChecked /><label className="text-sm text-gray-700">Active</label></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#6366F1] hover:bg-[#5558E6] text-white">Save</Button>
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
                <TableHead className="text-xs text-gray-500 font-medium">Country Name</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Code</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Phone Code</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((c) => (
                <TableRow key={c.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-sm font-medium text-gray-800">{c.name}</TableCell>
                  <TableCell className="text-sm text-gray-500 font-mono">{c.code}</TableCell>
                  <TableCell className="text-sm text-gray-500">{c.phone_code}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
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
