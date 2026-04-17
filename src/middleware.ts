import { NextRequest, NextResponse } from 'next/server';

// ==================== API ROUTE PROTECTION MIDDLEWARE ====================
// Routes that require authentication
const PROTECTED_ROUTES = [
  '/api/customers',
  '/api/dashboard',
  '/api/administrators',
  '/api/announcements',
  '/api/subscriptions',
  '/api/invoices',
  '/api/reports',
  '/api/settings',
  '/api/sending-servers',
  '/api/sms/send',
  '/api/sms/balance',
  '/api/sms/templates',
  '/api/sms/delivery-reports',
  '/api/sms/sender-names',
  '/api/sender-ids',
  '/api/customer/profile',
  '/api/support/tickets',
  '/api/blacklists',
  '/api/countries',
  '/api/currencies',
  '/api/languages',
  '/api/plans',
  '/api/contacts',
  '/api/contact-groups',
  '/api/notifications',
  '/api/email-templates',
  '/api/payment-gateways',
  '/api/campaigns',
  '/api/user/sms-templates',
];

// Routes that require admin role
const ADMIN_ONLY_ROUTES = [
  '/api/customers',
  '/api/dashboard',
  '/api/administrators',
  '/api/announcements',
  '/api/subscriptions',
  '/api/invoices',
  '/api/reports',
  '/api/settings',
  '/api/sending-servers',
  '/api/blacklists',
  '/api/countries',
  '/api/currencies',
  '/api/languages',
  '/api/email-templates',
  '/api/payment-gateways',
];

// Routes accessible by any authenticated user (admin or customer)
const CUSTOMER_ACCESSIBLE_ROUTES = [
  '/api/customer/profile',
  '/api/sms/send',
  '/api/sms/balance',
  '/api/sms/templates',
  '/api/sms/delivery-reports',
  '/api/sms/sender-names',
  '/api/sender-ids',
  '/api/support/tickets',
  '/api/plans',
  '/api/contacts',
  '/api/contact-groups',
  '/api/notifications',
  '/api/campaigns',
  '/api/user/sms-templates',
];

// Public routes (no auth needed)
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/me',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-API routes and Next.js internals
  if (!pathname.startsWith('/api/') || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Check if this is a public route
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Extract session from cookie
  const sessionCookie = request.cookies.get('sdasms_session');
  let session = null;

  if (sessionCookie?.value) {
    try {
      session = JSON.parse(sessionCookie.value);
      // Check expiry
      if (session.expiresAt && Date.now() > session.expiresAt) {
        session = null;
      }
    } catch {
      session = null;
    }
  }

  // Fall back to Bearer token
  if (!session) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const parts = token.split('_');
      if (parts.length >= 3 && parts[0] === 'sdasms') {
        const timestamp = parseInt(parts[parts.length - 1], 10);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp <= twentyFourHours) {
          session = {
            token,
            userId: 0,
            uid: parts[1] || '',
            email: '',
            is_admin: true,
            role: 'admin',
            expiresAt: timestamp + twentyFourHours,
          };
        }
      }
    }
  }

  // No valid session
  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  // Check admin-only routes
  const isAdminRoute = ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route));
  if (isAdminRoute && !session.is_admin) {
    return NextResponse.json(
      { success: false, message: 'Admin access required' },
      { status: 403 }
    );
  }

  // Check POST/PUT/DELETE on customer-accessible routes
  // Customers should only be able to use safe methods unless explicitly allowed
  const method = request.method;
  const isCustomerRoute = CUSTOMER_ACCESSIBLE_ROUTES.some(route => pathname.startsWith(route));

  if (isCustomerRoute && !session.is_admin) {
    // Customer-specific POST routes
    const customerPostRoutes = ['/api/sms/send', '/api/sms/templates', '/api/support/tickets', '/api/customer/profile', '/api/contacts', '/api/contact-groups', '/api/campaigns', '/api/user/sms-templates'];
    const canPost = customerPostRoutes.some(route => pathname.startsWith(route));

    if (method === 'POST' && !canPost) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Customers can PUT on their own resources
    const customerPutRoutes = ['/api/customer/profile', '/api/contacts', '/api/contact-groups', '/api/user/sms-templates', '/api/campaigns'];
    const canPut = customerPutRoutes.some(route => pathname.startsWith(route));
    if (method === 'PUT' && !canPut) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Customers can DELETE their own resources
    const customerDeleteRoutes = ['/api/contacts', '/api/contact-groups', '/api/user/sms-templates', '/api/campaigns'];
    const canDelete = customerDeleteRoutes.some(route => pathname.startsWith(route));
    if (method === 'DELETE' && !canDelete) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }
  }

  // Plans POST is admin-only
  if (pathname.startsWith('/api/plans') && method === 'POST' && !session.is_admin) {
    return NextResponse.json(
      { success: false, message: 'Admin access required' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
