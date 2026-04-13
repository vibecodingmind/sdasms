import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    try {
      const { db } = await import('@/lib/db');
      const existingUser = await db.user.findUnique({ where: { email } });

      if (existingUser) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.user.create({
        data: {
          uid: crypto.randomUUID(),
          firstName,
          lastName,
          email,
          password: hashedPassword,
          status: 'active',
          isCustomer: true,
          smsUnit: 100, // Free trial credits
        },
      });

      const token = await createToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        isCustomer: user.isCustomer,
      });

      const response = NextResponse.json({ user, token }, { status: 201 });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    } catch {
      return NextResponse.json(
        { error: 'Registration unavailable in demo mode' },
        { status: 503 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
