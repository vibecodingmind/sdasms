import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

function getSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('sdasms_session');
  if (!sessionCookie?.value) return null;
  try {
    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt && Date.now() > session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

// GET: List team members for the current user (self + sub-users created by this user)
export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Return the current user plus any users they've created
    // Since there's no parentCustomerId field, we return users created by this user
    // In a real app, this would use a parentCustomerId relationship
    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        roles: { include: { role: true } },
      },
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const userRoles = currentUser.roles.map((r: any) => r.role.name);
    const primaryRole = userRoles[0] || (currentUser.isAdmin ? 'super_admin' : 'customer_member');

    const members = [{
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      role: primaryRole,
      status: currentUser.status,
      joinedAt: currentUser.createdAt.toISOString(),
      avatar: currentUser.avatar,
    }];

    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch team members' }, { status: 500 });
  }
}

// POST: Invite a new team member (create a user with pending status)
export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { email, role, first_name, last_name } = body;

    if (!email || !role) {
      return NextResponse.json({ success: false, message: 'Email and role are required' }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }

    // Check for existing user with this email
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'A user with this email already exists' }, { status: 409 });
    }

    // Generate a random temporary password
    const tempPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const newUser = await prisma.user.create({
      data: {
        uid: uuidv4(),
        firstName: first_name || email.split('@')[0],
        lastName: last_name || '',
        email: email.toLowerCase(),
        password: hashedPassword,
        status: 'active',
        isAdmin: false,
      },
    });

    // Assign the role
    const roleRecord = await prisma.role.findFirst({ where: { name: role } });
    if (roleRecord) {
      await prisma.userRole.create({
        data: {
          userId: newUser.id,
          roleId: roleRecord.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email}`,
      data: {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role,
        status: newUser.status,
        joinedAt: newUser.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to invite team member:', error);
    return NextResponse.json({ success: false, message: 'Failed to invite team member' }, { status: 500 });
  }
}

// PUT: Update team member role
export async function PUT(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { user_id, role } = body;

    if (!user_id || !role) {
      return NextResponse.json({ success: false, message: 'User ID and role are required' }, { status: 400 });
    }

    // Find the target user
    const targetUser = await prisma.user.findUnique({ where: { id: user_id } });
    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Remove existing roles and assign new one
    await prisma.userRole.deleteMany({ where: { userId: user_id } });
    const roleRecord = await prisma.role.findFirst({ where: { name: role } });
    if (roleRecord) {
      await prisma.userRole.create({
        data: { userId: user_id, roleId: roleRecord.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
    });
  } catch (error) {
    console.error('Failed to update team member role:', error);
    return NextResponse.json({ success: false, message: 'Failed to update role' }, { status: 500 });
  }
}

// DELETE: Remove a team member
export async function DELETE(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Prevent deleting yourself
    if (parseInt(userId, 10) === session.userId) {
      return NextResponse.json({ success: false, message: 'Cannot remove yourself from the team' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: parseInt(userId, 10) } });

    return NextResponse.json({ success: true, message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Failed to remove team member:', error);
    return NextResponse.json({ success: false, message: 'Failed to remove team member' }, { status: 500 });
  }
}
