import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);

  // In demo mode, parse the token to identify the user
  // Token format: sdasms_{uid}_{timestamp} or demo-token-{uid}-{timestamp}
  const parts = token.split('_');
  if (parts.length < 3) {
    return NextResponse.json(
      { success: false, message: 'Invalid token format' },
      { status: 401 }
    );
  }

  // For demo purposes, check token expiry (24 hours)
  const timestamp = parseInt(parts[parts.length - 1], 10);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > twentyFourHours) {
    return NextResponse.json(
      { success: false, message: 'Token expired' },
      { status: 401 }
    );
  }

  // Return generic success for demo mode
  return NextResponse.json({
    success: true,
    message: 'Token is valid',
  });
}
