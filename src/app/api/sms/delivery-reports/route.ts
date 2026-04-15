import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryReports } from '@/lib/beem';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dest_addr = searchParams.get('dest_addr');
    const request_id = searchParams.get('request_id');

    if (!dest_addr && !request_id) {
      return NextResponse.json(
        { success: false, error: 'At least one of dest_addr or request_id is required' },
        { status: 400 }
      );
    }

    const result = await getDeliveryReports(dest_addr || '', request_id || '');

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch delivery reports';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
