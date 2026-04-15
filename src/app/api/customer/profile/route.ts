import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Mock customer profile data - in production this would use auth token
  return NextResponse.json({
    success: true,
    data: {
      id: 1,
      uid: 'c-001',
      first_name: 'John',
      last_name: 'Smith',
      email: 'john@acmecorp.com',
      phone: '+1 555-0101',
      company: 'Acme Corp',
      plan: 'Enterprise',
      sms_balance: 45000,
      status: 'active',
      joined: '2024-01-15',
    },
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Mock update - in production this would update the database
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: 1,
        uid: 'c-001',
        first_name: body.first_name || 'John',
        last_name: body.last_name || 'Smith',
        email: body.email || 'john@acmecorp.com',
        phone: body.phone || '+1 555-0101',
        company: body.company || 'Acme Corp',
        plan: 'Enterprise',
        sms_balance: 45000,
        status: 'active',
        joined: '2024-01-15',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
