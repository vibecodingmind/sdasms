import { NextRequest, NextResponse } from 'next/server';
import { db, isDatabaseConnected } from '@/lib/db';
import { mockAdmin, mockCustomers } from '@/lib/mock-data';
import { compare } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Try real database first
    if (isDatabaseConnected()) {
      try {
        const user = await db.user.findUnique({
          where: { email },
          include: {
            roles: { include: { role: true } },
          },
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
                id: user.id,
                uid: user.uid,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                is_admin: user.isAdmin,
                is_customer: user.isCustomer,
                avatar: user.avatar,
                status: user.status,
                sms_unit: parseFloat(user.smsUnit?.toString() || '0'),
                plan: planData?.plan?.name || null,
                roles: user.roles.map(r => r.role.name),
              },
            });
          }
        }

        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      } catch (dbError) {
        console.warn('DB auth failed, falling back to mock:', dbError);
      }
    }

    // Fallback to mock auth
    if (email === 'admin@admin.com' && password === 'password123') {
      return NextResponse.json({
        success: true,
        token: 'mock-jwt-token-admin-001',
        user: mockAdmin,
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
