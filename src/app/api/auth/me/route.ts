import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { mockUser } from '@/lib/mock-data';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try database first
    try {
      const { db } = await import('@/lib/db');
      const user = await db.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true, uid: true, firstName: true, lastName: true,
          email: true, status: true, smsUnit: true, isAdmin: true,
          isCustomer: true, avatar: true, dltEntityId: true,
          dltTelemarketerId: true, timezone: true, createdAt: true,
        },
      });

      if (user) {
        return NextResponse.json({ user });
      }
    } catch {
      // DB not available, use mock
    }

    // Mock user (demo mode)
    if (session.userId === mockUser.id) {
      return NextResponse.json({ user: mockUser });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
