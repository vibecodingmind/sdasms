import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update campaign status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);

    const { id } = await params;
    const body = await request.json();

    const campaign = await prisma.campaign.update({
      where: { id: parseInt(id) },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true, data: { id: campaign.id, status: campaign.status } });
  } catch (error) {
    console.error('Failed to update campaign:', error);
    return NextResponse.json({ success: false, message: 'Failed to update campaign' }, { status: 500 });
  }
}

// DELETE: Delete a campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.campaign.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete campaign' }, { status: 500 });
  }
}
