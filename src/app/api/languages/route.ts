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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, direction, status, isDefault, is_default } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Language name is required' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Language code is required' },
        { status: 400 }
      );
    }

    const language = await prisma.language.create({
      data: {
        name: name.trim(),
        code: code.trim(),
        direction: direction || 'LTR',
        status: status || 'active',
        isDefault: isDefault ?? is_default ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: language.id,
        name: language.name,
        code: language.code,
        direction: language.direction,
        status: language.status,
        isDefault: language.isDefault,
      },
    });
  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create language' },
      { status: 500 }
    );
  }
}
