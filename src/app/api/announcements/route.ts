import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match frontend interface (camelCase from Prisma)
    const data = announcements.map((a) => ({
      id: a.id,
      uid: a.uid,
      title: a.title,
      message: a.message,
      status: a.status,
      created: a.createdAt.toISOString().split('T')[0],
      user: a.user
        ? { firstName: a.user.firstName, lastName: a.user.lastName }
        : null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }

    // Get userId from session cookie
    let userId: number | null = null;
    const sessionCookie = request.cookies.get('sdasms_session');
    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(sessionCookie.value);
        if (session.userId) {
          userId = session.userId;
        }
      } catch {
        // Invalid session cookie, continue without userId
      }
    }

    const announcement = await prisma.announcement.create({
      data: {
        uid: `ann-${Date.now()}`,
        title: title.trim(),
        message: message.trim(),
        status: status || 'active',
        userId,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    const data = {
      id: announcement.id,
      uid: announcement.uid,
      title: announcement.title,
      message: announcement.message,
      status: announcement.status,
      created: announcement.createdAt.toISOString().split('T')[0],
      user: announcement.user
        ? {
            firstName: announcement.user.firstName,
            lastName: announcement.user.lastName,
          }
        : null,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
