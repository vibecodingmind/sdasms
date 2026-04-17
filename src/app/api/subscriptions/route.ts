import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const subscriptions = await prisma.subscription.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            id: true,
            uid: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        plan: {
          select: {
            id: true,
            uid: true,
            name: true,
            price: true,
            billingCycle: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
