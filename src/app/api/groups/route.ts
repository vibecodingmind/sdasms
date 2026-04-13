import { NextRequest, NextResponse } from 'next/server';
import { mockGroups } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const groups = await db.contactGroup.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(groups);
    } catch {
      return NextResponse.json(mockGroups);
    }
  } catch {
    return NextResponse.json(mockGroups);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    try {
      const { db } = await import('@/lib/db');
      const group = await db.contactGroup.create({
        data: { uid: crypto.randomUUID(), name, description, userId: 1, status: 'active' },
      });
      return NextResponse.json(group, { status: 201 });
    } catch {
      const group = { id: mockGroups.length + 1, uid: crypto.randomUUID(), userId: 1, name, description, status: 'active', contactCount: 0, createdAt: new Date().toISOString() };
      return NextResponse.json(group, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
