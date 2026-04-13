import { NextRequest, NextResponse } from 'next/server';
import { mockAdmin } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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
