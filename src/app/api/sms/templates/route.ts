import { NextRequest, NextResponse } from 'next/server';
import { getSmsTemplates, addSmsTemplate } from '@/lib/beem';

export async function GET() {
  try {
    const result = await getSmsTemplates();
    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch SMS templates';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sms_title, message } = body;

    if (!sms_title || typeof sms_title !== 'string' || sms_title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Template title is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Template message is required' },
        { status: 400 }
      );
    }

    const result = await addSmsTemplate(sms_title.trim(), message.trim());

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create SMS template';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
