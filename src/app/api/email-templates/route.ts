import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET: List all email templates (admin)
export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const data = templates.map((t) => ({
      id: t.id,
      uid: t.uid,
      name: t.name,
      subject: t.subject,
      type: t.type,
      body: t.body,
      status: t.status,
      created_at: t.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch email templates:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch email templates' }, { status: 500 });
  }
}

// POST: Create an email template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, type, body: templateBody, status } = body;

    if (!name || !subject || !type || !templateBody) {
      return NextResponse.json(
        { success: false, message: 'Name, subject, type, and body are required' },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.create({
      data: {
        uid: uuidv4(),
        name, subject, type,
        body: templateBody,
        status: status || 'active',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: template.id, uid: template.uid, name: template.name,
        subject: template.subject, type: template.type,
        body: template.body, status: template.status,
      },
    });
  } catch (error) {
    console.error('Failed to create email template:', error);
    return NextResponse.json({ success: false, message: 'Failed to create email template' }, { status: 500 });
  }
}
