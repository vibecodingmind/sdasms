import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Return all tickets with messages, ordered by newest first
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to match existing frontend format
    const data = tickets.map((t) => {
      const lastMsg = t.messages[t.messages.length - 1];
      return {
        id: `TKT-${String(t.id).padStart(3, '0')}`,
        uid: t.uid,
        subject: t.subject,
        customer: t.customer,
        customer_email: t.customerEmail,
        priority: t.priority,
        category: t.category,
        status: t.status,
        assigned_to: t.assignedTo,
        created: t.createdAt.toISOString().replace('T', ' ').slice(0, 16),
        last_reply: lastMsg
          ? lastMsg.createdAt.toISOString().replace('T', ' ').slice(0, 16)
          : t.createdAt.toISOString().replace('T', ' ').slice(0, 16),
        messages: t.messages.length,
        // Include full message details for ticket detail view
        message_list: t.messages.map((m) => ({
          id: m.id,
          uid: m.uid,
          sender: m.sender,
          message: m.message,
          created_at: m.createdAt.toISOString(),
        })),
        user: t.user
          ? {
              first_name: t.user.firstName,
              last_name: t.user.lastName,
              email: t.user.email,
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST: Create a new ticket with first message OR add a reply to an existing ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionCookie = request.cookies.get('sdasms_session');
    let userId: number | undefined;

    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(sessionCookie.value);
        if (!session.expiresAt || Date.now() <= session.expiresAt) {
          userId = session.userId;
        }
      } catch {
        // Ignore cookie parse errors
      }
    }

    // If ticket_id is provided, this is a reply to an existing ticket
    if (body.ticket_id) {
      if (!body.message) {
        return NextResponse.json(
          { success: false, error: 'Message is required' },
          { status: 400 }
        );
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id: body.ticket_id },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
        );
      }

      const senderName = ticket.user
        ? `${ticket.user.firstName} ${ticket.user.lastName}`
        : 'Unknown User';

      const msg = await prisma.ticketMessage.create({
        data: {
          uid: `tkt-msg-${ticket.id}-${Date.now()}`,
          ticketId: ticket.id,
          sender: senderName,
          message: body.message,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: msg.id,
          uid: msg.uid,
          sender: msg.sender,
          message: msg.message,
          created_at: msg.createdAt.toISOString(),
        },
      });
    }

    // Otherwise, create a new ticket
    const { subject, message, priority, category } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Look up user to get name/email for the ticket
    let customerName = 'Unknown User';
    let customerEmail = '';

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, email: true },
      });
      if (user) {
        customerName = `${user.firstName} ${user.lastName}`;
        customerEmail = user.email;
      }
    }

    // Create ticket + first message in a transaction
    const newTicket = await prisma.$transaction(async (tx) => {
      // Determine next ticket ID for display
      const ticketCount = await tx.ticket.count();
      const ticketId = ticketCount + 1;

      const ticket = await tx.ticket.create({
        data: {
          uid: `tkt-${ticketId}`,
          userId: userId || 0,
          subject,
          customer: customerName,
          customerEmail: customerEmail,
          priority: priority || 'medium',
          category: category || 'general',
          status: 'open',
        },
        include: {
          messages: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      const msg = await tx.ticketMessage.create({
        data: {
          uid: `tkt-msg-${ticketId}-${Date.now()}`,
          ticketId: ticket.id,
          sender: customerName,
          message,
        },
      });

      return {
        ...ticket,
        messages: [msg],
      };
    });

    // Format response to match frontend format
    const data = {
      id: `TKT-${String(newTicket.id).padStart(3, '0')}`,
      uid: newTicket.uid,
      subject: newTicket.subject,
      customer: newTicket.customer,
      customer_email: newTicket.customerEmail,
      priority: newTicket.priority,
      category: newTicket.category,
      status: newTicket.status,
      assigned_to: newTicket.assignedTo,
      created: newTicket.createdAt.toISOString().replace('T', ' ').slice(0, 16),
      last_reply: newTicket.createdAt.toISOString().replace('T', ' ').slice(0, 16),
      messages: newTicket.messages.length,
      message_list: newTicket.messages.map((m) => ({
        id: m.id,
        uid: m.uid,
        sender: m.sender,
        message: m.message,
        created_at: m.createdAt.toISOString(),
      })),
      user: newTicket.user
        ? {
            first_name: newTicket.user.firstName,
            last_name: newTicket.user.lastName,
            email: newTicket.user.email,
          }
        : null,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to create ticket/reply:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// PUT: Update ticket status (e.g., close a ticket)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticket_id, status } = body;

    if (!ticket_id || !status) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['open', 'in_progress', 'pending', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updated = await prisma.ticket.update({
      where: { id: ticket_id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      data: {
        id: updated.id,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error('Failed to update ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 400 }
    );
  }
}
