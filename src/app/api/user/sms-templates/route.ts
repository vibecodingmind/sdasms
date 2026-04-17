import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET: List SMS templates for current user
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }

    const templates = await prisma.smsTemplate.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });

    const data = templates.map((t) => ({
      id: t.id,
      uid: t.uid,
      title: t.title,
      message: t.message,
      status: t.status,
      created_at: t.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch SMS templates:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch SMS templates' }, { status: 500 });
  }
}

// POST: Create an SMS template
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sdasms_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie.value);

    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, message: 'Title and message are required' }, { status: 400 });
    }

    const template = await prisma.smsTemplate.create({
      data: {
        uid: uuidv4(),
        userId: session.userId,
        title,
        message,
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: template.id, uid: template.uid,
        title: template.title, message: template.message,
        status: template.status,
      },
    });
  } catch (error) {
    console.error('Failed to create SMS template:', error);
    return NextResponse.json({ success: false, message: 'Failed to create SMS template' }, { status: 500 });
  }
}
