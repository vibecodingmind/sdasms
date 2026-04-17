import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a language
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.code !== undefined) updateData.code = body.code;
    if (body.direction !== undefined) updateData.direction = body.direction;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isDefault !== undefined) updateData.isDefault = body.isDefault;
    if (body.is_default !== undefined) updateData.isDefault = body.is_default;

    const language = await prisma.language.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: language.id,
        name: language.name,
        code: language.code,
        direction: language.direction,
        status: language.status,
        isDefault: language.isDefault,
      },
    });
  } catch (error) {
    console.error('Failed to update language:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update language' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a language
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.language.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Language deleted' });
  } catch (error) {
    console.error('Failed to delete language:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete language' },
      { status: 500 }
    );
  }
}
