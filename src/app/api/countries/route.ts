import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const countries = await prisma.country.findMany({
      where: status ? { status } : undefined,
      select: {
        id: true,
        name: true,
        code: true,
        phoneCode: true,
        status: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: countries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, phone_code, phoneCode, status } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Country name is required' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Country code is required' },
        { status: 400 }
      );
    }

    const country = await prisma.country.create({
      data: {
        name: name.trim(),
        code: code.trim(),
        phoneCode: phone_code || phoneCode || '',
        status: status || 'active',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: country.id,
        name: country.name,
        code: country.code,
        phoneCode: country.phoneCode,
        status: country.status,
      },
    });
  } catch (error) {
    console.error('Error creating country:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create country' },
      { status: 500 }
    );
  }
}
