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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, symbol, rate, status } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Currency name is required' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Currency code is required' },
        { status: 400 }
      );
    }

    if (!symbol || typeof symbol !== 'string' || symbol.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Currency symbol is required' },
        { status: 400 }
      );
    }

    const currency = await prisma.currency.create({
      data: {
        name: name.trim(),
        code: code.trim(),
        symbol: symbol.trim(),
        rate: rate !== undefined ? rate : 1,
        status: status || 'active',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: currency.id,
        name: currency.name,
        code: currency.code,
        symbol: currency.symbol,
        rate: currency.rate,
        status: currency.status,
      },
    });
  } catch (error) {
    console.error('Error creating currency:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create currency' },
      { status: 500 }
    );
  }
}
