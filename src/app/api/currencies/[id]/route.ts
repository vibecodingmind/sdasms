import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a currency
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
    if (body.symbol !== undefined) updateData.symbol = body.symbol;
    if (body.rate !== undefined) updateData.rate = body.rate;
    if (body.status !== undefined) updateData.status = body.status;

    const currency = await prisma.currency.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: currency.id,
        name: currency.name,
        code: currency.code,
        symbol: currency.symbol,
        rate: currency.rate,
        status: currency.status,
      },
    });
  } catch (error) {
    console.error('Failed to update currency:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update currency' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a currency
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.currency.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Currency deleted' });
  } catch (error) {
    console.error('Failed to delete currency:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete currency' },
      { status: 500 }
    );
  }
}
