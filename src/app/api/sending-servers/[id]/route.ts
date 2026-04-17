import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a sending server
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.quotaValue !== undefined) updateData.quotaValue = body.quotaValue;
    if (body.quota_value !== undefined) updateData.quotaValue = body.quota_value;
    if (body.settings !== undefined) {
      updateData.settings = typeof body.settings === 'string'
        ? body.settings
        : JSON.stringify(body.settings);
    }
    if (body.status !== undefined) updateData.status = body.status;

    const server = await prisma.sendingServer.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    let parsedSettings: Record<string, unknown> = {};
    if (server.settings) {
      try {
        parsedSettings = JSON.parse(server.settings);
      } catch {
        parsedSettings = {};
      }
    }

    const data = {
      id: server.id,
      uid: server.uid,
      name: server.name,
      type: server.type,
      quota_value: server.quotaValue ?? 0,
      quota_unit: '1 min',
      status: server.status,
      settings: parsedSettings,
      user: server.user
        ? {
            firstName: server.user.firstName,
            lastName: server.user.lastName,
            email: server.user.email,
          }
        : null,
      created_at: server.createdAt.toISOString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to update sending server:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update sending server' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a sending server
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.sendingServer.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Sending server deleted' });
  } catch (error) {
    console.error('Failed to delete sending server:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete sending server' },
      { status: 500 }
    );
  }
}
