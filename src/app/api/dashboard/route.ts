import { NextResponse } from 'next/server';
import { mockDashboard } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const totalContacts = await db.contact.count();
      const totalCampaigns = await db.campaign.count();
      const activeCampaigns = await db.campaign.count({ where: { status: { in: ['sending', 'scheduled'] } } });

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const smsSentToday = await db.report.count({
        where: { createdAt: { gte: todayStart }, direction: 'outbound' },
      });

      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const smsSentMonth = await db.report.count({
        where: { createdAt: { gte: monthStart }, direction: 'outbound' },
      });

      return NextResponse.json({
        totalContacts,
        smsSentToday,
        smsSentMonth,
        activeCampaigns,
        totalCampaigns,
        ...mockDashboard,
      });
    } catch {
      return NextResponse.json(mockDashboard);
    }
  } catch {
    return NextResponse.json(mockDashboard);
  }
}
