import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const plans = await prisma.plan.findMany({
      where: status ? { status } : undefined,
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    const data = plans.map((plan) => ({
      id: plan.id,
      uid: plan.uid,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
      status: plan.status,
      creditPrice: plan.creditPrice,
      subscriptionCount: plan._count.subscriptions,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, billingCycle, features, status, creditPrice } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Plan name is required' },
        { status: 400 }
      );
    }

    if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { success: false, message: 'A valid price is required' },
        { status: 400 }
      );
    }

    if (!billingCycle || !['monthly', 'yearly', 'weekly'].includes(billingCycle)) {
      return NextResponse.json(
        { success: false, message: 'A valid billing cycle is required (monthly, yearly, or weekly)' },
        { status: 400 }
      );
    }

    // Generate unique UID
    const count = await prisma.plan.count();
    const uid = `plan-${String(count + 1).padStart(3, '0')}`;

    const plan = await prisma.plan.create({
      data: {
        uid,
        name: name.trim(),
        price,
        billingCycle,
        features: features ? JSON.stringify(features) : '{}',
        status: status || 'active',
        creditPrice: creditPrice ?? null,
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
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create plan' },
      { status: 500 }
    );
  }
}
