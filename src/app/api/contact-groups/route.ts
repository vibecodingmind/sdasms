import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET: List contact groups
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }

    const groups = await prisma.contactGroup.findMany({
      where: { userId: session.userId },
      include: {
        _count: { select: { contacts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = groups.map((g) => ({
      id: g.id,
      uid: g.uid,
      name: g.name,
      description: g.description,
      status: g.status,
      contact_count: g._count.contacts,
      created_at: g.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch contact groups:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch contact groups' }, { status: 500 });
  }
}

// POST: Create a new contact group
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Group name is required' }, { status: 400 });
    }

    const group = await prisma.contactGroup.create({
      data: {
        uid: uuidv4(),
        userId: session.userId,
        name,
        description: description || null,
        status: 'active',
      },
      include: { _count: { select: { contacts: true } } },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: group.id, uid: group.uid, name: group.name,
        description: group.description, status: group.status,
        contact_count: 0,
      },
    });
  } catch (error) {
    console.error('Failed to create contact group:', error);
    return NextResponse.json({ success: false, message: 'Failed to create contact group' }, { status: 500 });
  }
}
