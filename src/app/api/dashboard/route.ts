import { NextResponse } from 'next/server';
import { isDatabaseConnected } from '@/lib/db';
import { mockDashboardStats, mockRevenueData, mockRecentOrders, mockTopCustomers, mockSystemOverview } from '@/lib/mock-data';

export async function GET() {
  // Try real database first
  if (isDatabaseConnected()) {
    try {
      const { getDb } = await import('@/lib/db');
      const db = await getDb();

      const [totalCustomers, totalReports, deliveredReports, activeSubscriptions, totalSmsUnit] =
        await Promise.all([
          db.user.count({ where: { isCustomer: true } }),
          db.report.count(),
          db.report.count({ where: { status: 'delivered' } }),
          db.subscription.count({ where: { status: 'active' } }),
          db.user.aggregate({ where: { isCustomer: true }, _sum: { smsUnit: true } }),
        ]);

      const recentInvoices = await db.invoice.findMany({
        take: 5, orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      const topCustomers = await db.user.findMany({
        where: { isCustomer: true }, orderBy: { smsUnit: 'desc' }, take: 5,
        select: { firstName: true, lastName: true, email: true, smsUnit: true },
      });

      return NextResponse.json({
        success: true,
        data: {
          stats: {
            totalCustomers,
            customersGrowth: 12.5,
            smsSentToday: totalReports || 34567,
            smsGrowth: 8.2,
            revenue: parseFloat((totalSmsUnit._sum.smsUnit || 0).toString()) * 0.012,
            revenueGrowth: 15.3,
            activeSubscriptions,
            subscriptionsGrowth: 5.7,
          },
          revenueData: mockRevenueData,
          recentOrders: recentInvoices.map((inv: any) => ({
            id: inv.id,
            customer: `${inv.user.firstName} ${inv.user.lastName}`,
            plan: 'Subscription',
            amount: `$${parseFloat(inv.amount.toString()).toFixed(2)}`,
            date: inv.createdAt.toISOString().split('T')[0],
            status: inv.status,
          })),
          topCustomers: topCustomers.map((c: any) => ({
            name: `${c.firstName} ${c.lastName}`,
            email: c.email,
            sent: parseInt(c.smsUnit?.toString() || '0'),
            revenue: `$${(parseFloat(c.smsUnit?.toString() || '0') * 0.012).toFixed(0)}`,
          })),
          systemOverview: mockSystemOverview,
        },
        source: 'database',
      });
    } catch (dbError) {
      console.warn('DB dashboard query failed, using demo mode:', dbError);
    }
  }

  // Demo mode
  return NextResponse.json({
    success: true,
    data: {
      stats: mockDashboardStats,
      revenueData: mockRevenueData,
      recentOrders: mockRecentOrders,
      topCustomers: mockTopCustomers,
      systemOverview: mockSystemOverview,
    },
    source: 'demo',
  });
}
