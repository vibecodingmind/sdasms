import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseConnected } from '@/lib/db';
import { mockAdmin, mockCustomers } from '@/lib/mock-data';

// Role mapping for demo users
const emailRoleMap: Record<string, string> = {
  'admin@admin.com': 'super_admin',
  'support@admin.com': 'support_admin',
  'billing@admin.com': 'billing_admin',
  'tech@admin.com': 'technical_admin',
  'viewer@admin.com': 'viewer',
};

// Demo users (works without any database)
const demoUsers: Record<string, { password: string; user: any }> = {
  'admin@admin.com': {
    password: 'password123',
    user: { ...mockAdmin, role: 'super_admin', roles: ['super_admin'] },
  },
  'support@admin.com': {
    password: 'password123',
    user: { ...mockAdmin, id: 2, uid: 'admin-002', first_name: 'Support', last_name: 'Manager', email: 'support@admin.com', role: 'support_admin', roles: ['support_admin'] },
  },
  'billing@admin.com': {
    password: 'password123',
    user: { ...mockAdmin, id: 3, uid: 'admin-003', first_name: 'Billing', last_name: 'Admin', email: 'billing@admin.com', role: 'billing_admin', roles: ['billing_admin'] },
  },
  'tech@admin.com': {
    password: 'password123',
    user: { ...mockAdmin, id: 4, uid: 'admin-004', first_name: 'Tech', last_name: 'Lead', email: 'tech@admin.com', role: 'technical_admin', roles: ['technical_admin'], status: 'inactive' },
  },
  'john@acmecorp.com': {
    password: 'customer123',
    user: { ...mockCustomers[0], is_admin: false, role: 'customer_owner', roles: ['customer_owner'] },
  },
  'sarah@globaltech.com': {
    password: 'customer123',
    user: { ...mockCustomers[1], is_admin: false, role: 'customer_owner', roles: ['customer_owner'] },
  },
  'emma@euromail.com': {
    password: 'customer123',
    user: { ...mockCustomers[3], is_admin: false, role: 'customer_admin', roles: ['customer_admin'] },
  },
};

function createSessionCookie(userData: any) {
  const session = {
    userId: userData.id,
    uid: userData.uid,
    email: userData.email,
    is_admin: userData.is_admin || false,
    role: userData.role || (userData.is_admin ? 'admin' : 'customer_owner'),
    roles: userData.roles || [],
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  return session;
}

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
            const planData = !user.isAdmin ? await db.subscription.findFirst({
              where: { userId: user.id, status: 'active' },
              include: { plan: true },
            }) : null;

            const userRoles = user.roles.map((r: any) => r.role.name);
            const primaryRole = userRoles[0] || (user.isAdmin ? 'admin' : 'customer_owner');

            const userData = {
              id: user.id, uid: user.uid,
              first_name: user.firstName, last_name: user.lastName,
              email: user.email, is_admin: user.isAdmin,
              avatar: user.avatar, status: user.status,
              sms_balance: parseFloat(user.smsBalance?.toString() || '0'),
              plan: planData?.plan?.name || null,
              role: primaryRole,
              roles: userRoles,
            };

            const session = createSessionCookie(userData);
            const response = NextResponse.json({
              success: true,
              token: `sdasms_${user.uid}_${Date.now()}`,
              user: userData,
            });

            // Set HTTP-only session cookie for middleware auth
            response.cookies.set('sdasms_session', JSON.stringify(session), {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24,
              path: '/',
            });

            return response;
          }
        }
      } catch (dbError) {
        console.warn('DB auth failed, using demo mode:', dbError);
      }
    }

    // Demo mode - check against local user list
    const demoUser = demoUsers[email];
    if (demoUser && demoUser.password === password) {
      // Check if user status is active
      if (demoUser.user.status === 'inactive') {
        return NextResponse.json(
          { success: false, message: 'Account is inactive. Contact administrator.' },
          { status: 403 }
        );
      }

      const session = createSessionCookie(demoUser.user);
      const response = NextResponse.json({
        success: true,
        token: `sdasms_${demoUser.user.uid}_${Date.now()}`,
        user: demoUser.user,
      });

      // Set HTTP-only session cookie for middleware auth
      response.cookies.set('sdasms_session', JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
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
