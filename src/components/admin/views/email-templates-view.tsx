'use client';

import React, { useState } from 'react';
import { Edit, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockEmailTemplates } from '@/lib/mock-data';

const typeColors: Record<string, string> = {
  customer: 'bg-blue-100 text-blue-700',
  auth: 'bg-rose-100 text-rose-700',
  billing: 'bg-green-100 text-green-700',
  notification: 'bg-orange-100 text-orange-700',
};

export function EmailTemplatesView() {
  const [selected, setSelected] = useState<typeof mockEmailTemplates[0] | null>(null);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs text-gray-500 font-medium">Template Name</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Subject</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Type</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEmailTemplates.map((t) => (
                <TableRow key={t.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#D72444]" />
                      <span className="text-sm font-medium text-gray-800">{t.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{t.subject}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[t.type] || 'bg-gray-100 text-gray-600'}`}>{t.type}</span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelected(t)}>
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template: {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input defaultValue={selected.subject} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                <Textarea defaultValue={selected.body} rows={12} className="font-mono text-sm" />
                <p className="text-xs text-gray-400 mt-1">Available variables: {"{{name}}"}, {"{{email}}"}, {"{{invoice_id}}"}, {"{{expiry_date}}"}, {"{{campaign_name}}"}, {"{{balance}}"}, {"{{company_name}}"}</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white">Save Template</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
