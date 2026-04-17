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
