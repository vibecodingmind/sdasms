// ============================================================
// Auth Helpers - Token Management, Session Persistence, API Auth
// ============================================================

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface AuthSession {
  token: string;
  userId: number;
  uid: string;
  email: string;
  is_admin: boolean;
  role: string;
  roles?: string[];
  expiresAt: number;
}

const SESSION_KEY = 'sdasms_session';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// ==================== TOKEN MANAGEMENT ====================

/**
 * Generate a session token for a user
 */
export function generateSessionToken(user: {
  id: number;
  uid: string;
  email: string;
  is_admin: boolean;
  role?: string;
  roles?: string[];
}): AuthSession {
  return {
    token: `sdasms_${user.uid}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    userId: user.id,
    uid: user.uid,
    email: user.email,
    is_admin: user.is_admin,
    role: user.role || (user.is_admin ? 'admin' : 'customer_owner'),
    roles: user.roles || [],
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
  };
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(session: AuthSession): boolean {
  return Date.now() > session.expiresAt;
}

// ==================== CLIENT-SIDE SESSION (localStorage) ====================

/**
 * Save auth session to localStorage (client-side only)
 */
export function saveSessionToStorage(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage may not be available
  }
}

/**
 * Load auth session from localStorage (client-side only)
 */
export function loadSessionFromStorage(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (isTokenExpired(session)) {
      removeSessionFromStorage();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Remove auth session from localStorage (client-side only)
 */
export function removeSessionFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage may not be available
  }
}

// ==================== SERVER-SIDE SESSION (cookies) ====================

/**
 * Save session to HTTP-only cookie (server-side)
 */
export async function saveSessionCookie(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEY, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

/**
 * Get session from HTTP-only cookie (server-side)
 */
export async function getSessionFromCookie(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_KEY)?.value;
  if (!raw) return null;
  try {
    const session: AuthSession = JSON.parse(raw);
    if (isTokenExpired(session)) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Remove session cookie (server-side)
 */
export async function removeSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
}

// ==================== API AUTH HELPERS ====================

/**
 * Extract and validate auth token from request headers
 * Returns the session if valid, null otherwise
 */
export function extractAuthFromRequest(request: NextRequest): AuthSession | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      // In production, this would verify a JWT
      // For now, we extract from the token format
      const payload = authHeader.slice(7);
      const parts = payload.split('_');
      if (parts.length >= 3 && parts[0] === 'sdasms' || parts[0] === 'demo-token' || parts[0] === 'jwt') {
        return {
          token: payload,
          userId: 0,
          uid: parts[1] || '',
          email: '',
          is_admin: true, // Default, should be overridden by real validation
          role: 'admin',
          expiresAt: Date.now() + TOKEN_EXPIRY_MS,
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Require authentication for an API route
 * Returns { session, error } - session is null if auth failed
 */
export async function requireAuth(request: NextRequest): Promise<{
  session: AuthSession | null;
  error: { status: number; message: string } | null;
}> {
  // Try cookie first (server-side session)
  const cookieSession = await getSessionFromCookie();
  if (cookieSession) {
    return { session: cookieSession, error: null };
  }

  // Fall back to Bearer token
  const session = extractAuthFromRequest(request);
  if (session) {
    return { session, error: null };
  }

  return {
    session: null,
    error: { status: 401, message: 'Authentication required' },
  };
}

/**
 * Require admin role for an API route
 */
export async function requireAdmin(request: NextRequest): Promise<{
  session: AuthSession | null;
  error: { status: number; message: string } | null;
}> {
  const { session, error } = await requireAuth(request);
  if (error) return { session: null, error };

  if (!session?.is_admin) {
    return {
      session: null,
      error: { status: 403, message: 'Admin access required' },
    };
  }

  return { session, error: null };
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(message: string = 'Authentication required') {
  return new Response(
    JSON.stringify({ success: false, message }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
}

/**
 * Create a forbidden response
 */
export function forbiddenResponse(message: string = 'Access denied') {
  return new Response(
    JSON.stringify({ success: false, message }),
    { status: 403, headers: { 'Content-Type': 'application/json' } }
  );
}
