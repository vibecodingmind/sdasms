import { NextResponse } from 'next/server';
import { mockCountries } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockCountries });
}
