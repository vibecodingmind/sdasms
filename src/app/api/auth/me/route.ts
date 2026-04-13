import { NextResponse } from 'next/server';
import { mockAdmin } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    user: mockAdmin,
  });
}
