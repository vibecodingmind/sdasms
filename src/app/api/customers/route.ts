import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { isAdmin: false },
      select: {
        id: true, uid: true, firstName: true, lastName: true,
        email: true, phone: true, status: true, smsBalance: true, createdAt: true,
        subscriptions: { where: { status: 'active' }, include: { plan: true }, take: 1 },
      },
      orderBy: { id: 'asc' },
    });

    const data = users.map((u) => ({
      id: u.id, uid: u.uid,
      first_name: u.firstName, last_name: u.lastName,
      email: u.email, phone: u.phone || '',
      plan: u.subscriptions[0]?.plan?.name || 'Starter',
      sms_balance: parseFloat(u.smsBalance?.toString() || '0'),
      status: u.status,
      joined: u.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({ success: true, data, source: 'database' });
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hash } = await import('bcryptjs');

    const hashedPassword = await hash(body.password || 'customer123', 12);
    const user = await prisma.user.create({
      data: {
        uid: `c-${Date.now()}`,
        firstName: body.first_name, lastName: body.last_name,
        email: body.email, password: hashedPassword,
        phone: body.phone || null,
        smsBalance: body.sms_balance || 0,
        status: body.status || 'active',
        isAdmin: false,
      },
    });

    if (body.plan) {
      const plan = await prisma.plan.findFirst({ where: { name: body.plan } });
      if (plan) {
        await prisma.subscription.create({
          data: {
            uid: `sub-${Date.now()}`, userId: user.id, planId: plan.id,
            status: 'active',
            currentPeriodEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Failed to create customer:', error);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
