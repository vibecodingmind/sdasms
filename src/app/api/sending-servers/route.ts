import { NextRequest, NextResponse } from 'next/server';
import { mockSendingServers } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const servers = await db.sendingServer.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(servers);
    } catch {
      return NextResponse.json(mockSendingServers);
    }
  } catch {
    return NextResponse.json(mockSendingServers);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, settings } = body;

    try {
      const { db } = await import('@/lib/db');
      const server = await db.sendingServer.create({
        data: { uid: crypto.randomUUID(), name, type, settings, userId: 1, status: 'active' },
      });
      return NextResponse.json(server, { status: 201 });
    } catch {
      const server = { id: mockSendingServers.length + 1, uid: crypto.randomUUID(), userId: 1, name, type, settings, status: 'active', quotaValue: 100, smsPerRequest: 100, createdAt: new Date().toISOString() };
      return NextResponse.json(server, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create sending server' }, { status: 500 });
  }
}
