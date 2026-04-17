import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const currencies = await prisma.currency.findMany({
      where: status ? { status } : undefined,
      select: {
        id: true,
        name: true,
        code: true,
        symbol: true,
        rate: true,
        status: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: currencies });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch currencies' },
      { status: 500 }
    );
  }
}
