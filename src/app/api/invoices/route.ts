import { NextResponse } from 'next/server';
import { mockInvoices } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockInvoices });
}
