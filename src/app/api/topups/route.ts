import { NextResponse } from 'next/server';
import { mockTopups, mockInvoices } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const [topups, invoices] = await Promise.all([
        db.topup.findMany({ where: { userId: 1 }, orderBy: { createdAt: 'desc' } }),
        db.invoice.findMany({ where: { userId: 1 }, orderBy: { createdAt: 'desc' } }),
      ]);
      return NextResponse.json({ topups, invoices });
    } catch {
      return NextResponse.json({ topups: mockTopups, invoices: mockInvoices });
    }
  } catch {
    return NextResponse.json({ topups: mockTopups, invoices: mockInvoices });
  }
}
