import { NextRequest, NextResponse } from 'next/server';
import { sendSms } from '@/lib/beem';

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^\+?[1-9]\d{6,14}$/.test(cleaned);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, recipients, schedule_time, source_addr } = body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (message.length > 1600) {
      return NextResponse.json(
        { success: false, error: 'Message is too long (max 1600 characters)' },
        { status: 400 }
      );
    }

    // Validate recipients
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one recipient is required' },
        { status: 400 }
      );
    }

    if (recipients.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Maximum 1000 recipients per request' },
        { status: 400 }
      );
    }

    // Validate each recipient
    const invalidNumbers: string[] = [];
    const formattedRecipients = recipients.map((r: { dest_addr: string; recipient_id?: number }, i: number) => {
      if (!r.dest_addr || !isValidPhone(r.dest_addr)) {
        invalidNumbers.push(r.dest_addr || `#${i + 1}`);
      }
      return {
        recipient_id: r.recipient_id || i + 1,
        dest_addr: r.dest_addr,
      };
    });

    // Build the request
    const smsRequest = {
      message: message.trim(),
      recipients: formattedRecipients,
      schedule_time: schedule_time || undefined,
      source_addr: source_addr || undefined,
    };

    const result = await sendSms(smsRequest);

    return NextResponse.json({
      success: result.successful,
      request_id: result.request_id,
      valid: result.valid,
      invalid: result.invalid + invalidNumbers.length,
      message: result.message,
      ...(invalidNumbers.length > 0 && { invalid_numbers: invalidNumbers }),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to send SMS';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
