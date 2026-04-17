import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.first_name !== undefined) updateData.firstName = body.first_name;
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.last_name !== undefined) updateData.lastName = body.last_name;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.status !== undefined) updateData.status = body.status;

    // Hash password if provided and non-empty
    if (body.password && body.password.trim().length > 0) {
      const { hash } = await import('bcryptjs');
      updateData.password = await hash(body.password, 12);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        uid: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        smsBalance: true,
        createdAt: true,
      },
    });

    const data = {
      id: user.id,
      uid: user.uid,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone || '',
      sms_balance: parseFloat(user.smsBalance?.toString() || '0'),
      status: user.status,
      joined: user.createdAt.toISOString().split('T')[0],
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
