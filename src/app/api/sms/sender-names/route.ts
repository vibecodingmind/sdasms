import { NextRequest, NextResponse } from 'next/server';
import { getSenderNames } from '@/lib/beem';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    const status = searchParams.get('status') || undefined;

    const result = await getSenderNames(q, status);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch sender names';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
