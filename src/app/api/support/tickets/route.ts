import { NextResponse } from 'next/server';

// ─── In-memory ticket store ───────────────────────────────────────
interface Ticket {
  id: string;
  uid: string;
  subject: string;
  customer: string;
  customer_email: string;
  priority: string;
  category: string;
  status: string;
  assigned_to: string | null;
  created: string;
  last_reply: string;
  messages: number;
}

const mockTickets: Ticket[] = [
  { id: 'TKT-001', uid: 'tkt-001', subject: 'Unable to send SMS to Tanzania numbers', customer: 'John Smith', customer_email: 'john@acmecorp.com', priority: 'high', category: 'SMS', status: 'open', assigned_to: 'Support Manager', created: '2025-01-15 09:30', last_reply: '2025-01-15 10:15', messages: 3 },
  { id: 'TKT-002', uid: 'tkt-002', subject: 'Billing discrepancy on last invoice', customer: 'Emma Williams', customer_email: 'emma@euromail.com', priority: 'medium', category: 'Billing', status: 'in_progress', assigned_to: 'Billing Admin', created: '2025-01-14 14:20', last_reply: '2025-01-15 08:45', messages: 5 },
  { id: 'TKT-003', uid: 'tkt-003', subject: 'API integration returning 503 errors', customer: 'James Wilson', customer_email: 'james@techfirm.com', priority: 'critical', category: 'Technical', status: 'open', assigned_to: 'Support Manager', created: '2025-01-15 11:00', last_reply: '2025-01-15 11:00', messages: 1 },
  { id: 'TKT-004', uid: 'tkt-004', subject: 'Request to increase SMS sending limit', customer: 'Tom Anderson', customer_email: 'tom@nordic.se', priority: 'low', category: 'Account', status: 'pending', assigned_to: null, created: '2025-01-13 16:30', last_reply: '2025-01-14 09:00', messages: 2 },
  { id: 'TKT-005', uid: 'tkt-005', subject: 'Sender ID verification pending for 2 weeks', customer: 'Sarah Johnson', customer_email: 'sarah@globaltech.com', priority: 'high', category: 'SMS', status: 'in_progress', assigned_to: 'Support Manager', created: '2025-01-10 08:00', last_reply: '2025-01-14 15:30', messages: 7 },
  { id: 'TKT-006', uid: 'tkt-006', subject: 'Account locked after multiple login attempts', customer: 'Michael Chen', customer_email: 'michael@asiainc.com', priority: 'critical', category: 'Account', status: 'resolved', assigned_to: 'Support Manager', created: '2025-01-12 22:15', last_reply: '2025-01-13 01:30', messages: 4 },
  { id: 'TKT-007', uid: 'tkt-007', subject: 'Payment via PayPal not reflecting in balance', customer: 'Maria Garcia', customer_email: 'maria@bizlat.com', priority: 'high', category: 'Billing', status: 'open', assigned_to: 'Billing Admin', created: '2025-01-15 07:45', last_reply: '2025-01-15 07:45', messages: 1 },
  { id: 'TKT-008', uid: 'tkt-008', subject: 'Contact group import failing with CSV upload', customer: 'David Brown', customer_email: 'david@startup.io', priority: 'medium', category: 'Technical', status: 'closed', assigned_to: 'Support Manager', created: '2025-01-08 11:00', last_reply: '2025-01-10 16:00', messages: 6 },
  { id: 'TKT-009', uid: 'tkt-009', subject: 'How to set up webhook for delivery reports', customer: 'Aisha Patel', customer_email: 'aisha@indiatech.in', priority: 'low', category: 'Integration', status: 'resolved', assigned_to: 'Support Manager', created: '2025-01-09 13:30', last_reply: '2025-01-11 10:00', messages: 3 },
  { id: 'TKT-010', uid: 'tkt-010', subject: 'Duplicate SMS messages being sent', customer: 'Lisa Martinez', customer_email: 'lisa@latamco.com', priority: 'high', category: 'SMS', status: 'in_progress', assigned_to: 'Support Manager', created: '2025-01-14 09:00', last_reply: '2025-01-15 07:00', messages: 8 },
  { id: 'TKT-011', uid: 'tkt-011', subject: 'Request for dedicated sending server', customer: 'Robert Taylor', customer_email: 'robert@mktgpro.com', priority: 'medium', category: 'General', status: 'pending', assigned_to: null, created: '2025-01-11 10:30', last_reply: '2025-01-12 14:00', messages: 2 },
  { id: 'TKT-012', uid: 'tkt-012', subject: 'Dark mode not saving preference', customer: 'Nina Kowalski', customer_email: 'nina@polandtel.pl', priority: 'low', category: 'Technical', status: 'open', assigned_to: 'Support Manager', created: '2025-01-14 16:00', last_reply: '2025-01-14 16:00', messages: 1 },
  { id: 'TKT-013', uid: 'tkt-013', subject: 'Subscription auto-renewal failed', customer: 'John Smith', customer_email: 'john@acmecorp.com', priority: 'high', category: 'Billing', status: 'resolved', assigned_to: 'Billing Admin', created: '2025-01-07 09:00', last_reply: '2025-01-08 11:30', messages: 4 },
  { id: 'TKT-014', uid: 'tkt-014', subject: 'SMS delivery reports delayed by 24 hours', customer: 'Emma Williams', customer_email: 'emma@euromail.com', priority: 'medium', category: 'Integration', status: 'open', assigned_to: 'Support Manager', created: '2025-01-15 08:00', last_reply: '2025-01-15 08:00', messages: 1 },
  { id: 'TKT-015', uid: 'tkt-015', subject: 'Feature request: bulk contact import via API', customer: 'James Wilson', customer_email: 'james@techfirm.com', priority: 'low', category: 'General', status: 'pending', assigned_to: null, created: '2025-01-13 15:00', last_reply: '2025-01-13 15:00', messages: 1 },
];

let ticketStore = [...mockTickets];

// ─── GET: Return all tickets ──────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    success: true,
    data: ticketStore,
  });
}

// ─── POST: Create a new ticket ───────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, customer, customer_email, priority, category, message } = body;

    if (!subject || !customer || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject, customer, and message are required' },
        { status: 400 }
      );
    }

    const newId = `TKT-${String(ticketStore.length + 1).padStart(3, '0')}`;
    const newTicket: Ticket = {
      id: newId,
      uid: `tkt-${ticketStore.length + 1}`,
      subject,
      customer,
      customer_email: customer_email || '',
      priority: priority || 'medium',
      category: category || 'General',
      status: 'open',
      assigned_to: null,
      created: new Date().toISOString().replace('T', ' ').slice(0, 16),
      last_reply: new Date().toISOString().replace('T', ' ').slice(0, 16),
      messages: 1,
    };

    ticketStore = [newTicket, ...ticketStore];

    return NextResponse.json({
      success: true,
      data: newTicket,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
