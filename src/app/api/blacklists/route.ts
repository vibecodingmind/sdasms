import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const blacklists = await prisma.blacklist.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    // Transform to match frontend interface
    const data = blacklists.map((b) => ({
      id: b.id,
      uid: b.uid,
      number: b.number,
      customer: b.user
        ? `${b.user.firstName} ${b.user.lastName}`
        : 'Unknown',
      customer_email: b.user?.email ?? '',
      reason: b.reason ?? '',
      date: b.createdAt.toISOString().split('T')[0],
      user: b.user
        ? {
            firstName: b.user.firstName,
            lastName: b.user.lastName,
            email: b.user.email,
          }
        : null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch blacklists:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blacklists' },
      { status: 500 }
    );
  }
}
