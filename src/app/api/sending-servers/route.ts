import { NextResponse } from 'next/server';
import { mockSendingServers } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: mockSendingServers });
}
