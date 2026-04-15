'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Download, Plus, Save, AlertTriangle, Eye, Edit2, Trash2, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// ============ SHARED PAGINATION ============
export function Pagination({
  total,
  currentPage,
  setCurrentPage,
  perPage,
}: {
  total: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  perPage: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startIdx = (currentPage - 1) * perPage + 1;
  const endIdx = Math.min(currentPage * perPage, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
      <span>
        Showing {total > 0 ? startIdx : 0} to {endIdx} of {total} entries
      </span>
      <div className="flex items-center gap-1">
        <Btn icon disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}><ChevronsLeft className="h-4 w-4" /></Btn>
        <Btn icon disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Btn>
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((pg, idx) =>
            typeof pg === 'string' ? (
              <span key={`dots-${idx}`} className="px-1">...</span>
            ) : (
              <Button
                key={pg}
                size="icon"
                variant={currentPage === pg ? 'default' : 'outline'}
                className={`h-8 w-8 text-xs ${currentPage === pg ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                onClick={() => setCurrentPage(pg)}
              >
                {pg}
              </Button>
            )
          )}
        </div>
        <Btn icon disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Btn>
        <Btn icon disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)}><ChevronsRight className="h-4 w-4" /></Btn>
      </div>
    </div>
  );
}

// ============ SHARED ACTION BAR ============
export function ActionBar({
  actionsColor = 'indigo',
  showCreate = true,
  createLabel = 'Add New',
  showExport = true,
  showSearch = true,
  search,
  setSearch,
  perPage,
  setPerPage,
  children,
}: {
  actionsColor?: 'indigo' | 'orange';
  showCreate?: boolean;
  createLabel?: string;
  showExport?: boolean;
  showSearch?: boolean;
  search?: string;
  setSearch?: (v: string) => void;
  perPage?: number;
  setPerPage?: (v: number) => void;
  children?: React.ReactNode;
}) {
  const actionColorClass = actionsColor === 'orange'
    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
    : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" className={actionColorClass}>
          Actions
          <ChevronLeft className="h-3 w-3 ml-1 rotate-90" />
        </Button>
        {showCreate && (
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="h-4 w-4 mr-1.5" />
            {createLabel}
          </Button>
        )}
        {showExport && (
          <Button variant="outline" className="bg-teal-500 text-white border-teal-500 hover:bg-teal-600">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
        )}
        {children}
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {showSearch && (
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-9"
              value={search || ''}
              onChange={(e) => setSearch?.(e.target.value)}
            />
          </div>
        )}
        {perPage !== undefined && setPerPage && (
          <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

// ============ HELPER BUTTON ============
function Btn({ children, disabled, onClick, className = '' }: { children: React.ReactNode; disabled?: boolean; onClick: () => void; className?: string }) {
  return (
    <Button size="icon" variant="outline" className={`h-8 w-8 ${className}`} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}

// ============ BADGE HELPERS ============
export function StatusBadge({ children, color }: { children: React.ReactNode; color: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray' }) {
  const colors: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

export function TypeBadge({ children, color = 'purple' }: { children: React.ReactNode; color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' }) {
  const colors: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors[color] || colors.purple}`}>
      {children}
    </span>
  );
}

// ============ REEXPORT ICONS ============
export { Search, Download, Plus, Save, AlertTriangle, Eye, Edit2, Trash2, BarChart3, Switch, Checkbox, Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent };
