import { NextRequest, NextResponse } from 'next/server';
import { mockReports, mockDashboard } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || '';
  const campaignId = searchParams.get('campaignId') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';

  try {
    try {
      const { db } = await import('@/lib/db');
      const where: Record<string, unknown> = { userId: 1 };
      if (status) where.status = status;
      if (campaignId) where.campaignId = parseInt(campaignId);
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
        if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
      }

      const [reports, total] = await Promise.all([
        db.report.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
        db.report.count({ where }),
      ]);

      const charts = {
        deliveryStatus: mockDashboard.deliveryStatus,
        dailyTrend: mockDashboard.weeklyStats,
      };

      return NextResponse.json({ reports, total, page, limit, charts });
    } catch {
      let filtered = mockReports;
      if (status) filtered = filtered.filter(r => r.status === status);
      if (campaignId) filtered = filtered.filter(r => r.campaignId === parseInt(campaignId));
      if (dateFrom) filtered = filtered.filter(r => new Date(r.createdAt) >= new Date(dateFrom));
      if (dateTo) filtered = filtered.filter(r => new Date(r.createdAt) <= new Date(dateTo));

      const total = filtered.length;
      const start = (page - 1) * limit;
      const reports = filtered.slice(start, start + limit);
      const charts = { deliveryStatus: mockDashboard.deliveryStatus, dailyTrend: mockDashboard.weeklyStats };
      return NextResponse.json({ reports, total, page, limit, charts });
    }
  } catch {
    return NextResponse.json({ reports: mockReports.slice(0, limit), total: mockReports.length, page, limit, charts: { deliveryStatus: mockDashboard.deliveryStatus, dailyTrend: mockDashboard.weeklyStats } });
  }
}
