import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ──────────────────────────────────────────────
  // 1. USERS
  // ──────────────────────────────────────────────
  console.log('  Creating users...');

  const adminPassword = await hash('password123', 12);
  const customerPassword = await hash('customer123', 12);

  const admins = [
    { uid: 'admin-001', firstName: 'Super', lastName: 'Admin', email: 'admin@admin.com', password: adminPassword, status: 'active', isAdmin: true, isCustomer: false },
    { uid: 'admin-002', firstName: 'Support', lastName: 'Manager', email: 'support@admin.com', password: adminPassword, status: 'active', isAdmin: true, isCustomer: false },
    { uid: 'admin-003', firstName: 'Billing', lastName: 'Admin', email: 'billing@admin.com', password: adminPassword, status: 'active', isAdmin: true, isCustomer: false },
    { uid: 'admin-004', firstName: 'Tech', lastName: 'Lead', email: 'tech@admin.com', password: adminPassword, status: 'inactive', isAdmin: true, isCustomer: false },
  ];

  const customers = [
    { uid: 'c-001', firstName: 'John', lastName: 'Smith', email: 'john@acmecorp.com', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 45000 },
    { uid: 'c-002', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@globaltech.com', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 22000 },
    { uid: 'c-003', firstName: 'Michael', lastName: 'Chen', email: 'michael@asiainc.com', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 5600 },
    { uid: 'c-004', firstName: 'Emma', lastName: 'Williams', email: 'emma@euromail.com', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 67000 },
    { uid: 'c-005', firstName: 'David', lastName: 'Brown', email: 'david@startup.io', password: customerPassword, status: 'inactive', isAdmin: false, isCustomer: true, smsUnit: 12000 },
    { uid: 'c-006', firstName: 'Lisa', lastName: 'Martinez', email: 'lisa@latamco.com', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 800 },
    { uid: 'c-007', firstName: 'James', lastName: 'Wilson', email: 'james@techfirm.com', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 91000 },
    { uid: 'c-008', firstName: 'Aisha', lastName: 'Patel', email: 'aisha@indiatech.in', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 18500 },
    { uid: 'c-009', firstName: 'Robert', lastName: 'Taylor', email: 'robert@mktgpro.com', password: customerPassword, status: 'inactive', isAdmin: false, isCustomer: true, smsUnit: 3200 },
    { uid: 'c-010', firstName: 'Maria', lastName: 'Garcia', email: 'maria@bizlat.com', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 15000 },
    { uid: 'c-011', firstName: 'Tom', lastName: 'Anderson', email: 'tom@nordic.se', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 55000 },
    { uid: 'c-012', firstName: 'Nina', lastName: 'Kowalski', email: 'nina@polandtel.pl', password: customerPassword, status: 'active', isAdmin: false, isCustomer: true, smsUnit: 1000 },
  ];

  const allUsers = [...admins, ...customers];

  // Create or update users
  for (const u of allUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        uid: u.uid,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: u.password,
        status: u.status,
        isAdmin: u.isAdmin,
        isCustomer: u.isCustomer,
        smsUnit: (u as any).smsUnit || 0,
        apiToken: u.isAdmin ? `admin-api-${u.uid}` : `cust-api-${u.uid}`,
      },
    });
  }
  console.log(`    ✅ Created ${allUsers.length} users`);

  // Fetch user IDs for relations
  const dbUsers = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  const adminUser = dbUsers.find(u => u.email === 'admin@admin.com')!;
  const userById = Object.fromEntries(dbUsers.map(u => [u.email, u.id]));

  // ──────────────────────────────────────────────
  // 2. PLANS
  // ──────────────────────────────────────────────
  console.log('  Creating plans...');

  const plans = [
    { uid: 'plan-001', name: 'Starter', price: 49.99, billingCycle: 'monthly', options: { sms: '5,000', contacts: '1,000', groups: '5', sender_ids: '1', templates: '10' }, status: 'active', creditPrice: 0.01 },
    { uid: 'plan-002', name: 'Business', price: 199.99, billingCycle: 'monthly', options: { sms: '50,000', contacts: '25,000', groups: '25', sender_ids: '5', templates: '50', api_access: true }, status: 'active', creditPrice: 0.008 },
    { uid: 'plan-003', name: 'Enterprise', price: 499.99, billingCycle: 'monthly', options: { sms: 'Unlimited', contacts: 'Unlimited', groups: 'Unlimited', sender_ids: '25', templates: 'Unlimited', api_access: true, priority_support: true, dedicated_server: true }, status: 'active', creditPrice: 0.005 },
  ];

  const planIds: Record<string, number> = {};
  for (const p of plans) {
    const plan = await prisma.plan.upsert({
      where: { uid: p.uid },
      update: {},
      create: {
        uid: p.uid,
        name: p.name,
        price: p.price,
        billingCycle: p.billingCycle,
        options: p.options as any,
        status: p.status,
        creditPrice: p.creditPrice,
      },
    });
    planIds[p.name] = plan.id;
  }
  console.log(`    ✅ Created ${plans.length} plans`);

  // ──────────────────────────────────────────────
  // 3. SUBSCRIPTIONS
  // ──────────────────────────────────────────────
  console.log('  Creating subscriptions...');

  const subscriptions = [
    { uid: 'sub-001', email: 'john@acmecorp.com', plan: 'Enterprise', status: 'active', endDate: '2025-01-15' },
    { uid: 'sub-002', email: 'sarah@globaltech.com', plan: 'Business', status: 'active', endDate: '2025-02-20' },
    { uid: 'sub-003', email: 'michael@asiainc.com', plan: 'Starter', status: 'expired', endDate: '2024-06-10' },
    { uid: 'sub-004', email: 'emma@euromail.com', plan: 'Enterprise', status: 'active', endDate: '2025-01-05' },
    { uid: 'sub-005', email: 'david@startup.io', plan: 'Business', status: 'expired', endDate: '2024-10-18' },
    { uid: 'sub-006', email: 'lisa@latamco.com', plan: 'Starter', status: 'active', endDate: '2025-05-22' },
    { uid: 'sub-007', email: 'james@techfirm.com', plan: 'Enterprise', status: 'active', endDate: '2024-11-30' },
    { uid: 'sub-008', email: 'aisha@indiatech.in', plan: 'Business', status: 'active', endDate: '2025-06-01' },
    { uid: 'sub-009', email: 'robert@mktgpro.com', plan: 'Starter', status: 'cancelled', endDate: '2024-07-15' },
    { uid: 'sub-010', email: 'tom@nordic.se', plan: 'Enterprise', status: 'active', endDate: '2025-02-14' },
  ];

  for (const s of subscriptions) {
    const userId = userById[s.email];
    if (!userId) continue;
    await prisma.subscription.upsert({
      where: { uid: s.uid },
      update: {},
      create: {
        uid: s.uid,
        userId,
        planId: planIds[s.plan],
        status: s.status,
        currentPeriodEndsAt: new Date(s.endDate),
      },
    });
  }
  console.log(`    ✅ Created ${subscriptions.length} subscriptions`);

  // ──────────────────────────────────────────────
  // 4. ANNOUNCEMENTS
  // ──────────────────────────────────────────────
  console.log('  Creating announcements...');

  const announcements = [
    { uid: 'ann-001', title: 'System Maintenance Scheduled', message: 'We will be performing scheduled maintenance on Jan 15, 2025 from 2:00 AM to 4:00 AM UTC. Services may be temporarily unavailable.', status: 'active' },
    { uid: 'ann-002', title: 'New WhatsApp Channel Launch', message: "We're excited to announce the launch of our new WhatsApp Business API integration. All Enterprise and Business plan users can now send messages via WhatsApp.", status: 'active' },
    { uid: 'ann-003', title: 'Holiday Hours', message: 'Our support team will have reduced hours during the holiday season. Emergency support will remain available 24/7.', status: 'inactive' },
    { uid: 'ann-004', title: 'Pricing Update for 2025', message: 'Starting February 2025, there will be a small adjustment to our pricing plans. Current subscribers are locked in at their existing rates.', status: 'active' },
  ];

  for (const a of announcements) {
    await prisma.announcement.upsert({
      where: { uid: a.uid },
      update: {},
      create: {
        uid: a.uid,
        userId: adminUser.id,
        title: a.title,
        message: a.message,
        status: a.status,
      },
    });
  }
  console.log(`    ✅ Created ${announcements.length} announcements`);

  // ──────────────────────────────────────────────
  // 5. SENDING SERVERS
  // ──────────────────────────────────────────────
  console.log('  Creating sending servers...');

  const sendingServers = [
    { uid: 'srv-001', name: 'Twilio HTTP Gateway', type: 'http', quotaValue: 100000, status: 'active', settings: { url: 'https://api.twilio.com', api_key: '****' } },
    { uid: 'srv-002', name: 'Nexmo SMPP Server', type: 'smpp', quotaValue: 500000, status: 'active', settings: { host: 'smpp.nexmo.com', port: 2775 } },
    { uid: 'srv-003', name: 'WhatsApp Business API', type: 'whatsapp', quotaValue: 50000, status: 'active', settings: { phone_id: '+1234567890', token: '****' } },
    { uid: 'srv-004', name: 'Viber Business Channel', type: 'viber', quotaValue: 25000, status: 'inactive', settings: { webhook: 'https://...' } },
    { uid: 'srv-005', name: 'MSG91 OTP Server', type: 'otp', quotaValue: 200000, status: 'active', settings: { auth_key: '****' } },
    { uid: 'srv-006', name: 'Plivo HTTP API', type: 'http', quotaValue: 75000, status: 'active', settings: { auth_id: '****', auth_token: '****' } },
    { uid: 'srv-007', name: 'Route Mobile SMPP', type: 'smpp', quotaValue: 300000, status: 'inactive', settings: { host: 'smpp.routemobile.com', port: 2776 } },
  ];

  for (const s of sendingServers) {
    await prisma.sendingServer.upsert({
      where: { uid: s.uid },
      update: {},
      create: {
        uid: s.uid,
        userId: adminUser.id,
        name: s.name,
        type: s.type,
        quotaValue: s.quotaValue,
        status: s.status,
        settings: s.settings as any,
      },
    });
  }
  console.log(`    ✅ Created ${sendingServers.length} sending servers`);

  // ──────────────────────────────────────────────
  // 6. SENDER IDs
  // ──────────────────────────────────────────────
  console.log('  Creating sender IDs...');

  const senderIds = [
    { uid: 'sid-001', senderId: 'ACMECORP', email: 'john@acmecorp.com', status: 'active', countries: ['US', 'CA', 'UK'] },
    { uid: 'sid-002', senderId: 'GLOBALTECH', email: 'sarah@globaltech.com', status: 'active', countries: ['US', 'UK'] },
    { uid: 'sid-003', senderId: 'ASIATICK', email: 'michael@asiainc.com', status: 'pending', countries: ['IN', 'SG'] },
    { uid: 'sid-004', senderId: 'EUROMAIL', email: 'emma@euromail.com', status: 'active', countries: ['DE', 'FR', 'ES', 'IT'] },
    { uid: 'sid-005', senderId: 'STARTUP1', email: 'david@startup.io', status: 'inactive', countries: ['US'] },
    { uid: 'sid-006', senderId: 'LATAMCO', email: 'lisa@latamco.com', status: 'pending', countries: ['MX', 'CO', 'AR'] },
    { uid: 'sid-007', senderId: 'TECHFRM', email: 'james@techfirm.com', status: 'active', countries: ['US', 'CA', 'UK', 'AU'] },
    { uid: 'sid-008', senderId: 'MKTGPRO', email: 'robert@mktgpro.com', status: 'active', countries: ['US'] },
  ];

  for (const s of senderIds) {
    const userId = userById[s.email];
    if (!userId) continue;
    await prisma.senderId.upsert({
      where: { uid: s.uid },
      update: {},
      create: {
        uid: s.uid,
        userId,
        senderId: s.senderId,
        status: s.status,
        supportingCountries: s.countries as any,
      },
    });
  }
  console.log(`    ✅ Created ${senderIds.length} sender IDs`);

  // ──────────────────────────────────────────────
  // 7. PAYMENTS
  // ──────────────────────────────────────────────
  console.log('  Creating payments...');

  const payments = [
    // Pesapal transactions
    { uid: 'pay-001', email: 'john@acmecorp.com', paymentMethod: 'Pesapal', amount: 499.99, currency: 'KES', status: 'completed', transactionId: 'PSP-2025-001' },
    { uid: 'pay-002', email: 'lisa@latamco.com', paymentMethod: 'Pesapal', amount: 49.99, currency: 'KES', status: 'completed', transactionId: 'PSP-2025-002' },
    { uid: 'pay-003', email: 'michael@asiainc.com', paymentMethod: 'Pesapal', amount: 25.00, currency: 'KES', status: 'pending', transactionId: 'PSP-2025-003' },
    { uid: 'pay-004', email: 'aisha@indiatech.in', paymentMethod: 'Pesapal', amount: 199.99, currency: 'KES', status: 'failed', transactionId: 'PSP-2025-004' },
    { uid: 'pay-005', email: 'maria@bizlat.com', paymentMethod: 'Pesapal', amount: 199.99, currency: 'KES', status: 'completed', transactionId: 'PSP-2025-005' },
    // PayPal transactions
    { uid: 'pay-006', email: 'emma@euromail.com', paymentMethod: 'PayPal', amount: 499.99, currency: 'USD', status: 'completed', transactionId: 'PPL-2025-001' },
    { uid: 'pay-007', email: 'tom@nordic.se', paymentMethod: 'PayPal', amount: 499.99, currency: 'EUR', status: 'completed', transactionId: 'PPL-2025-002' },
    { uid: 'pay-008', email: 'sarah@globaltech.com', paymentMethod: 'PayPal', amount: 199.99, currency: 'USD', status: 'completed', transactionId: 'PPL-2025-003' },
    { uid: 'pay-009', email: 'david@startup.io', paymentMethod: 'PayPal', amount: 25.00, currency: 'USD', status: 'refunded', transactionId: 'PPL-2025-004' },
    { uid: 'pay-010', email: 'robert@mktgpro.com', paymentMethod: 'PayPal', amount: 15.00, currency: 'GBP', status: 'completed', transactionId: 'PPL-2025-005' },
    // Stripe transactions
    { uid: 'pay-011', email: 'james@techfirm.com', paymentMethod: 'Stripe', amount: 499.99, currency: 'USD', status: 'completed', transactionId: 'STR-2025-001' },
    { uid: 'pay-012', email: 'nina@polandtel.pl', paymentMethod: 'Stripe', amount: 49.99, currency: 'EUR', status: 'completed', transactionId: 'STR-2025-002' },
    { uid: 'pay-013', email: 'john@acmecorp.com', paymentMethod: 'Stripe', amount: 50.00, currency: 'USD', status: 'completed', transactionId: 'STR-2025-003' },
    { uid: 'pay-014', email: 'aisha@indiatech.in', paymentMethod: 'Stripe', amount: 199.99, currency: 'INR', status: 'failed', transactionId: 'STR-2025-004' },
    { uid: 'pay-015', email: 'emma@euromail.com', paymentMethod: 'Stripe', amount: 100.00, currency: 'USD', status: 'completed', transactionId: 'STR-2025-005' },
    // Manual transactions
    { uid: 'pay-016', email: 'tom@nordic.se', paymentMethod: 'Manual Payment', amount: 499.99, currency: 'KES', status: 'completed', transactionId: 'MAN-2025-001' },
    { uid: 'pay-017', email: 'maria@bizlat.com', paymentMethod: 'Manual Payment', amount: 199.99, currency: 'USD', status: 'completed', transactionId: 'MAN-2025-002' },
    { uid: 'pay-018', email: 'robert@mktgpro.com', paymentMethod: 'Manual Payment', amount: 49.99, currency: 'KES', status: 'pending', transactionId: 'MAN-2025-003' },
    { uid: 'pay-019', email: 'lisa@latamco.com', paymentMethod: 'Manual Payment', amount: 30.00, currency: 'USD', status: 'rejected', transactionId: 'MAN-2025-004' },
    { uid: 'pay-020', email: 'david@startup.io', paymentMethod: 'Manual Payment', amount: 199.99, currency: 'KES', status: 'completed', transactionId: 'MAN-2025-005' },
  ];

  for (const p of payments) {
    const userId = userById[p.email];
    if (!userId) continue;
    await prisma.payment.upsert({
      where: { uid: p.uid },
      update: {},
      create: {
        uid: p.uid,
        userId,
        paymentMethod: p.paymentMethod,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        transactionId: p.transactionId,
      },
    });
  }
  console.log(`    ✅ Created ${payments.length} payments`);

  // ──────────────────────────────────────────────
  // 8. INVOICES
  // ──────────────────────────────────────────────
  console.log('  Creating invoices...');

  const invoices = [
    { uid: 'inv-001', email: 'john@acmecorp.com', amount: 499.99, currency: 'USD', status: 'paid', type: 'subscription', transactionId: 'INV-2024-001' },
    { uid: 'inv-002', email: 'sarah@globaltech.com', amount: 199.99, currency: 'USD', status: 'paid', type: 'subscription', transactionId: 'INV-2024-002' },
    { uid: 'inv-003', email: 'michael@asiainc.com', amount: 49.99, currency: 'USD', status: 'paid', type: 'subscription', transactionId: 'INV-2024-003' },
    { uid: 'inv-004', email: 'emma@euromail.com', amount: 499.99, currency: 'USD', status: 'paid', type: 'subscription', transactionId: 'INV-2024-004' },
    { uid: 'inv-005', email: 'david@startup.io', amount: 25.00, currency: 'USD', status: 'unpaid', type: 'topup', transactionId: 'INV-2024-005' },
    { uid: 'inv-006', email: 'lisa@latamco.com', amount: 49.99, currency: 'USD', status: 'paid', type: 'subscription', transactionId: 'INV-2024-006' },
    { uid: 'inv-007', email: 'james@techfirm.com', amount: 499.99, currency: 'USD', status: 'paid', type: 'subscription', transactionId: 'INV-2024-007' },
    { uid: 'inv-008', email: 'aisha@indiatech.in', amount: 199.99, currency: 'USD', status: 'unpaid', type: 'subscription', transactionId: 'INV-2024-008' },
    { uid: 'inv-009', email: 'robert@mktgpro.com', amount: 15.00, currency: 'USD', status: 'paid', type: 'topup', transactionId: 'INV-2024-009' },
    { uid: 'inv-010', email: 'tom@nordic.se', amount: 499.99, currency: 'USD', status: 'unpaid', type: 'subscription', transactionId: 'INV-2025-001' },
    { uid: 'inv-011', email: 'maria@bizlat.com', amount: 199.99, currency: 'USD', status: 'paid', type: 'subscription', transactionId: 'INV-2024-011' },
    { uid: 'inv-012', email: 'john@acmecorp.com', amount: 50.00, currency: 'USD', status: 'paid', type: 'topup', transactionId: 'INV-2024-012' },
  ];

  for (const inv of invoices) {
    const userId = userById[inv.email];
    if (!userId) continue;
    await prisma.invoice.upsert({
      where: { uid: inv.uid },
      update: {},
      create: {
        uid: inv.uid,
        userId,
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status,
        type: inv.type,
        transactionId: inv.transactionId,
      },
    });
  }
  console.log(`    ✅ Created ${invoices.length} invoices`);

  // ──────────────────────────────────────────────
  // 9. BLACKLISTS
  // ──────────────────────────────────────────────
  console.log('  Creating blacklists...');

  const blacklists = [
    { uid: 'bl-001', email: 'john@acmecorp.com', number: '+1 555-999-0001', reason: 'Spam complaints received' },
    { uid: 'bl-002', email: 'admin@admin.com', number: '+1 555-999-0002', reason: 'Invalid number - undeliverable' },
    { uid: 'bl-003', email: 'emma@euromail.com', number: '+44 7700-999-003', reason: 'Opt-out request' },
    { uid: 'bl-004', email: 'admin@admin.com', number: '+91 9876-999-004', reason: 'Regulatory block - DND' },
    { uid: 'bl-005', email: 'sarah@globaltech.com', number: '+1 555-999-0005', reason: 'Abusive messages' },
  ];

  for (const b of blacklists) {
    const userId = userById[b.email];
    if (!userId) continue;
    await prisma.blacklist.upsert({
      where: { uid: b.uid },
      update: {},
      create: {
        uid: b.uid,
        userId,
        number: b.number,
        reason: b.reason,
      },
    });
  }
  console.log(`    ✅ Created ${blacklists.length} blacklists`);

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
