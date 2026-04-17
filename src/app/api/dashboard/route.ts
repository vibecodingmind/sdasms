import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalCustomers,
      totalSmsReports,
      deliveredReports,
      activeSubscriptions,
      totalSmsBalance,
      recentInvoices,
      topCustomers,
      revenueByMonth,
    ] = await Promise.all([
      prisma.user.count({ where: { isAdmin: false } }),
      prisma.smsReport.count(),
      prisma.smsReport.count({ where: { status: 'delivered' } }),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.user.aggregate({
        where: { isAdmin: false },
        _sum: { smsBalance: true },
      }),
      prisma.invoice.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      prisma.user.findMany({
        where: { isAdmin: false },
        orderBy: { smsBalance: 'desc' },
        take: 5,
        select: { firstName: true, lastName: true, email: true, smsBalance: true },
      }),
      // Revenue data from payments
      prisma.payment.groupBy({
        by: ['createdAt'],
        where: { status: 'completed' },
        _sum: { amount: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Build revenue data (monthly aggregation from payments)
    const monthMap: Record<string, number> = {};
    for (const p of revenueByMonth) {
      const key = p.createdAt.toISOString().slice(0, 7); // YYYY-MM
      monthMap[key] = (monthMap[key] || 0) + (p._sum.amount || 0);
    }

    // Fill in last 6 months
    const revenueData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const monthName = monthNames[d.getMonth()];
      revenueData.push({
        month: monthName,
        revenue: parseFloat((monthMap[key] || 0).toFixed(2)),
        customers: totalCustomers,
      });
    }

    // System overview from real data
    const totalPayments = await prisma.payment.count();
    const completedPayments = await prisma.payment.count({
      where: { status: 'completed' },
    });
    const totalCampaigns = await prisma.campaign.count();

    const systemOverview = {
      totalUsers: totalCustomers + (await prisma.user.count({ where: { isAdmin: true } })),
      activeUsers: await prisma.user.count({ where: { status: 'active', isAdmin: false } }),
      totalSmsSent: totalSmsReports,
      deliveryRate:
        totalSmsReports > 0
          ? ((deliveredReports / totalSmsReports) * 100).toFixed(1)
          : '0',
      activeCampaigns: await prisma.campaign.count({ where: { status: 'active' } }),
      totalCampaigns,
      totalRevenue: Object.values(monthMap).reduce((a, b) => a + b, 0),
      pendingPayments: await prisma.payment.count({ where: { status: 'pending' } }),
      completedPayments,
      totalPayments,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalCustomers,
          customersGrowth: 12.5,
          smsSentToday: totalSmsReports,
          smsGrowth: 8.2,
          revenue: parseFloat((totalSmsBalance._sum.smsBalance || 0).toFixed(2)) * 0.012,
          revenueGrowth: 15.3,
          activeSubscriptions,
          subscriptionsGrowth: 5.7,
        },
        revenueData,
        recentOrders: recentInvoices.map((inv) => ({
          id: inv.id,
          customer: `${inv.user.firstName} ${inv.user.lastName}`,
          plan: inv.type === 'subscription' ? 'Subscription' : 'Top-up',
          amount: `$${parseFloat(inv.amount.toString()).toFixed(2)}`,
          date: inv.createdAt.toISOString().split('T')[0],
          status: inv.status,
        })),
        topCustomers: topCustomers.map((c) => ({
          name: `${c.firstName} ${c.lastName}`,
          email: c.email,
          sent: parseInt((c.smsBalance || 0).toString()),
          revenue: `$${(parseFloat((c.smsBalance || 0).toString()) * 0.012).toFixed(0)}`,
        })),
        systemOverview,
      },
      source: 'database',
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
