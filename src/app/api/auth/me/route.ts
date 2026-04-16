import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check session cookie first
  const sessionCookie = request.cookies.get('sdasms_session');
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
      }
      return NextResponse.json({
        success: true,
        message: 'Session is valid',
        user: {
          userId: session.userId,
          uid: session.uid,
          email: session.email,
          is_admin: session.is_admin,
          role: session.role,
          roles: session.roles || [],
        },
      });
    } catch {
      // Fall through to Bearer token check
    }
  }

  // Fall back to Bearer token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const parts = token.split('_');
  if (parts.length < 3) {
    return NextResponse.json({ success: false, message: 'Invalid token format' }, { status: 401 });
  }
  const timestamp = parseInt(parts[parts.length - 1], 10);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > twentyFourHours) {
    return NextResponse.json({ success: false, message: 'Token expired' }, { status: 401 });
  }
  return NextResponse.json({ success: true, message: 'Token is valid' });
}
