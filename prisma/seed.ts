import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('=== SDASMS Database Seeding Started ===\n');

  // ==================== ROLES ====================
  console.log('Seeding roles...');
  const superAdminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: { name: 'Super Admin', status: 'active' },
    create: { id: 1, uid: 'role-001', name: 'Super Admin', status: 'active' },
  });
  const supportAdminRole = await prisma.role.upsert({
    where: { id: 2 },
    update: { name: 'Support Admin', status: 'active' },
    create: { id: 2, uid: 'role-002', name: 'Support Admin', status: 'active' },
  });
  const billingAdminRole = await prisma.role.upsert({
    where: { id: 3 },
    update: { name: 'Billing Admin', status: 'active' },
    create: { id: 3, uid: 'role-003', name: 'Billing Admin', status: 'active' },
  });
  const techAdminRole = await prisma.role.upsert({
    where: { id: 4 },
    update: { name: 'Technical Admin', status: 'active' },
    create: { id: 4, uid: 'role-004', name: 'Technical Admin', status: 'active' },
  });
  const viewerRole = await prisma.role.upsert({
    where: { id: 5 },
    update: { name: 'Viewer', status: 'active' },
    create: { id: 5, uid: 'role-005', name: 'Viewer', status: 'active' },
  });
  console.log(`  Created 5 roles`);

  // ==================== PLANS ====================
  console.log('Seeding plans...');
  const starterPlan = await prisma.plan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1, uid: 'plan-001', name: 'Starter', price: 49.99, billingCycle: 'monthly',
      options: JSON.stringify({ sms: '5,000', contacts: '1,000', groups: '5', sender_ids: '1', templates: '10' }),
      status: 'active', isDlt: false, coverage: null, creditPrice: 0.01,
    },
  });
  const businessPlan = await prisma.plan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2, uid: 'plan-002', name: 'Business', price: 199.99, billingCycle: 'monthly',
      options: JSON.stringify({ sms: '50,000', contacts: '25,000', groups: '25', sender_ids: '5', templates: '50', api_access: true }),
      status: 'active', isDlt: false, coverage: null, creditPrice: 0.008,
    },
  });
  const enterprisePlan = await prisma.plan.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3, uid: 'plan-003', name: 'Enterprise', price: 499.99, billingCycle: 'monthly',
      options: JSON.stringify({ sms: 'Unlimited', contacts: 'Unlimited', groups: 'Unlimited', sender_ids: '25', templates: 'Unlimited', api_access: true, priority_support: true, dedicated_server: true }),
      status: 'active', isDlt: false, coverage: null, creditPrice: 0.005,
    },
  });
  console.log(`  Created 3 plans`);

  // ==================== ADMINS ====================
  console.log('Seeding admin users...');
  const adminPassword = await hash('password123', 12);
  const superAdmin = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1, uid: 'admin-001', firstName: 'Super', lastName: 'Admin',
      email: 'admin@admin.com', password: adminPassword,
      status: 'active', smsUnit: 999999, isAdmin: true, isCustomer: false,
      apiToken: 'admin-api-token-001', locale: 'en', timezone: 'UTC',
    },
  });
  const supportAdmin = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2, uid: 'admin-002', firstName: 'Support', lastName: 'Manager',
      email: 'support@admin.com', password: adminPassword,
      status: 'active', smsUnit: 0, isAdmin: true, isCustomer: false,
      apiToken: 'admin-api-token-002', locale: 'en', timezone: 'UTC',
    },
  });
  const billingAdmin = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3, uid: 'admin-003', firstName: 'Billing', lastName: 'Admin',
      email: 'billing@admin.com', password: adminPassword,
      status: 'active', smsUnit: 0, isAdmin: true, isCustomer: false,
      apiToken: 'admin-api-token-003', locale: 'en', timezone: 'UTC',
    },
  });
  const techAdmin = await prisma.user.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4, uid: 'admin-004', firstName: 'Tech', lastName: 'Lead',
      email: 'tech@admin.com', password: adminPassword,
      status: 'inactive', smsUnit: 0, isAdmin: true, isCustomer: false,
      apiToken: 'admin-api-token-004', locale: 'en', timezone: 'UTC',
    },
  });

  // Assign roles
  await prisma.roleUser.upsert({ where: { userId_roleId: { userId: 1, roleId: 1 } }, update: {}, create: { userId: 1, roleId: 1 } });
  await prisma.roleUser.upsert({ where: { userId_roleId: { userId: 2, roleId: 2 } }, update: {}, create: { userId: 2, roleId: 2 } });
  await prisma.roleUser.upsert({ where: { userId_roleId: { userId: 3, roleId: 3 } }, update: {}, create: { userId: 3, roleId: 3 } });
  await prisma.roleUser.upsert({ where: { userId_roleId: { userId: 4, roleId: 4 } }, update: {}, create: { userId: 4, roleId: 4 } });
  console.log(`  Created 4 admin users with role assignments`);

  // ==================== CUSTOMERS ====================
  console.log('Seeding customers...');
  const customerPassword = await hash('customer123', 12);
  const customerData = [
    { id: 10, uid: 'c-001', first: 'John', last: 'Smith', email: 'john@acmecorp.com', phone: '+1 555-0101', planId: 3, sms: 45000, status: 'active', joined: '2024-01-15' },
    { id: 11, uid: 'c-002', first: 'Sarah', last: 'Johnson', email: 'sarah@globaltech.com', phone: '+1 555-0102', planId: 2, sms: 22000, status: 'active', joined: '2024-02-20' },
    { id: 12, uid: 'c-003', first: 'Michael', last: 'Chen', email: 'michael@asiainc.com', phone: '+86 138-0001', planId: 1, sms: 5600, status: 'active', joined: '2024-03-10' },
    { id: 13, uid: 'c-004', first: 'Emma', last: 'Williams', email: 'emma@euromail.com', phone: '+44 7700-0401', planId: 3, sms: 67000, status: 'active', joined: '2024-01-05' },
    { id: 14, uid: 'c-005', first: 'David', last: 'Brown', email: 'david@startup.io', phone: '+1 555-0105', planId: 2, sms: 12000, status: 'inactive', joined: '2024-04-18' },
    { id: 15, uid: 'c-006', first: 'Lisa', last: 'Martinez', email: 'lisa@latamco.com', phone: '+52 55-0106', planId: 1, sms: 800, status: 'active', joined: '2024-05-22' },
    { id: 16, uid: 'c-007', first: 'James', last: 'Wilson', email: 'james@techfirm.com', phone: '+1 555-0107', planId: 3, sms: 91000, status: 'active', joined: '2023-11-30' },
    { id: 17, uid: 'c-008', first: 'Aisha', last: 'Patel', email: 'aisha@indiatech.in', phone: '+91 9876-0801', planId: 2, sms: 18500, status: 'active', joined: '2024-06-01' },
    { id: 18, uid: 'c-009', first: 'Robert', last: 'Taylor', email: 'robert@mktgpro.com', phone: '+1 555-0109', planId: 1, sms: 3200, status: 'inactive', joined: '2024-07-15' },
    { id: 19, uid: 'c-010', first: 'Maria', last: 'Garcia', email: 'maria@bizlat.com', phone: '+34 600-1010', planId: 2, sms: 15000, status: 'active', joined: '2024-03-25' },
    { id: 20, uid: 'c-011', first: 'Tom', last: 'Anderson', email: 'tom@nordic.se', phone: '+46 70-1011', planId: 3, sms: 55000, status: 'active', joined: '2024-02-14' },
    { id: 21, uid: 'c-012', first: 'Nina', last: 'Kowalski', email: 'nina@polandtel.pl', phone: '+48 500-1012', planId: 1, sms: 1000, status: 'active', joined: '2024-08-01' },
  ];

  for (const c of customerData) {
    await prisma.user.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id, uid: c.uid, firstName: c.first, lastName: c.last,
        email: c.email, password: customerPassword, status: c.status,
        smsUnit: c.sms, isAdmin: false, isCustomer: true,
        apiToken: `cust-api-${c.uid}`, locale: 'en', timezone: 'UTC',
      },
    });
  }
  console.log(`  Created ${customerData.length} customer users`);

  // ==================== SUBSCRIPTIONS ====================
  console.log('Seeding subscriptions...');
  const subscriptionData = [
    { userId: 10, planId: 3, status: 'active', start: '2024-01-15', end: '2025-01-15' },
    { userId: 11, planId: 2, status: 'active', start: '2024-02-20', end: '2025-02-20' },
    { userId: 12, planId: 1, status: 'expired', start: '2024-03-10', end: '2024-06-10' },
    { userId: 13, planId: 3, status: 'active', start: '2024-01-05', end: '2025-01-05' },
    { userId: 14, planId: 2, status: 'expired', start: '2024-04-18', end: '2024-10-18' },
    { userId: 15, planId: 1, status: 'active', start: '2024-05-22', end: '2025-05-22' },
    { userId: 16, planId: 3, status: 'active', start: '2023-11-30', end: '2024-11-30' },
    { userId: 17, planId: 2, status: 'active', start: '2024-06-01', end: '2025-06-01' },
    { userId: 18, planId: 1, status: 'cancelled', start: '2024-07-15', end: '2024-07-15' },
    { userId: 19, planId: 2, status: 'active', start: '2024-03-25', end: '2025-03-25' },
    { userId: 20, planId: 3, status: 'active', start: '2024-02-14', end: '2025-02-14' },
  ];
  for (let i = 0; i < subscriptionData.length; i++) {
    const s = subscriptionData[i];
    await prisma.subscription.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1, uid: `sub-${String(i + 1).padStart(3, '0')}`,
        userId: s.userId, planId: s.planId, status: s.status,
        currentPeriodEndsAt: new Date(s.end),
      },
    });
  }
  console.log(`  Created ${subscriptionData.length} subscriptions`);

  // ==================== SENDING SERVERS ====================
  console.log('Seeding sending servers...');
  const serverData = [
    { id: 1, uid: 'srv-001', userId: 1, name: 'Twilio HTTP Gateway', type: 'http', quota: 100000, status: 'active', settings: { url: 'https://api.twilio.com', api_key: '****' } },
    { id: 2, uid: 'srv-002', userId: 1, name: 'Nexmo SMPP Server', type: 'smpp', quota: 500000, status: 'active', settings: { host: 'smpp.nexmo.com', port: 2775 } },
    { id: 3, uid: 'srv-003', userId: 1, name: 'WhatsApp Business API', type: 'whatsapp', quota: 50000, status: 'active', settings: { phone_id: '+1234567890', token: '****' } },
    { id: 4, uid: 'srv-004', userId: 1, name: 'Viber Business Channel', type: 'viber', quota: 25000, status: 'inactive', settings: { webhook: 'https://...' } },
    { id: 5, uid: 'srv-005', userId: 1, name: 'MSG91 OTP Server', type: 'otp', quota: 200000, status: 'active', settings: { auth_key: '****' } },
    { id: 6, uid: 'srv-006', userId: 1, name: 'Plivo HTTP API', type: 'http', quota: 75000, status: 'active', settings: { auth_id: '****', auth_token: '****' } },
  ];
  for (const s of serverData) {
    await prisma.sendingServer.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id, uid: s.uid, userId: s.userId, name: s.name,
        type: s.type, quotaValue: s.quota, status: s.status,
        settings: JSON.stringify(s.settings), smsPerRequest: 100,
      },
    });
  }
  console.log(`  Created ${serverData.length} sending servers`);

  // ==================== SENDER IDs ====================
  console.log('Seeding sender IDs...');
  const senderIdData = [
    { userId: 10, sid: 'ACMECORP', status: 'active', countries: ['US', 'CA', 'UK'] },
    { userId: 11, sid: 'GLOBALTECH', status: 'active', countries: ['US', 'UK'] },
    { userId: 12, sid: 'ASIATICK', status: 'pending', countries: ['IN', 'SG'] },
    { userId: 13, sid: 'EUROMAIL', status: 'active', countries: ['DE', 'FR', 'ES', 'IT'] },
    { userId: 14, sid: 'STARTUP1', status: 'inactive', countries: ['US'] },
    { userId: 15, sid: 'LATAMCO', status: 'pending', countries: ['MX', 'CO', 'AR'] },
    { userId: 16, sid: 'TECHFRM', status: 'active', countries: ['US', 'CA', 'UK', 'AU'] },
    { userId: 18, sid: 'MKTGPRO', status: 'active', countries: ['US'] },
  ];
  for (let i = 0; i < senderIdData.length; i++) {
    const s = senderIdData[i];
    await prisma.senderId.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1, uid: `sid-${String(i + 1).padStart(3, '0')}`,
        userId: s.userId, senderId: s.sid, status: s.status,
        supportingCountries: JSON.stringify(s.countries),
      },
    });
  }
  console.log(`  Created ${senderIdData.length} sender IDs`);

  // ==================== CONTACT GROUPS ====================
  console.log('Seeding contact groups...');
  const groupData = [
    { userId: 10, name: 'VIP Customers' }, { userId: 10, name: 'Newsletter Subscribers' },
    { userId: 11, name: 'Enterprise Clients' }, { userId: 11, name: 'Trial Users' },
    { userId: 13, name: 'EU Partners' }, { userId: 13, name: 'Marketing List' },
    { userId: 16, name: 'All Contacts' }, { userId: 16, name: 'Active Users' },
    { userId: 17, name: 'India Market' }, { userId: 20, name: 'Scandinavia' },
  ];
  for (let i = 0; i < groupData.length; i++) {
    const g = groupData[i];
    await prisma.contactGroup.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1, uid: `grp-${String(i + 1).padStart(3, '0')}`,
        userId: g.userId, name: g.name, status: 'active',
      },
    });
  }
  console.log(`  Created ${groupData.length} contact groups`);

  // ==================== CONTACTS ====================
  console.log('Seeding contacts...');
  const contactData = [
    { userId: 10, groupId: 1, phone: '+1 555-1001', first: 'Alice', last: 'Wonder', email: 'alice@example.com' },
    { userId: 10, groupId: 1, phone: '+1 555-1002', first: 'Bob', last: 'Builder', email: 'bob@example.com' },
    { userId: 10, groupId: 2, phone: '+1 555-2001', first: 'Charlie', last: 'Brown', email: 'charlie@example.com' },
    { userId: 10, groupId: 2, phone: '+1 555-2002', first: 'Diana', last: 'Prince', email: 'diana@example.com' },
    { userId: 11, groupId: 3, phone: '+1 555-3001', first: 'Edward', last: 'Norton', email: 'edward@example.com' },
    { userId: 11, groupId: 4, phone: '+1 555-4001', first: 'Fiona', last: 'Apple', email: 'fiona@example.com' },
    { userId: 13, groupId: 5, phone: '+49 151-5001', first: 'Gunter', last: 'Schmidt', email: 'gunter@example.de' },
    { userId: 13, groupId: 6, phone: '+33 600-5002', first: 'Henri', last: 'Dupont', email: 'henri@example.fr' },
    { userId: 16, groupId: 7, phone: '+1 555-6001', first: 'Ivan', last: 'Petrov', email: 'ivan@example.com' },
    { userId: 16, groupId: 8, phone: '+1 555-6002', first: 'Julia', last: 'Roberts', email: 'julia@example.com' },
    { userId: 17, groupId: 9, phone: '+91 9876-7001', first: 'Kiran', last: 'Rao', email: 'kiran@example.in' },
    { userId: 20, groupId: 10, phone: '+46 70-8001', first: 'Lars', last: 'Johansson', email: 'lars@example.se' },
  ];
  for (let i = 0; i < contactData.length; i++) {
    const c = contactData[i];
    await prisma.contact.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1, uid: `cnt-${String(i + 1).padStart(3, '0')}`,
        userId: c.userId, groupId: c.groupId, phone: c.phone,
        firstName: c.first, lastName: c.last, email: c.email,
        status: 'subscribed',
      },
    });
  }
  console.log(`  Created ${contactData.length} contacts`);

  // ==================== TEMPLATES ====================
  console.log('Seeding templates...');
  const templateData = [
    { userId: 10, name: 'Welcome Message', message: 'Welcome to ACME Corp! Your account has been activated.' },
    { userId: 10, name: 'Order Confirmation', message: 'Hi {{name}}, your order #{{order_id}} has been confirmed.' },
    { userId: 11, name: 'Meeting Reminder', message: 'Reminder: You have a meeting scheduled at {{time}} on {{date}}.' },
    { userId: 13, name: 'Promo Alert', message: 'Hello {{name}}, check out our latest offers at {{link}}!' },
    { userId: 16, name: 'Security Alert', message: 'Hi {{name}}, a new login was detected from {{ip}}.' },
    { userId: 16, name: 'Delivery Update', message: 'Your package #{{tracking_id}} is out for delivery.' },
  ];
  for (let i = 0; i < templateData.length; i++) {
    const t = templateData[i];
    await prisma.template.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1, uid: `tpl-${String(i + 1).padStart(3, '0')}`,
        userId: t.userId, name: t.name, message: t.message, status: 'active',
      },
    });
  }
  console.log(`  Created ${templateData.length} templates`);

  // ==================== CAMPAIGNS ====================
  console.log('Seeding campaigns...');
  const campaignData = [
    { userId: 10, name: 'January Promo', message: 'New Year Sale! 30% off everything.', status: 'completed' },
    { userId: 11, name: 'Flash Sale Alert', message: 'Flash sale starts NOW! 50% off for the next 24 hours.', status: 'completed' },
    { userId: 13, name: 'Welcome Series', message: 'Welcome to EuroMail! Here is your getting started guide.', status: 'active' },
    { userId: 16, name: 'Payment Reminder', message: 'Your subscription renews on Feb 1. Plan: Enterprise.', status: 'completed' },
    { userId: 15, name: 'New Year Greetings', message: 'Happy New Year from LATAMCO! Wishing you a prosperous 2025.', status: 'completed' },
    { userId: 10, name: 'OTP Verification', message: 'Your verification code is {{code}}. Valid for 5 minutes.', status: 'completed' },
  ];
  for (let i = 0; i < campaignData.length; i++) {
    const c = campaignData[i];
    await prisma.campaign.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1, uid: `camp-${String(i + 1).padStart(3, '0')}`,
        userId: c.userId, campaignName: c.name, message: c.message, status: c.status,
      },
    });
  }
  console.log(`  Created ${campaignData.length} campaigns`);

  // ==================== REPORTS (SMS History) ====================
  console.log('Seeding reports (SMS history)...');
  const reportStatuses = ['delivered', 'delivered', 'delivered', 'sent', 'failed', 'pending', 'delivered', 'delivered', 'delivered', 'delivered'];
  const reportData = [
    { userId: 10, campaignId: 1, from: 'ACMECORP', to: '+1 555-1001', message: 'Your order #12345 has been shipped!', cost: 0.012, status: 'delivered' },
    { userId: 11, campaignId: 2, from: 'GLOBALTECH', to: '+44 7700-0401', message: 'Meeting reminder: Team standup at 10 AM tomorrow', cost: 0.015, status: 'delivered' },
    { userId: 10, campaignId: 1, from: 'ACMECORP', to: '+1 555-1002', message: 'Flash Sale! 50% off all items.', cost: 0.012, status: 'sent' },
    { userId: 16, campaignId: 4, from: 'TECHFRM', to: '+1 555-6001', message: 'Subscription renewal reminder for Feb 1.', cost: 0.012, status: 'delivered' },
    { userId: 13, campaignId: 3, from: 'EUROMAIL', to: '+49 151-5001', message: 'Welcome! Your account is ready.', cost: 0.018, status: 'delivered' },
    { userId: 12, campaignId: null, from: 'ASIATICK', to: '+86 138-0001', message: 'Your verification code is 456789.', cost: 0.020, status: 'failed' },
    { userId: 10, campaignId: null, from: 'ACMECORP', to: '+1 555-2001', message: 'Appointment confirmed for Jan 15 at 2:00 PM.', cost: 0.012, status: 'delivered' },
    { userId: 15, campaignId: 5, from: 'LATAMCO', to: '+52 55-0106', message: 'Recordatorio: Su cita es manana.', cost: 0.016, status: 'pending' },
    { userId: 18, campaignId: null, from: 'MKTGPRO', to: '+1 555-0109', message: 'SMS marketing webinar this Friday!', cost: 0.012, status: 'delivered' },
    { userId: 20, campaignId: null, from: 'NORDICTECH', to: '+46 70-8001', message: 'Din bestallning har skickats.', cost: 0.022, status: 'delivered' },
  ];
  for (let i = 0; i < reportData.length; i++) {
    const r = reportData[i];
    await prisma.report.create({
      data: {
        id: i + 1, userId: r.userId, campaignId: r.campaignId,
        from: r.from, to: r.to, message: r.message,
        cost: r.cost, smsCount: 1, status: r.status,
        direction: 'outgoing', sendBy: 'api',
      },
    }).catch(() => {});
  }
  console.log(`  Created ${reportData.length} report records`);

  // ==================== INVOICES ====================
  console.log('Seeding invoices...');
  const invoiceData = [
    { userId: 10, amount: 499.99, status: 'paid', type: 'subscription' },
    { userId: 11, amount: 199.99, status: 'paid', type: 'subscription' },
    { userId: 12, amount: 49.99, status: 'paid', type: 'subscription' },
    { userId: 13, amount: 499.99, status: 'paid', type: 'subscription' },
    { userId: 14, amount: 25.00, status: 'unpaid', type: 'topup' },
    { userId: 15, amount: 49.99, status: 'paid', type: 'subscription' },
    { userId: 16, amount: 499.99, status: 'paid', type: 'subscription' },
    { userId: 17, amount: 199.99, status: 'unpaid', type: 'subscription' },
    { userId: 18, amount: 15.00, status: 'paid', type: 'topup' },
    { userId: 20, amount: 499.99, status: 'unpaid', type: 'subscription' },
  ];
  for (let i = 0; i < invoiceData.length; i++) {
    const inv = invoiceData[i];
    await prisma.invoice.create({
      data: {
        id: i + 1, uid: `inv-${String(i + 1).padStart(3, '0')}`,
        userId: inv.userId, amount: inv.amount, currency: 'USD',
        status: inv.status, type: inv.type,
        transactionId: `TXN-${String(i + 1).padStart(6, '0')}`,
      },
    }).catch(() => {});
  }
  console.log(`  Created ${invoiceData.length} invoices`);

  // ==================== BLACKLISTS ====================
  console.log('Seeding blacklists...');
  const blacklistData = [
    { userId: 10, number: '+1 555-999-0001', reason: 'Spam complaints received' },
    { userId: 1, number: '+1 555-999-0002', reason: 'Invalid number - undeliverable' },
    { userId: 13, number: '+44 7700-999-003', reason: 'Opt-out request' },
    { userId: 1, number: '+91 9876-999-004', reason: 'Regulatory block - DND' },
    { userId: 11, number: '+1 555-999-0005', reason: 'Abusive messages' },
  ];
  for (let i = 0; i < blacklistData.length; i++) {
    const b = blacklistData[i];
    await prisma.blacklist.create({
      data: {
        id: i + 1, uid: `bl-${String(i + 1).padStart(3, '0')}`,
        userId: b.userId, number: b.number, reason: b.reason,
      },
    }).catch(() => {});
  }
  console.log(`  Created ${blacklistData.length} blacklist entries`);

  // ==================== ANNOUNCEMENTS ====================
  console.log('Seeding announcements...');
  const announcementData = [
    { title: 'System Maintenance Scheduled', message: 'Maintenance on Jan 15, 2025 from 2:00 AM to 4:00 AM UTC.', status: 'active' },
    { title: 'New WhatsApp Channel Launch', message: 'WhatsApp Business API integration now available for Enterprise and Business plans.', status: 'active' },
    { title: 'Holiday Hours', message: 'Support team will have reduced hours during the holiday season.', status: 'inactive' },
    { title: 'Pricing Update for 2025', message: 'Starting February 2025, small pricing adjustments. Current subscribers locked in.', status: 'active' },
  ];
  for (let i = 0; i < announcementData.length; i++) {
    const a = announcementData[i];
    await prisma.announcement.create({
      data: {
        id: i + 1, uid: `ann-${String(i + 1).padStart(3, '0')}`,
        userId: 1, title: a.title, message: a.message, status: a.status,
      },
    }).catch(() => {});
  }
  console.log(`  Created ${announcementData.length} announcements`);

  // ==================== PERMISSIONS ====================
  console.log('Seeding permissions...');
  const allPerms = [
    'dashboard.view', 'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
    'reports.view', 'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.delete',
    'announcements.manage', 'plans.manage', 'invoices.view', 'invoices.manage',
    'servers.manage', 'settings.manage', 'blacklists.manage', 'templates.manage',
    'senderids.view', 'senderids.manage', 'contacts.view', 'contacts.manage',
    'subscriptions.view', 'subscriptions.manage', 'topups.manage', 'roles.manage',
    'admins.manage',
  ];
  for (let i = 0; i < allPerms.length; i++) {
    await prisma.permission.create({
      data: { id: i + 1, roleId: 1, name: allPerms[i], guardName: 'web' },
    }).catch(() => {});
  }
  console.log(`  Created ${allPerms.length} permissions for Super Admin role`);

  console.log('\n=== SDASMS Database Seeding Complete ===');
  console.log('\nTest Accounts:');
  console.log('  Admin:    admin@admin.com / password123');
  console.log('  Support:  support@admin.com / password123');
  console.log('  Billing:  billing@admin.com / password123');
  console.log('  Tech:     tech@admin.com / password123');
  console.log('  Customer: john@acmecorp.com / customer123');
  console.log('  Customer: sarah@globaltech.com / customer123');
  console.log('  Customer: emma@euromail.com / customer123');
  console.log('  (all 12 customers use password: customer123)');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
