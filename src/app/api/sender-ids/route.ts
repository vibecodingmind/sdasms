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

    const senderIds = await prisma.senderId.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    // Parse supportingCountries from JSON string and transform to match frontend interface
    const data = senderIds.map((s) => {
      let countries: string[] = [];
      if (s.supportingCountries) {
        try {
          countries = JSON.parse(s.supportingCountries);
        } catch {
          countries = [];
        }
      }

      return {
        id: s.id,
        uid: s.uid,
        sender_id: s.senderId,
        customer: s.user
          ? `${s.user.firstName} ${s.user.lastName}`
          : 'Unknown',
        customer_email: s.user?.email ?? '',
        status: s.status,
        countries,
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
    console.error('Failed to fetch sender IDs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sender IDs' },
      { status: 500 }
    );
  }
}
