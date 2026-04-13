import { NextResponse } from 'next/server';
import { mockPlans, mockSubscription } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const plans = await db.plan.findMany({ where: { status: 'active' } });
      return NextResponse.json(plans);
    } catch {
      return NextResponse.json(mockPlans);
    }
  } catch {
    return NextResponse.json(mockPlans);
  }
}
