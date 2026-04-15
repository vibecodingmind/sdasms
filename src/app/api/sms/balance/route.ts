import { NextResponse } from 'next/server';
import { checkBalance } from '@/lib/beem';

export async function GET() {
  try {
    const result = await checkBalance();
    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch balance';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
