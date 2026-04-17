import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (statusFilter) {
      where.status = statusFilter;
    }

    const servers = await prisma.sendingServer.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    // Parse settings from JSON string and transform to match frontend interface
    const data = servers.map((s) => {
      let parsedSettings: Record<string, unknown> = {};
      if (s.settings) {
        try {
          parsedSettings = JSON.parse(s.settings);
        } catch {
          parsedSettings = {};
        }
      }

      return {
        id: s.id,
        uid: s.uid,
        name: s.name,
        type: s.type,
        quota_value: s.quotaValue ?? 0,
        quota_unit: '1 min',
        status: s.status,
        settings: parsedSettings,
        user: s.user
          ? {
              firstName: s.user.firstName,
              lastName: s.user.lastName,
              email: s.user.email,
            }
          : null,
        created_at: s.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch sending servers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sending servers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, quotaValue, quota_value, settings, status } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Server name is required' },
        { status: 400 }
      );
    }

    if (!type || typeof type !== 'string' || type.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Server type is required' },
        { status: 400 }
      );
    }

    // Get userId from session cookie, fallback to 1
    let userId = 1;
    const sessionCookie = request.cookies.get('sdasms_session');
    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(sessionCookie.value);
        if (session.userId) {
          userId = session.userId;
        }
      } catch {
        // Invalid session cookie, use fallback
      }
    }

    const server = await prisma.sendingServer.create({
      data: {
        uid: `srv-${Date.now()}`,
        userId,
        name: name.trim(),
        type: type.trim(),
        quotaValue: quota_value ?? quotaValue ?? null,
        settings: settings
          ? (typeof settings === 'string' ? settings : JSON.stringify(settings))
          : '{}',
        status: status || 'active',
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    let parsedSettings: Record<string, unknown> = {};
    if (server.settings) {
      try {
        parsedSettings = JSON.parse(server.settings);
      } catch {
        parsedSettings = {};
      }
    }

    const data = {
      id: server.id,
      uid: server.uid,
      name: server.name,
      type: server.type,
      quota_value: server.quotaValue ?? 0,
      quota_unit: '1 min',
      status: server.status,
      settings: parsedSettings,
      user: server.user
        ? {
            firstName: server.user.firstName,
            lastName: server.user.lastName,
            email: server.user.email,
          }
        : null,
      created_at: server.createdAt.toISOString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to create sending server:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create sending server' },
      { status: 500 }
    );
  }
}
