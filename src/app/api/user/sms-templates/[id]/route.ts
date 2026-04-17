import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update an SMS template
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

    const template = await prisma.smsTemplate.update({
      where: { id: parseInt(id), userId: session.userId },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.message && { message: body.message }),
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: template.id, title: template.title, message: template.message, status: template.status },
    });
  } catch (error) {
    console.error('Failed to update SMS template:', error);
    return NextResponse.json({ success: false, message: 'Failed to update SMS template' }, { status: 500 });
  }
}

// DELETE: Delete an SMS template
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
    await prisma.smsTemplate.deleteMany({ where: { id: parseInt(id), userId: session.userId } });

    return NextResponse.json({ success: true, message: 'SMS template deleted' });
  } catch (error) {
    console.error('Failed to delete SMS template:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete SMS template' }, { status: 500 });
  }
}
