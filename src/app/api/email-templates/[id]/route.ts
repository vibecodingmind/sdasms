import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update an email template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.subject !== undefined) updateData.subject = body.subject;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.body !== undefined) updateData.body = body.body;
    if (body.status !== undefined) updateData.status = body.status;

    const template = await prisma.emailTemplate.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: template.id, uid: template.uid, name: template.name,
        subject: template.subject, type: template.type,
        body: template.body, status: template.status,
      },
    });
  } catch (error) {
    console.error('Failed to update email template:', error);
    return NextResponse.json({ success: false, message: 'Failed to update email template' }, { status: 500 });
  }
}

// DELETE: Delete an email template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.emailTemplate.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Email template deleted' });
  } catch (error) {
    console.error('Failed to delete email template:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete email template' }, { status: 500 });
  }
}
