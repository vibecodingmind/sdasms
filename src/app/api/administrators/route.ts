import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { isAdmin: true },
      include: {
        roles: { include: { role: true } },
      },
      orderBy: { id: 'asc' },
    });

    const data = users.map((u) => ({
      id: u.id,
      uid: u.uid,
      first_name: u.firstName,
      last_name: u.lastName,
      email: u.email,
      phone: u.phone || '',
      avatar: u.avatar || null,
      status: u.status,
      role: u.roles[0]?.role?.name || 'Viewer',
      roles: u.roles.map((r) => r.role.name),
      created_at: u.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch administrators:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch administrators' },
      { status: 500 }
    );
  }
}
