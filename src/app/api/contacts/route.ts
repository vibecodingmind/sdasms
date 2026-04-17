import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET: List contacts (optionally filter by groupId)
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

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('group_id');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { userId: session.userId };
    if (groupId) where.groupId = parseInt(groupId);
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { phone: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          group: { select: { id: true, uid: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    const data = contacts.map((c) => ({
      id: c.id,
      uid: c.uid,
      group_id: c.groupId,
      group_name: c.group?.name || 'Ungrouped',
      first_name: c.firstName,
      last_name: c.lastName,
      email: c.email,
      phone: c.phone,
      status: c.status,
      created_at: c.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// POST: Create a new contact (optionally assign to group)
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }

    const body = await request.json();
    const { first_name, last_name, email, phone, group_id, status } = body;

    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        uid: uuidv4(),
        userId: session.userId,
        groupId: group_id ? parseInt(group_id) : null,
        firstName: first_name || null,
        lastName: last_name || null,
        email: email || null,
        phone,
        status: status || 'subscribed',
      },
      include: { group: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: contact.id,
        uid: contact.uid,
        group_id: contact.groupId,
        group_name: contact.group?.name || 'Ungrouped',
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        status: contact.status,
      },
    });
  } catch (error) {
    console.error('Failed to create contact:', error);
    return NextResponse.json({ success: false, message: 'Failed to create contact' }, { status: 500 });
  }
}
