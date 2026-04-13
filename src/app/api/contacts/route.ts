import { NextRequest, NextResponse } from 'next/server';
import { mockContacts } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const group = searchParams.get('group') || '';

  try {
    try {
      const { db } = await import('@/lib/db');
      const where: Record<string, unknown> = {};
      if (search) where.phone = { contains: search };
      if (status) where.status = status;
      if (group) where.groupId = parseInt(group);

      const [contacts, total] = await Promise.all([
        db.contact.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.contact.count({ where }),
      ]);

      return NextResponse.json({ contacts, total, page, limit });
    } catch {
      let filtered = mockContacts;
      if (search) filtered = filtered.filter(c => c.phone.includes(search) || c.firstName?.toLowerCase().includes(search.toLowerCase()) || c.lastName?.toLowerCase().includes(search.toLowerCase()));
      if (status) filtered = filtered.filter(c => c.status === status);
      if (group) filtered = filtered.filter(c => c.groupId === parseInt(group));

      const total = filtered.length;
      const start = (page - 1) * limit;
      const contacts = filtered.slice(start, start + limit);
      return NextResponse.json({ contacts, total, page, limit });
    }
  } catch {
    return NextResponse.json({ contacts: mockContacts.slice(0, limit), total: mockContacts.length, page, limit });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, firstName, lastName, email, groupId } = body;

    try {
      const { db } = await import('@/lib/db');
      const contact = await db.contact.create({
        data: { uid: crypto.randomUUID(), phone, firstName, lastName, email, groupId: groupId || null, userId: 1, status: 'subscribed' },
      });
      return NextResponse.json(contact, { status: 201 });
    } catch {
      const contact = { id: mockContacts.length + 1, uid: crypto.randomUUID(), userId: 1, phone, firstName, lastName, email, groupId: groupId || null, status: 'subscribed', createdAt: new Date().toISOString() };
      return NextResponse.json(contact, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
