import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function createSessionCookie(userData: any) {
  return {
    userId: userData.id,
    uid: userData.uid,
    email: userData.email,
    is_admin: userData.is_admin || false,
    role: userData.role || (userData.is_admin ? 'admin' : 'customer_owner'),
    roles: userData.roles || [],
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { compare } = await import('bcryptjs');

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (user.status === 'inactive') {
      return NextResponse.json(
        { success: false, message: 'Account is inactive. Contact administrator.' },
        { status: 403 }
      );
    }

    // Fetch active subscription for non-admin users
    let planName = null;
    if (!user.isAdmin) {
      const sub = await prisma.subscription.findFirst({
        where: { userId: user.id, status: 'active' },
        include: { plan: true },
      });
      planName = sub?.plan?.name || null;
    }

    const userRoles = user.roles.map((r: any) => r.role.name);
    const primaryRole = userRoles[0] || (user.isAdmin ? 'super_admin' : 'customer_owner');

    const userData = {
      id: user.id, uid: user.uid,
      first_name: user.firstName, last_name: user.lastName,
      email: user.email, phone: user.phone || '',
      is_admin: user.isAdmin,
      avatar: user.avatar, status: user.status,
      sms_balance: parseFloat(user.smsBalance?.toString() || '0'),
      plan: planName,
      role: primaryRole,
      roles: userRoles,
    };

    const session = createSessionCookie(userData);
    const response = NextResponse.json({
      success: true,
      token: `sdasms_${user.uid}_${Date.now()}`,
      user: userData,
    });

    response.cookies.set('sdasms_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
