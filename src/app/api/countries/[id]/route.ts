import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a country
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
    if (body.phoneCode !== undefined) updateData.phoneCode = body.phoneCode;
    if (body.phone_code !== undefined) updateData.phoneCode = body.phone_code;
    if (body.status !== undefined) updateData.status = body.status;

    const country = await prisma.country.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: country.id,
        name: country.name,
        code: country.code,
        phoneCode: country.phoneCode,
        status: country.status,
      },
    });
  } catch (error) {
    console.error('Failed to update country:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update country' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a country
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.country.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Country deleted' });
  } catch (error) {
    console.error('Failed to delete country:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete country' },
      { status: 500 }
    );
  }
}
