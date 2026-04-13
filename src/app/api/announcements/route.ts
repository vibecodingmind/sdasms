import { NextRequest, NextResponse } from 'next/server';
import { mockAnnouncements } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockAnnouncements });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAnnouncement = {
      id: mockAnnouncements.length + 1,
      uid: `ann-${String(mockAnnouncements.length + 1).padStart(3, '0')}`,
      ...body,
      created: new Date().toISOString().split('T')[0],
    };
    return NextResponse.json({ success: true, data: newAnnouncement });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
