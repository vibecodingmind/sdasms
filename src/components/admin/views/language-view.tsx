'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Language { id: number; name: string; code: string; direction: string; status: string; is_default: boolean; }

export function LanguageView() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch('/api/languages').then((r) => r.json()).then((r) => setLanguages(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white"><Plus className="h-4 w-4 mr-2" /> Add Language</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Language</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Language Name</label><Input placeholder="Spanish" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Code</label><Input placeholder="es" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                  <Select defaultValue="LTR">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LTR">Left to Right</SelectItem>
                      <SelectItem value="RTL">Right to Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3"><Switch defaultChecked /><label className="text-sm text-gray-700">Active</label></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#D72444] hover:bg-[#C01E3A] text-white">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs text-gray-500 font-medium">Language</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Code</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Direction</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Status</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Default</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {languages.map((l) => (
                <TableRow key={l.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-sm font-medium text-gray-800">{l.name}</TableCell>
                  <TableCell className="text-sm text-gray-500 font-mono">{l.code}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${l.direction === 'RTL' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}`}>{l.direction}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${l.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{l.status}</span>
                  </TableCell>
                  <TableCell>
                    {l.is_default && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
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
