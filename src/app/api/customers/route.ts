import { NextRequest, NextResponse } from 'next/server';
import { mockCustomers } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockCustomers });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCustomer = {
      id: mockCustomers.length + 1,
      uid: `c-${String(mockCustomers.length + 1).padStart(3, '0')}`,
      ...body,
      sms_balance: body.sms_balance || 0,
      status: body.status || 'active',
      joined: new Date().toISOString().split('T')[0],
      revenue: 0,
    };
    return NextResponse.json({ success: true, data: newCustomer });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
