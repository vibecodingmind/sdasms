import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'campaigns') {
      const campaigns = await prisma.campaign.findMany({
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const data = campaigns.map((c) => ({
        id: c.uid,
        uid: c.uid,
        name: c.name,
        type: c.type,
        message: c.message,
        status: c.status,
        contacts: c.contacts,
        delivered: c.delivered,
        failed: c.failed,
        created_at: c.createdAt.toISOString(),
        user: c.user
          ? {
              first_name: c.user.firstName,
              last_name: c.user.lastName,
              email: c.user.email,
            }
          : null,
      }));

      return NextResponse.json({ success: true, data });
    }

    // Default: return full reports bundle
    const [smsReports, campaigns, statsAgg] = await Promise.all([
      prisma.smsReport.findMany({
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.campaign.findMany({
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.smsReport.aggregate({
        _count: true,
        _sum: { cost: true },
      }),
    ]);

    // Compute delivery breakdown
    const statusCounts = await prisma.smsReport.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const deliveryBreakdown = [
      { name: 'Delivered', value: 0, color: '#10B981' },
      { name: 'Failed', value: 0, color: '#EF4444' },
      { name: 'Pending', value: 0, color: '#F59E0B' },
      { name: 'Sent', value: 0, color: '#3B82F6' },
    ];

    for (const sc of statusCounts) {
      const normalized = (sc.status || '').toLowerCase();
      if (normalized === 'delivered') deliveryBreakdown[0].value = sc._count.status;
      else if (normalized === 'failed') deliveryBreakdown[1].value = sc._count.status;
      else if (normalized === 'pending') deliveryBreakdown[2].value = sc._count.status;
      else deliveryBreakdown[3].value += sc._count.status;
    }

    // Compute SMS trend (daily volume for last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentReports = await prisma.smsReport.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: 'asc' },
    });

    const trendByDate: Record<string, { total: number; delivered: number; failed: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      trendByDate[key] = { total: 0, delivered: 0, failed: 0 };
    }

    for (const r of recentReports) {
      const key = r.createdAt.toISOString().split('T')[0];
      if (trendByDate[key]) {
        trendByDate[key].total++;
        const s = (r.status || '').toLowerCase();
        if (s === 'delivered') trendByDate[key].delivered++;
        else if (s === 'failed') trendByDate[key].failed++;
      }
    }

    const smsTrend = Object.entries(trendByDate).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    // Stats
    const deliveredCount = statusCounts.find(
      (sc) => (sc.status || '').toLowerCase() === 'delivered'
    )?._count.status || 0;
    const failedCount = statusCounts.find(
      (sc) => (sc.status || '').toLowerCase() === 'failed'
    )?._count.status || 0;

    const stats = {
      total_sms: statsAgg._count,
      delivered: deliveredCount,
      failed: failedCount,
      pending: statsAgg._count - deliveredCount - failedCount,
      total_cost: statsAgg._sum.cost || 0,
      delivery_rate:
        statsAgg._count > 0
          ? ((deliveredCount / statsAgg._count) * 100).toFixed(1)
          : '0',
    };

    // Map SMS history
    const smsHistory = smsReports.map((r) => ({
      id: r.id,
      uid: r.uid || null,
      from: r.from,
      to: r.to,
      message: r.message,
      status: r.status,
      cost: r.cost,
      created_at: r.createdAt.toISOString(),
      user: r.user
        ? {
            first_name: r.user.firstName,
            last_name: r.user.lastName,
          }
        : null,
    }));

    // Map campaigns
    const campaignsData = campaigns.map((c) => ({
      id: c.uid,
      uid: c.uid,
      name: c.name,
      type: c.type,
      message: c.message,
      status: c.status,
      contacts: c.contacts,
      delivered: c.delivered,
      failed: c.failed,
      created_at: c.createdAt.toISOString(),
      user: c.user
        ? {
            first_name: c.user.firstName,
            last_name: c.user.lastName,
            email: c.user.email,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        smsHistory,
        campaigns: campaignsData,
        stats,
        smsTrend,
        deliveryBreakdown,
      },
    });
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
