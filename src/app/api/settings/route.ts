import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Return all settings as a flat object keyed by setting key
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();

    // Convert array of { key, value } into a flat object
    const data: Record<string, string> = {};
    for (const s of settings) {
      data[s.key] = s.value;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT: Update settings — body is a flat object of key-value pairs
export async function PUT(request: NextRequest) {
  try {
    const body: Record<string, string> = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Upsert each key-value pair
    for (const [key, value] of Object.entries(body)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    // Return updated settings
    const settings = await prisma.setting.findMany();
    const data: Record<string, string> = {};
    for (const s of settings) {
      data[s.key] = s.value;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
