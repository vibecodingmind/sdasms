import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a contact
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);

    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.first_name !== undefined) updateData.firstName = body.first_name;
    if (body.last_name !== undefined) updateData.lastName = body.last_name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.group_id !== undefined) updateData.groupId = body.group_id ? parseInt(body.group_id) : null;
    if (body.status !== undefined) updateData.status = body.status;

    const contact = await prisma.contact.update({
      where: { id: parseInt(id), userId: session.userId },
      data: updateData,
      include: { group: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: contact.id, uid: contact.uid,
        group_id: contact.groupId, group_name: contact.group?.name || 'Ungrouped',
        first_name: contact.firstName, last_name: contact.lastName,
        email: contact.email, phone: contact.phone, status: contact.status,
      },
    });
  } catch (error) {
    console.error('Failed to update contact:', error);
    return NextResponse.json({ success: false, message: 'Failed to update contact' }, { status: 500 });
  }
}

// DELETE: Remove a contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);

    const { id } = await params;
    await prisma.contact.deleteMany({ where: { id: parseInt(id), userId: session.userId } });

    return NextResponse.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    console.error('Failed to delete contact:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete contact' }, { status: 500 });
  }
}
