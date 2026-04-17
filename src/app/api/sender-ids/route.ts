import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// POST: Create a new sender ID request for the current user
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }

    const body = await request.json();
    const { sender_id } = body;

    if (!sender_id || typeof sender_id !== 'string' || sender_id.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Sender ID is required' }, { status: 400 });
    }

    if (!/^[A-Za-z0-9]{3,11}$/.test(sender_id.trim())) {
      return NextResponse.json({ success: false, message: 'Sender ID must be 3-11 alphanumeric characters' }, { status: 400 });
    }

    // Check for duplicate
    const existing = await prisma.senderId.findFirst({
      where: {
        userId: session.userId,
        senderId: sender_id.trim().toUpperCase(),
      },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: 'This Sender ID already exists' }, { status: 409 });
    }

    const newSenderId = await prisma.senderId.create({
      data: {
        uid: uuidv4(),
        userId: session.userId,
        senderId: sender_id.trim().toUpperCase(),
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newSenderId.id,
        uid: newSenderId.uid,
        sender_id: newSenderId.senderId,
        status: newSenderId.status,
        created_at: newSenderId.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to create sender ID:', error);
    return NextResponse.json({ success: false, message: 'Failed to create sender ID' }, { status: 500 });
  }
}

// DELETE: Delete a sender ID belonging to the current user
export async function DELETE(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Sender ID is required' }, { status: 400 });
    }

    // Ensure the sender ID belongs to the current user
    const senderId = await prisma.senderId.findFirst({
      where: { id: parseInt(id, 10), userId: session.userId },
    });

    if (!senderId) {
      return NextResponse.json({ success: false, message: 'Sender ID not found' }, { status: 404 });
    }

    await prisma.senderId.delete({ where: { id: senderId.id } });

    return NextResponse.json({ success: true, message: 'Sender ID deleted successfully' });
  } catch (error) {
    console.error('Failed to delete sender ID:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete sender ID' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (statusFilter) {
      where.status = statusFilter;
    }

    const senderIds = await prisma.senderId.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    // Parse supportingCountries from JSON string and transform to match frontend interface
    const data = senderIds.map((s) => {
      let countries: string[] = [];
      if (s.supportingCountries) {
        try {
          countries = JSON.parse(s.supportingCountries);
        } catch {
          countries = [];
        }
      }

      return {
        id: s.id,
        uid: s.uid,
        sender_id: s.senderId,
        customer: s.user
          ? `${s.user.firstName} ${s.user.lastName}`
          : 'Unknown',
        customer_email: s.user?.email ?? '',
        status: s.status,
        countries,
        user: s.user
          ? {
              firstName: s.user.firstName,
              lastName: s.user.lastName,
              email: s.user.email,
            }
          : null,
        created_at: s.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch sender IDs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sender IDs' },
      { status: 500 }
    );
  }
}
