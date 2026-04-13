'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Download, Filter, CheckCircle2, XCircle, Clock, AlertTriangle, Ban } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

interface Report {
  id: number;
  campaignId: number;
  from: string;
  to: string;
  message: string;
  status: string;
  cost: number;
  smsCount: number;
  direction: string;
  sendBy: string;
  createdAt: string;
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#6b7280', '#06b6d4'];

const statusColors: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-purple-100 text-purple-700',
  bounced: 'bg-gray-100 text-gray-700',
  read: 'bg-blue-100 text-blue-700',
};

export function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [charts, setCharts] = useState<{ deliveryStatus: { name: string; value: number; color: string }[]; dailyTrend: { day: string; sent: number; delivered: number; failed: number }[] }>({ deliveryStatus: [], dailyTrend: [] });
  const [tab, setTab] = useState('table');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15', status: statusFilter, dateFrom, dateTo });
    try {
      const res = await fetch(`/api/reports?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports);
        setTotal(data.total);
        if (data.charts) setCharts(data.charts);
      }
    } catch {}
    setLoading(false);
  }, [page, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '15', status: statusFilter, dateFrom, dateTo });
      try {
        const res = await fetch(`/api/reports?${params}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setReports(data.reports);
          setTotal(data.total);
          if (data.charts) setCharts(data.charts);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [page, statusFilter, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Daily Sending Trend</CardTitle>
            <CardDescription>Messages sent vs delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.dailyTrend}>
                  <defs>
                    <linearGradient id="rptSent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                    <linearGradient id="rptDel" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sent" stroke="#3b82f6" fill="url(#rptSent)" strokeWidth={2} />
                  <Area type="monotone" dataKey="delivered" stroke="#22c55e" fill="url(#rptDel)" strokeWidth={2} />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.deliveryStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {charts.deliveryStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {charts.deliveryStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Filters:</span>
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="w-auto" />
            <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="w-auto" />
            <Button variant="outline" size="sm" onClick={() => { setStatusFilter('all'); setDateFrom(''); setDateTo(''); setPage(1); }}>Clear</Button>
            <Button variant="outline" size="sm" className="ml-auto"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Status</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead className="hidden lg:table-cell">Via</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Cost</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50">
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[r.status] || 'bg-gray-100 text-gray-700'}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{r.from}</TableCell>
                  <TableCell className="font-mono text-sm">{r.to}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate text-sm text-slate-600">{r.message}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-slate-500">{r.sendBy}</TableCell>
                  <TableCell className="text-right hidden sm:table-cell font-medium">₹{r.cost.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-slate-400">No reports found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {total > 15 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-slate-500">Showing {((page - 1) * 15) + 1}-{Math.min(page * 15, total)} of {total}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page * 15 >= total}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
