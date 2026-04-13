import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { mockUser } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Try mock login first (demo mode)
    if (email === 'admin@admin.com' && password === 'password123') {
      const token = await createToken({
        userId: mockUser.id,
        email: mockUser.email,
        isAdmin: mockUser.isAdmin,
        isCustomer: mockUser.isCustomer,
      });

      const response = NextResponse.json({
        user: mockUser,
        token,
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    // Try database login
    try {
      const { db } = await import('@/lib/db');
      const user = await db.user.findUnique({ where: { email } });

      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const token = await createToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        isCustomer: user.isCustomer,
      });

      const response = NextResponse.json({
        user,
        token,
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    } catch {
      // DB not available
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
