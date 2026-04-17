import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Return current user's profile from session
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return NextResponse.json(
        { success: false, message: 'Session expired' },
        { status: 401 }
      );
    }

    const userId = session.userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        uid: user.uid,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phone || '',
        plan: user.subscriptions[0]?.plan?.name || null,
        sms_balance: parseFloat((user.smsBalance || 0).toString()),
        status: user.status,
        avatar: user.avatar || null,
        joined: user.createdAt.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Failed to fetch customer profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT: Update current user's profile fields
export async function PUT(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return NextResponse.json(
        { success: false, message: 'Session expired' },
        { status: 401 }
      );
    }

    const userId = session.userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Build update data — only allow specific fields
    const updateData: Record<string, string> = {};
    if (body.first_name !== undefined) updateData.firstName = body.first_name;
    if (body.last_name !== undefined) updateData.lastName = body.last_name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        uid: updatedUser.uid,
        first_name: updatedUser.firstName,
        last_name: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        plan: updatedUser.subscriptions[0]?.plan?.name || null,
        sms_balance: parseFloat((updatedUser.smsBalance || 0).toString()),
        status: updatedUser.status,
        avatar: updatedUser.avatar || null,
        joined: updatedUser.createdAt.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Failed to update customer profile:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
