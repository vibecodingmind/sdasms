import { NextResponse } from 'next/server';
import { mockAdministrators } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockAdministrators });
}
