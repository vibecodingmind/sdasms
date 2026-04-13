import { NextResponse } from 'next/server';
import { mockSmsHistory, mockCampaigns, mockReportStats, mockSmsTrend, mockDeliveryBreakdown } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'campaigns') {
    return NextResponse.json({ success: true, data: mockCampaigns });
  }

  return NextResponse.json({
    success: true,
    data: {
      smsHistory: mockSmsHistory,
      campaigns: mockCampaigns,
      stats: mockReportStats,
      smsTrend: mockSmsTrend,
      deliveryBreakdown: mockDeliveryBreakdown,
    },
  });
}
