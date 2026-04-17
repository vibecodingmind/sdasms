import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const languages = await prisma.language.findMany({
      where: status ? { status } : undefined,
      select: {
        id: true,
        name: true,
        code: true,
        direction: true,
        status: true,
        isDefault: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: languages });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}
