import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE: Delete an announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.announcement.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    console.error('Failed to delete announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}
