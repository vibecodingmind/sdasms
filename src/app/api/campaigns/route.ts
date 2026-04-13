import { NextRequest, NextResponse } from 'next/server';
import { mockCampaigns } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const campaigns = await db.campaign.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return NextResponse.json(campaigns);
    } catch {
      return NextResponse.json(mockCampaigns);
    }
  } catch {
    return NextResponse.json(mockCampaigns);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignName, message, scheduleTime, scheduleType, dltTemplateId, type = 'sms' } = body;

    try {
      const { db } = await import('@/lib/db');
      const campaign = await db.campaign.create({
        data: {
          uid: crypto.randomUUID(),
          campaignName,
          message,
          scheduleTime: scheduleTime ? new Date(scheduleTime) : null,
          scheduleType: scheduleType || 'onetime',
          dltTemplateId,
          status: 'pending',
          userId: 1,
        },
      });
      return NextResponse.json(campaign, { status: 201 });
    } catch {
      const newCampaign = {
        id: mockCampaigns.length + 1,
        uid: crypto.randomUUID(),
        userId: 1,
        campaignName,
        message,
        scheduleTime: scheduleTime || null,
        scheduleType: scheduleType || 'onetime',
        status: 'pending',
        dltTemplateId: dltTemplateId || null,
        createdAt: new Date().toISOString(),
        contactCount: 0,
        delivered: 0,
        failed: 0,
        type,
      };
      return NextResponse.json(newCampaign, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
