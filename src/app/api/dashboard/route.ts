import { NextResponse } from 'next/server';
import { mockDashboardStats, mockRevenueData, mockRecentOrders, mockTopCustomers, mockSystemOverview } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      stats: mockDashboardStats,
      revenueData: mockRevenueData,
      recentOrders: mockRecentOrders,
      topCustomers: mockTopCustomers,
      systemOverview: mockSystemOverview,
    },
  });
}
