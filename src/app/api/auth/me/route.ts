import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Return full user data from database based on session
export async function GET(request: NextRequest) {
  // Check session cookie first
  const sessionCookie = request.cookies.get('sdasms_session');
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
      }

      // Look up full user from DB
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          roles: { include: { role: true } },
          subscriptions: { where: { status: 'active' }, include: { plan: true }, take: 1 },
        },
      });

      if (user) {
        const userRoles = user.roles.map((r: any) => r.role.name);
        const primaryRole = userRoles[0] || (user.isAdmin ? 'super_admin' : 'customer_owner');

        return NextResponse.json({
          success: true,
          message: 'Session is valid',
          user: {
            id: user.id,
            uid: user.uid,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone: user.phone || '',
            is_admin: user.isAdmin,
            avatar: user.avatar,
            status: user.status,
            role: primaryRole,
            roles: userRoles,
            plan: user.subscriptions[0]?.plan?.name || null,
            sms_balance: parseFloat((user.smsBalance || 0).toString()),
          },
        });
      }

      // DB user not found (e.g., demo user) - return session data as-is
      return NextResponse.json({
        success: true,
        message: 'Session is valid',
        user: {
          userId: session.userId,
          uid: session.uid,
          email: session.email,
          is_admin: session.is_admin,
          role: session.role,
          roles: session.roles || [],
        },
      });
    } catch {
      // Fall through to Bearer token check
    }
  }

  // Fall back to Bearer token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const parts = token.split('_');
  if (parts.length < 3) {
    return NextResponse.json({ success: false, message: 'Invalid token format' }, { status: 401 });
  }
  const timestamp = parseInt(parts[parts.length - 1], 10);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > twentyFourHours) {
    return NextResponse.json({ success: false, message: 'Token expired' }, { status: 401 });
  }

  // Try to look up user from DB by uid
  const uid = parts[1];
  const user = await prisma.user.findUnique({
    where: { uid },
    include: {
      roles: { include: { role: true } },
      subscriptions: { where: { status: 'active' }, include: { plan: true }, take: 1 },
    },
  });

  if (user) {
    const userRoles = user.roles.map((r: any) => r.role.name);
    const primaryRole = userRoles[0] || (user.isAdmin ? 'super_admin' : 'customer_owner');
    return NextResponse.json({
      success: true,
      message: 'Session is valid',
      user: {
        id: user.id, uid: user.uid,
        first_name: user.firstName, last_name: user.lastName,
        email: user.email, phone: user.phone || '',
        is_admin: user.isAdmin, avatar: user.avatar,
        status: user.status, role: primaryRole, roles: userRoles,
        plan: user.subscriptions[0]?.plan?.name || null,
        sms_balance: parseFloat((user.smsBalance || 0).toString()),
      },
    });
  }

  return NextResponse.json({ success: true, message: 'Token is valid' });
}
