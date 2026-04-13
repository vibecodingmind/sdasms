import { NextRequest, NextResponse } from 'next/server';
import { mockPlans } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockPlans });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPlan = {
      id: mockPlans.length + 1,
      uid: `plan-${String(mockPlans.length + 1).padStart(3, '0')}`,
      ...body,
    };
    return NextResponse.json({ success: true, data: newPlan });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
