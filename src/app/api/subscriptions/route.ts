import { NextResponse } from 'next/server';
import { mockSubscription } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const subscription = await db.subscription.findFirst({
        where: { userId: 1, status: 'active' },
        include: { plan: true },
      });
      return NextResponse.json(subscription);
    } catch {
      return NextResponse.json(mockSubscription);
    }
  } catch {
    return NextResponse.json(mockSubscription);
  }
}
