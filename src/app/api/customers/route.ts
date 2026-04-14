import { NextResponse } from 'next/server';
import { isDatabaseConnected } from '@/lib/db';
import { mockCustomers } from '@/lib/mock-data';

export async function GET() {
  // Try real database first
  if (isDatabaseConnected()) {
    try {
      const { getDb } = await import('@/lib/db');
      const db = await getDb();

      const users = await db.user.findMany({
        where: { isCustomer: true },
        select: {
          id: true, uid: true, firstName: true, lastName: true,
          email: true, status: true, smsUnit: true, createdAt: true,
          subscriptions: { where: { status: 'active' }, include: { plan: true }, take: 1 },
        },
        orderBy: { id: 'asc' },
      });

      const data = users.map((u: any) => ({
        id: u.id, uid: u.uid,
        first_name: u.firstName, last_name: u.lastName,
        email: u.email, phone: '',
        plan: u.subscriptions[0]?.plan?.name || 'Starter',
        sms_balance: parseFloat(u.smsUnit?.toString() || '0'),
        status: u.status,
        joined: u.createdAt.toISOString().split('T')[0],
      }));

      return NextResponse.json({ success: true, data, source: 'database' });
    } catch (dbError) {
      console.warn('DB customers query failed, using demo mode:', dbError);
    }
  }

  // Demo mode - return mock data
  return NextResponse.json({ success: true, data: mockCustomers, source: 'demo' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (isDatabaseConnected()) {
      try {
        const { hash } = await import('bcryptjs');
        const { getDb } = await import('@/lib/db');
        const db = await getDb();

        const hashedPassword = await hash(body.password || 'customer123', 12);
        const user = await db.user.create({
          data: {
            uid: `c-${Date.now()}`,
            firstName: body.first_name, lastName: body.last_name,
            email: body.email, password: hashedPassword,
            phone: body.phone || '', smsUnit: body.sms_balance || 0,
            status: body.status || 'active', isAdmin: false, isCustomer: true,
            apiToken: `cust-api-${Date.now()}`,
          },
        });

        if (body.plan) {
          const plan = await db.plan.findFirst({ where: { name: body.plan } });
          if (plan) {
            await db.subscription.create({
              data: {
                uid: `sub-${Date.now()}`, userId: user.id, planId: plan.id,
                status: 'active',
                currentPeriodEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            });
          }
        }

        return NextResponse.json({ success: true, data: { id: user.id, email: user.email } });
      } catch (dbError) {
        console.warn('DB customer create failed, using demo mode:', dbError);
      }
    }

    // Demo mode
    const newCustomer = {
      id: mockCustomers.length + 1,
      uid: `c-${String(mockCustomers.length + 1).padStart(3, '0')}`,
      ...body,
      sms_balance: body.sms_balance || 0,
      status: body.status || 'active',
      joined: new Date().toISOString().split('T')[0],
      revenue: 0,
    };
    return NextResponse.json({ success: true, data: newCustomer });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
