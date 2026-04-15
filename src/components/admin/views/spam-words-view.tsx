'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Download, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SpamWord { id: number; word: string; category: string; }

export function SpamWordsView() {
  const [words, setWords] = useState<SpamWord[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    import('@/lib/mock-data').then(m => {
      setWords(m.mockSpamWords.map(w => ({ ...w, word: w.word.toUpperCase() })));
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search) return words;
    const q = search.toUpperCase();
    return words.filter(w => w.word.includes(q));
  }, [words, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, total);

  const deleteWord = (id: number) => setWords(prev => prev.filter(w => w.id !== id));
  const addWord = (word: string) => {
    if (word.trim()) {
      setWords(prev => [...prev, { id: Date.now(), word: word.toUpperCase(), category: 'spam' }]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700">
            Actions <ChevronLeft className="h-3 w-3 ml-1 rotate-90" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white"><Plus className="h-4 w-4 mr-1.5" /> Add New</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Spam Word</DialogTitle></DialogHeader>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); addWord(fd.get('word') as string); setDialogOpen(false); }}>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Spam Word</label><Input name="word" placeholder="Enter spam word" /></div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">Add</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="bg-teal-500 text-white border-teal-500 hover:bg-teal-600">
            <Download className="h-4 w-4 mr-1.5" /> Export
          </Button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={String(perPage)} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Spam Word</TableHead>
              <TableHead className="text-xs text-gray-500 font-semibold uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={2} className="text-center py-12 text-gray-400">No results available</TableCell></TableRow>
            ) : paginated.map(w => (
              <TableRow key={w.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                <TableCell className="text-sm font-semibold text-gray-800">{w.word}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50" onClick={() => deleteWord(w.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span>Showing {total > 0 ? startIdx : 0} to {endIdx} of {total} entries</span>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(1)}><ChevronsLeft className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <div className="flex items-center gap-1 mx-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <Button key={i + 1} size="icon" variant={page === i + 1 ? 'default' : 'outline'} className={`h-8 w-8 text-xs ${page === i + 1 ? 'bg-indigo-600' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</Button>
            ))}
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(totalPages)}><ChevronsRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
