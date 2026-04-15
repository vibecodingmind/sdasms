import { NextRequest, NextResponse } from 'next/server';
import { editSmsTemplate, deleteSmsTemplate } from '@/lib/beem';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateId = parseInt(id, 10);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid template ID' },
        { status: 400 }
      );
    }

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

    const result = await editSmsTemplate(templateId, sms_title.trim(), message.trim());

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to edit SMS template';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateId = parseInt(id, 10);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    const result = await deleteSmsTemplate(templateId);

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to delete SMS template';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
