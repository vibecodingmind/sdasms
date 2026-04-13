import { NextRequest, NextResponse } from 'next/server';
import { mockSettings } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockSettings });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: { ...mockSettings, ...body } });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
