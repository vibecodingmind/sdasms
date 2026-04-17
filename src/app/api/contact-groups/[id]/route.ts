import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a contact group
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
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;

    const group = await prisma.contactGroup.update({
      where: { id: parseInt(id), userId: session.userId },
      data: updateData,
      include: { _count: { select: { contacts: true } } },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: group.id, uid: group.uid, name: group.name,
        description: group.description, status: group.status,
        contact_count: group._count.contacts,
      },
    });
  } catch (error) {
    console.error('Failed to update contact group:', error);
    return NextResponse.json({ success: false, message: 'Failed to update contact group' }, { status: 500 });
  }
}

// DELETE: Delete a contact group (and unassign its contacts)
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
    const groupId = parseInt(id);

    // Unassign contacts from this group first
    await prisma.contact.updateMany({
      where: { groupId, userId: session.userId },
      data: { groupId: null },
    });

    await prisma.contactGroup.deleteMany({
      where: { id: groupId, userId: session.userId },
    });

    return NextResponse.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    console.error('Failed to delete contact group:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete contact group' }, { status: 500 });
  }
}
