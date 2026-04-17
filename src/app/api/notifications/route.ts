import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List notifications for current user
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
    const unreadOnly = searchParams.get('unread') === 'true';

    const where: any = { userId: session.userId };
    if (status) where.status = status;
    if (unreadOnly) where.status = 'unread';

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const data = notifications.map((n) => ({
      id: n.id,
      uid: n.uid,
      title: n.title,
      message: n.message,
      type: n.type,
      status: n.status,
      created_at: n.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST: Mark notifications as read (body: { ids: [1,2,3] } or { all: true })
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);

    const body = await request.json();

    if (body.all) {
      await prisma.notification.updateMany({
        where: { userId: session.userId, status: 'unread' },
        data: { status: 'read' },
      });
    } else if (body.ids && Array.isArray(body.ids)) {
      await prisma.notification.updateMany({
        where: { id: { in: body.ids }, userId: session.userId },
        data: { status: 'read' },
      });
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (error) {
    console.error('Failed to update notifications:', error);
    return NextResponse.json({ success: false, message: 'Failed to update notifications' }, { status: 500 });
  }
}
