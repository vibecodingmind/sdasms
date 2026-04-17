import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET: List campaigns for current user
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    // Admins see all campaigns; customers see their own
    if (!session.is_admin) {
      where.userId = session.userId;
    }
    if (status) where.status = status;

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = campaigns.map((c) => ({
      id: c.id,
      uid: c.uid,
      name: c.name,
      type: c.type,
      message: c.message,
      status: c.status,
      contacts: c.contacts,
      delivered: c.delivered,
      failed: c.failed,
      delivery_rate: c.contacts > 0 ? ((c.delivered / c.contacts) * 100).toFixed(1) : '0',
      created_at: c.createdAt.toISOString(),
      user: c.user ? { first_name: c.user.firstName, last_name: c.user.lastName, email: c.user.email } : null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// POST: Create a campaign
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);

    const body = await request.json();
    const { name, type, message, contact_ids, schedule_time } = body;

    if (!name || !message) {
      return NextResponse.json({ success: false, message: 'Name and message are required' }, { status: 400 });
    }

    // Count contacts (from group or direct list)
    let contactCount = 0;
    if (contact_ids && Array.isArray(contact_ids)) {
      contactCount = contact_ids.length;
    }

    const campaign = await prisma.campaign.create({
      data: {
        uid: uuidv4(),
        userId: session.userId,
        name,
        type: type || 'sms',
        message,
        status: schedule_time ? 'scheduled' : 'pending',
        contacts: contactCount,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: campaign.id, uid: campaign.uid, name: campaign.name,
        type: campaign.type, status: campaign.status,
        contacts: campaign.contacts,
      },
    });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json({ success: false, message: 'Failed to create campaign' }, { status: 500 });
  }
}
