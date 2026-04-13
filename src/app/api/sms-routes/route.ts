import { NextRequest, NextResponse } from 'next/server';
import { mockSmsRoutes } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const routes = await db.smsRoute.findMany({
        include: { sendingServer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(routes);
    } catch {
      return NextResponse.json(mockSmsRoutes);
    }
  } catch {
    return NextResponse.json(mockSmsRoutes);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sendingServerId, connectType, countryIds } = body;

    try {
      const { db } = await import('@/lib/db');
      const route = await db.smsRoute.create({
        data: { name, sendingServerId: parseInt(sendingServerId), connectType, countryIds, userId: 1, status: 'active' },
      });
      return NextResponse.json(route, { status: 201 });
    } catch {
      const route = { id: mockSmsRoutes.length + 1, userId: 1, name, sendingServerId: parseInt(sendingServerId), sendingServerName: '', connectType, countryIds, status: 'active', createdAt: new Date().toISOString() };
      return NextResponse.json(route, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
}
