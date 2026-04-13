import { NextRequest, NextResponse } from 'next/server';
import { mockSenderIds } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const senderIds = await db.senderId.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(senderIds);
    } catch {
      return NextResponse.json(mockSenderIds);
    }
  } catch {
    return NextResponse.json(mockSenderIds);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId: sid, supportingCountries } = body;

    try {
      const { db } = await import('@/lib/db');
      const sId = await db.senderId.create({
        data: { uid: crypto.randomUUID(), senderId: sid, userId: 1, status: 'pending', supportingCountries },
      });
      return NextResponse.json(sId, { status: 201 });
    } catch {
      const sId = { id: mockSenderIds.length + 1, uid: crypto.randomUUID(), userId: 1, senderId: sid, status: 'pending', supportingCountries, createdAt: new Date().toISOString() };
      return NextResponse.json(sId, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create sender ID' }, { status: 500 });
  }
}
