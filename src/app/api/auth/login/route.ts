import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseConnected } from '@/lib/db';
import { mockAdmin, mockCustomers } from '@/lib/mock-data';

// Demo users (works without any database)
const demoUsers: Record<string, { password: string; user: any }> = {
  'admin@admin.com': {
    password: 'password123',
    user: mockAdmin,
  },
  'support@admin.com': {
    password: 'password123',
    user: { ...mockAdmin, id: 2, uid: 'admin-002', first_name: 'Support', last_name: 'Manager', email: 'support@admin.com' },
  },
  'billing@admin.com': {
    password: 'password123',
    user: { ...mockAdmin, id: 3, uid: 'admin-003', first_name: 'Billing', last_name: 'Admin', email: 'billing@admin.com' },
  },
  'john@acmecorp.com': {
    password: 'customer123',
    user: { ...mockCustomers[0], is_admin: false, is_customer: true },
  },
  'sarah@globaltech.com': {
    password: 'customer123',
    user: { ...mockCustomers[1], is_admin: false, is_customer: true },
  },
  'emma@euromail.com': {
    password: 'customer123',
    user: { ...mockCustomers[3], is_admin: false, is_customer: true },
  },
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Try real database first
    if (isDatabaseConnected()) {
      try {
        const { compare } = await import('bcryptjs');
        const { getDb } = await import('@/lib/db');
        const db = await getDb();

        const user = await db.user.findUnique({
          where: { email },
          include: { roles: { include: { role: true } } },
        });

        if (user) {
          const isValid = await compare(password, user.password);
          if (isValid) {
            const planData = user.isCustomer ? await db.subscription.findFirst({
              where: { userId: user.id, status: 'active' },
              include: { plan: true },
            }) : null;

            return NextResponse.json({
              success: true,
              token: `jwt-${user.uid}-${Date.now()}`,
              user: {
                id: user.id, uid: user.uid,
                first_name: user.firstName, last_name: user.lastName,
                email: user.email, is_admin: user.isAdmin, is_customer: user.isCustomer,
                avatar: user.avatar, status: user.status,
                sms_unit: parseFloat(user.smsUnit?.toString() || '0'),
                plan: planData?.plan?.name || null,
                roles: user.roles.map((r: any) => r.role.name),
              },
            });
          }
        }
      } catch (dbError) {
        console.warn('DB auth failed, using demo mode:', dbError);
      }
    }

    // Demo mode - check against local user list
    const demoUser = demoUsers[email];
    if (demoUser && demoUser.password === password) {
      return NextResponse.json({
        success: true,
        token: `demo-token-${demoUser.user.uid}-${Date.now()}`,
        user: demoUser.user,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
