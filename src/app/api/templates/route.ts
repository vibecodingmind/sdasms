import { NextRequest, NextResponse } from 'next/server';
import { mockTemplates } from '@/lib/mock-data';

export async function GET() {
  try {
    try {
      const { db } = await import('@/lib/db');
      const templates = await db.template.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(templates);
    } catch {
      return NextResponse.json(mockTemplates);
    }
  } catch {
    return NextResponse.json(mockTemplates);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message, dltTemplateId } = body;

    try {
      const { db } = await import('@/lib/db');
      const template = await db.template.create({
        data: { uid: crypto.randomUUID(), name, message, userId: 1, status: 'active' },
      });
      return NextResponse.json(template, { status: 201 });
    } catch {
      const template = { id: mockTemplates.length + 1, uid: crypto.randomUUID(), userId: 1, name, message, status: 'active', dltTemplateId: dltTemplateId || null, createdAt: new Date().toISOString() };
      return NextResponse.json(template, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
