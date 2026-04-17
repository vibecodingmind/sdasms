import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.billingCycle !== undefined) updateData.billingCycle = body.billingCycle;
    if (body.billing_cycle !== undefined) updateData.billingCycle = body.billing_cycle;
    if (body.features !== undefined) {
      updateData.features = typeof body.features === 'string'
        ? body.features
        : JSON.stringify(body.features);
    }
    if (body.status !== undefined) updateData.status = body.status;
    if (body.creditPrice !== undefined) updateData.creditPrice = body.creditPrice;
    if (body.credit_price !== undefined) updateData.creditPrice = body.credit_price;

    const plan = await prisma.plan.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    const data = {
      id: plan.id,
      uid: plan.uid,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
      status: plan.status,
      creditPrice: plan.creditPrice,
      subscriptionCount: plan._count.subscriptions,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to update plan:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update plan' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.plan.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    console.error('Failed to delete plan:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete plan' },
      { status: 500 }
    );
  }
}
