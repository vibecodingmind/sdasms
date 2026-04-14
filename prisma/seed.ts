import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database (PostgreSQL)...');

  try {
    // ──────────────────────────────────────────────
    // 1. USERS (16 total)
    // ──────────────────────────────────────────────
    console.log('  Creating users...');

    const adminPassword = await hash('password123', 12);
    const customerPassword = await hash('customer123', 12);

    const admins = [
      { uid: 'admin-001', firstName: 'Super', lastName: 'Admin', email: 'admin@admin.com', password: adminPassword, status: 'active', isAdmin: true, phone: '+1 555-0001' },
      { uid: 'admin-002', firstName: 'Support', lastName: 'Manager', email: 'support@admin.com', password: adminPassword, status: 'active', isAdmin: true, phone: '+1 555-0002' },
      { uid: 'admin-003', firstName: 'Billing', lastName: 'Admin', email: 'billing@admin.com', password: adminPassword, status: 'active', isAdmin: true, phone: '+1 555-0003' },
      { uid: 'admin-004', firstName: 'Tech', lastName: 'Lead', email: 'tech@admin.com', password: adminPassword, status: 'inactive', isAdmin: true, phone: '+1 555-0004' },
    ];

    const customers = [
      { uid: 'c-001', firstName: 'John', lastName: 'Smith', email: 'john@acmecorp.com', password: customerPassword, status: 'active', isAdmin: false, phone: '+1 555-0101', smsBalance: 45000 },
      { uid: 'c-002', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@globaltech.com', password: customerPassword, status: 'active', isAdmin: false, phone: '+1 555-0102', smsBalance: 22000 },
      { uid: 'c-003', firstName: 'Michael', lastName: 'Chen', email: 'michael@asiainc.com', password: customerPassword, status: 'active', isAdmin: false, phone: '+86 138-0001', smsBalance: 5600 },
      { uid: 'c-004', firstName: 'Emma', lastName: 'Williams', email: 'emma@euromail.com', password: customerPassword, status: 'active', isAdmin: false, phone: '+44 7700-0401', smsBalance: 67000 },
      { uid: 'c-005', firstName: 'David', lastName: 'Brown', email: 'david@startup.io', password: customerPassword, status: 'inactive', isAdmin: false, phone: '+1 555-0105', smsBalance: 12000 },
      { uid: 'c-006', firstName: 'Lisa', lastName: 'Martinez', email: 'lisa@latamco.com', password: customerPassword, status: 'active', isAdmin: false, phone: '+52 55-0106', smsBalance: 800 },
      { uid: 'c-007', firstName: 'James', lastName: 'Wilson', email: 'james@techfirm.com', password: customerPassword, status: 'active', isAdmin: false, phone: '+1 555-0107', smsBalance: 91000 },
      { uid: 'c-008', firstName: 'Aisha', lastName: 'Patel', email: 'aisha@indiatech.in', password: customerPassword, status: 'active', isAdmin: false, phone: '+91 9876-0801', smsBalance: 18500 },
      { uid: 'c-009', firstName: 'Robert', lastName: 'Taylor', email: 'robert@mktgpro.com', password: customerPassword, status: 'inactive', isAdmin: false, phone: '+1 555-0109', smsBalance: 3200 },
      { uid: 'c-010', firstName: 'Maria', lastName: 'Garcia', email: 'maria@bizlat.com', password: customerPassword, status: 'active', isAdmin: false, phone: '+34 600-1010', smsBalance: 15000 },
      { uid: 'c-011', firstName: 'Tom', lastName: 'Anderson', email: 'tom@nordic.se', password: customerPassword, status: 'active', isAdmin: false, phone: '+46 70-1011', smsBalance: 55000 },
      { uid: 'c-012', firstName: 'Nina', lastName: 'Kowalski', email: 'nina@polandtel.pl', password: customerPassword, status: 'active', isAdmin: false, phone: '+48 500-1012', smsBalance: 1000 },
    ];

    const allUsers = [...admins, ...customers];

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
          phone: u.phone || null,
          status: u.status,
          isAdmin: u.isAdmin,
          smsBalance: (u as any).smsBalance || 0,
        },
      });
    }
    console.log(`    ✅ Created ${allUsers.length} users`);

    // Fetch user IDs for relations
    const dbUsers = await prisma.user.findMany({ orderBy: { id: 'asc' } });
    const adminUser = dbUsers.find(u => u.email === 'admin@admin.com')!;
    const userById = Object.fromEntries(dbUsers.map(u => [u.email, u.id]));

    // ──────────────────────────────────────────────
    // 2. ROLES (5)
    // ──────────────────────────────────────────────
    console.log('  Creating roles...');

    const roles = [
      { uid: 'role-001', name: 'Super Admin', status: 'active' },
      { uid: 'role-002', name: 'Support Admin', status: 'active' },
      { uid: 'role-003', name: 'Billing Admin', status: 'active' },
      { uid: 'role-004', name: 'Technical Admin', status: 'active' },
      { uid: 'role-005', name: 'Viewer', status: 'active' },
    ];

    const roleIdMap: Record<string, number> = {};
    for (const r of roles) {
      const role = await prisma.role.upsert({
        where: { name: r.name },
        update: {},
        create: {
          name: r.name,
          status: r.status,
        },
      });
      roleIdMap[r.name] = role.id;
    }
    console.log(`    ✅ Created ${roles.length} roles`);

    // Assign roles to admins
    console.log('  Assigning roles to users...');
    const roleAssignments: [string, string[]][] = [
      ['admin@admin.com', ['Super Admin']],
      ['support@admin.com', ['Support Admin']],
      ['billing@admin.com', ['Billing Admin']],
      ['tech@admin.com', ['Technical Admin']],
    ];

    for (const [email, roleNames] of roleAssignments) {
      const userId = userById[email];
      if (!userId) continue;
      for (const roleName of roleNames) {
        const roleId = roleIdMap[roleName];
        if (!roleId) continue;
        await prisma.userRole.upsert({
          where: { userId_roleId: { userId, roleId } },
          update: {},
          create: { userId, roleId },
        });
      }
    }
    console.log(`    ✅ Assigned roles`);

    // Permissions for each role
    console.log('  Creating permissions...');
    const permissionMap: Record<string, string[]> = {
      'Super Admin': ['all'],
      'Support Admin': ['customers.view', 'customers.edit', 'reports.view', 'announcements.manage'],
      'Billing Admin': ['invoices.view', 'invoices.manage', 'plans.manage', 'customers.view'],
      'Technical Admin': ['servers.manage', 'settings.manage', 'reports.view'],
      'Viewer': ['customers.view', 'reports.view', 'dashboard.view'],
    };

    for (const [roleName, perms] of Object.entries(permissionMap)) {
      const roleId = roleIdMap[roleName];
      if (!roleId) continue;
      for (const perm of perms) {
        await prisma.permission.upsert({
          where: { uid: `perm-${roleName}-${perm}`.toLowerCase().replace(/\s+/g, '-') },
          update: {},
          create: { uid: `perm-${roleName}-${perm}`.toLowerCase().replace(/\s+/g, '-'), roleId, name: perm },
        });
      }
    }
    console.log(`    ✅ Created permissions`);

    // ──────────────────────────────────────────────
    // 3. PLANS (5)
    // ──────────────────────────────────────────────
    console.log('  Creating plans...');

    const plans = [
      { uid: 'plan-001', name: 'Starter', price: 49.99, billingCycle: 'monthly', features: { sms: '5,000', contacts: '1,000', groups: '5', sender_ids: '1', templates: '10' }, status: 'active', creditPrice: 0.01 },
      { uid: 'plan-002', name: 'Business', price: 199.99, billingCycle: 'monthly', features: { sms: '50,000', contacts: '25,000', groups: '25', sender_ids: '5', templates: '50', api_access: true }, status: 'active', creditPrice: 0.008 },
      { uid: 'plan-003', name: 'Enterprise', price: 499.99, billingCycle: 'monthly', features: { sms: 'Unlimited', contacts: 'Unlimited', groups: 'Unlimited', sender_ids: '25', templates: 'Unlimited', api_access: true, priority_support: true, dedicated_server: true }, status: 'active', creditPrice: 0.005 },
      { uid: 'plan-004', name: 'Starter Annual', price: 499.00, billingCycle: 'yearly', features: { sms: '5,000/mo', contacts: '1,000', groups: '5', sender_ids: '1', templates: '10' }, status: 'active', creditPrice: 0.009 },
      { uid: 'plan-005', name: 'Business Annual', price: 1999.00, billingCycle: 'yearly', features: { sms: '50,000/mo', contacts: '25,000', groups: '25', sender_ids: '5', templates: '50', api_access: true }, status: 'active', creditPrice: 0.007 },
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
          features: p.features as any,
          status: p.status,
          creditPrice: p.creditPrice,
        },
      });
      planIds[p.name] = plan.id;
    }
    console.log(`    ✅ Created ${plans.length} plans`);

    // ──────────────────────────────────────────────
    // 4. SUBSCRIPTIONS (10)
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
    // 5. CAMPAIGNS (8)
    // ──────────────────────────────────────────────
    console.log('  Creating campaigns...');

    const campaigns = [
      { uid: 'camp-001', email: 'john@acmecorp.com', name: 'January Promo', type: 'sms', message: 'January Sale! 50% off all items. Use code JAN50.', status: 'completed', contacts: 5000, delivered: 4850, failed: 150 },
      { uid: 'camp-002', email: 'sarah@globaltech.com', name: 'Flash Sale Alert', type: 'sms', message: 'Flash Sale! 50% off. Use code FLASH50 at checkout.', status: 'completed', contacts: 12000, delivered: 11750, failed: 250 },
      { uid: 'camp-003', email: 'emma@euromail.com', name: 'Welcome Series', type: 'whatsapp', message: 'Welcome! Explore our latest features and get started.', status: 'active', contacts: 3500, delivered: 2100, failed: 50 },
      { uid: 'camp-004', email: 'james@techfirm.com', name: 'Payment Reminder', type: 'sms', message: 'Your subscription renews soon. Update payment details.', status: 'completed', contacts: 850, delivered: 820, failed: 30 },
      { uid: 'camp-005', email: 'lisa@latamco.com', name: 'New Year Greetings', type: 'sms', message: 'Happy New Year from our team! Wishing you a great 2025.', status: 'completed', contacts: 2000, delivered: 1950, failed: 50 },
      { uid: 'camp-006', email: 'admin@admin.com', name: 'OTP Verification', type: 'otp', message: 'Your verification code is {{code}}. Valid for 5 minutes.', status: 'completed', contacts: 45000, delivered: 44200, failed: 800 },
      { uid: 'camp-007', email: 'tom@nordic.se', name: 'Weekly Newsletter', type: 'sms', message: 'Your weekly update: Top news and offers inside.', status: 'scheduled', contacts: 18000, delivered: 0, failed: 0 },
      { uid: 'camp-008', email: 'maria@bizlat.com', name: 'Abandoned Cart', type: 'whatsapp', message: 'You left items in your cart! Complete your purchase now.', status: 'active', contacts: 500, delivered: 320, failed: 10 },
    ];

    for (const c of campaigns) {
      const userId = userById[c.email];
      if (!userId) continue;
      await prisma.campaign.upsert({
        where: { uid: c.uid },
        update: {},
        create: {
          uid: c.uid,
          userId,
          name: c.name,
          type: c.type,
          message: c.message,
          status: c.status,
          contacts: c.contacts,
          delivered: c.delivered,
          failed: c.failed,
        },
      });
    }
    console.log(`    ✅ Created ${campaigns.length} campaigns`);

    // ──────────────────────────────────────────────
    // 6. SENDING SERVERS (7)
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
    // 7. SENDER IDs (8)
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
    // 8. PAYMENTS (20)
    // ──────────────────────────────────────────────
    console.log('  Creating payments...');

    const payments = [
      // Pesapal transactions
      { uid: 'pay-001', email: 'john@acmecorp.com', gateway: 'Pesapal', paymentMethod: 'M-Pesa', amount: 499.99, currency: 'KES', status: 'completed', transactionId: 'PSP-2025-001', description: 'Enterprise Plan - Monthly' },
      { uid: 'pay-002', email: 'lisa@latamco.com', gateway: 'Pesapal', paymentMethod: 'Airtel Money', amount: 49.99, currency: 'KES', status: 'completed', transactionId: 'PSP-2025-002', description: 'Starter Plan - Monthly' },
      { uid: 'pay-003', email: 'michael@asiainc.com', gateway: 'Pesapal', paymentMethod: 'Visa', amount: 25.00, currency: 'KES', status: 'pending', transactionId: 'PSP-2025-003', description: 'SMS Credit Top-up' },
      { uid: 'pay-004', email: 'aisha@indiatech.in', gateway: 'Pesapal', paymentMethod: 'M-Pesa', amount: 199.99, currency: 'KES', status: 'failed', transactionId: 'PSP-2025-004', description: 'Business Plan - Monthly' },
      { uid: 'pay-005', email: 'maria@bizlat.com', gateway: 'Pesapal', paymentMethod: 'Mastercard', amount: 199.99, currency: 'KES', status: 'completed', transactionId: 'PSP-2025-005', description: 'Business Plan - Monthly' },
      // PayPal transactions
      { uid: 'pay-006', email: 'emma@euromail.com', gateway: 'PayPal', paymentMethod: 'PayPal Balance', amount: 499.99, currency: 'USD', status: 'completed', transactionId: 'PPL-2025-001', description: 'Enterprise Plan - Monthly' },
      { uid: 'pay-007', email: 'tom@nordic.se', gateway: 'PayPal', paymentMethod: 'Credit Card', amount: 499.99, currency: 'EUR', status: 'completed', transactionId: 'PPL-2025-002', description: 'Enterprise Plan - Monthly' },
      { uid: 'pay-008', email: 'sarah@globaltech.com', gateway: 'PayPal', paymentMethod: 'PayPal Balance', amount: 199.99, currency: 'USD', status: 'completed', transactionId: 'PPL-2025-003', description: 'Business Plan - Monthly' },
      { uid: 'pay-009', email: 'david@startup.io', gateway: 'PayPal', paymentMethod: 'Bank Transfer', amount: 25.00, currency: 'USD', status: 'refunded', transactionId: 'PPL-2025-004', description: 'SMS Credit Top-up' },
      { uid: 'pay-010', email: 'robert@mktgpro.com', gateway: 'PayPal', paymentMethod: 'Debit Card', amount: 15.00, currency: 'GBP', status: 'completed', transactionId: 'PPL-2025-005', description: 'SMS Credit Top-up' },
      // Stripe transactions
      { uid: 'pay-011', email: 'james@techfirm.com', gateway: 'Stripe', paymentMethod: 'Visa •••• 4242', amount: 499.99, currency: 'USD', status: 'completed', transactionId: 'STR-2025-001', description: 'Enterprise Plan - Monthly' },
      { uid: 'pay-012', email: 'nina@polandtel.pl', gateway: 'Stripe', paymentMethod: 'Mastercard •••• 8888', amount: 49.99, currency: 'EUR', status: 'completed', transactionId: 'STR-2025-002', description: 'Starter Plan - Monthly' },
      { uid: 'pay-013', email: 'john@acmecorp.com', gateway: 'Stripe', paymentMethod: 'Apple Pay', amount: 50.00, currency: 'USD', status: 'completed', transactionId: 'STR-2025-003', description: 'SMS Credit Top-up' },
      { uid: 'pay-014', email: 'aisha@indiatech.in', gateway: 'Stripe', paymentMethod: 'Google Pay', amount: 199.99, currency: 'INR', status: 'failed', transactionId: 'STR-2025-004', description: 'Business Plan - Monthly' },
      { uid: 'pay-015', email: 'emma@euromail.com', gateway: 'Stripe', paymentMethod: 'Visa •••• 1234', amount: 100.00, currency: 'USD', status: 'completed', transactionId: 'STR-2025-005', description: 'SMS Credit Top-up' },
      // Manual transactions
      { uid: 'pay-016', email: 'tom@nordic.se', gateway: 'Manual Payment', paymentMethod: 'Bank Transfer', amount: 499.99, currency: 'KES', status: 'completed', transactionId: 'MAN-2025-001', description: 'Enterprise Plan - Monthly' },
      { uid: 'pay-017', email: 'maria@bizlat.com', gateway: 'Manual Payment', paymentMethod: 'Bank Deposit', amount: 199.99, currency: 'USD', status: 'completed', transactionId: 'MAN-2025-002', description: 'Business Plan - Monthly' },
      { uid: 'pay-018', email: 'robert@mktgpro.com', gateway: 'Manual Payment', paymentMethod: 'Check', amount: 49.99, currency: 'KES', status: 'pending', transactionId: 'MAN-2025-003', description: 'Starter Plan - Monthly' },
      { uid: 'pay-019', email: 'lisa@latamco.com', gateway: 'Manual Payment', paymentMethod: 'Cash Deposit', amount: 30.00, currency: 'USD', status: 'rejected', transactionId: 'MAN-2025-004', description: 'SMS Credit Top-up' },
      { uid: 'pay-020', email: 'david@startup.io', gateway: 'Manual Payment', paymentMethod: 'Bank Transfer', amount: 199.99, currency: 'KES', status: 'completed', transactionId: 'MAN-2025-005', description: 'Business Plan - Monthly' },
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
          gateway: p.gateway,
          transactionId: p.transactionId,
          amount: p.amount,
          currency: p.currency,
          paymentMethod: p.paymentMethod,
          status: p.status,
          description: p.description,
        },
      });
    }
    console.log(`    ✅ Created ${payments.length} payments`);

    // ──────────────────────────────────────────────
    // 9. INVOICES (12)
    // ──────────────────────────────────────────────
    console.log('  Creating invoices...');

    const invoices = [
      { uid: 'inv-001', email: 'john@acmecorp.com', invoiceNo: 'INV-2024-001', amount: 499.99, currency: 'USD', status: 'paid', type: 'subscription' },
      { uid: 'inv-002', email: 'sarah@globaltech.com', invoiceNo: 'INV-2024-002', amount: 199.99, currency: 'USD', status: 'paid', type: 'subscription' },
      { uid: 'inv-003', email: 'michael@asiainc.com', invoiceNo: 'INV-2024-003', amount: 49.99, currency: 'USD', status: 'paid', type: 'subscription' },
      { uid: 'inv-004', email: 'emma@euromail.com', invoiceNo: 'INV-2024-004', amount: 499.99, currency: 'USD', status: 'paid', type: 'subscription' },
      { uid: 'inv-005', email: 'david@startup.io', invoiceNo: 'INV-2024-005', amount: 25.00, currency: 'USD', status: 'unpaid', type: 'topup' },
      { uid: 'inv-006', email: 'lisa@latamco.com', invoiceNo: 'INV-2024-006', amount: 49.99, currency: 'USD', status: 'paid', type: 'subscription' },
      { uid: 'inv-007', email: 'james@techfirm.com', invoiceNo: 'INV-2024-007', amount: 499.99, currency: 'USD', status: 'paid', type: 'subscription' },
      { uid: 'inv-008', email: 'aisha@indiatech.in', invoiceNo: 'INV-2024-008', amount: 199.99, currency: 'USD', status: 'unpaid', type: 'subscription' },
      { uid: 'inv-009', email: 'robert@mktgpro.com', invoiceNo: 'INV-2024-009', amount: 15.00, currency: 'USD', status: 'paid', type: 'topup' },
      { uid: 'inv-010', email: 'tom@nordic.se', invoiceNo: 'INV-2025-001', amount: 499.99, currency: 'USD', status: 'unpaid', type: 'subscription' },
      { uid: 'inv-011', email: 'maria@bizlat.com', invoiceNo: 'INV-2024-011', amount: 199.99, currency: 'USD', status: 'paid', type: 'subscription' },
      { uid: 'inv-012', email: 'john@acmecorp.com', invoiceNo: 'INV-2024-012', amount: 50.00, currency: 'USD', status: 'paid', type: 'topup' },
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
          invoiceNo: inv.invoiceNo,
          amount: inv.amount,
          currency: inv.currency,
          status: inv.status,
          type: inv.type,
        },
      });
    }
    console.log(`    ✅ Created ${invoices.length} invoices`);

    // ──────────────────────────────────────────────
    // 10. ANNOUNCEMENTS (4)
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
    // 11. BLACKLISTS (5)
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

    // ──────────────────────────────────────────────
    // 12. NOTIFICATIONS (5)
    // ──────────────────────────────────────────────
    console.log('  Creating notifications...');

    const notifications = [
      { email: 'admin@admin.com', title: 'New User Registered', message: 'John Smith (john@acmecorp.com) has registered for an Enterprise plan.', type: 'user', status: 'unread' },
      { email: 'admin@admin.com', title: 'Payment Received', message: 'Payment of $499.99 received from Sarah Johnson via PayPal.', type: 'payment', status: 'read' },
      { email: 'billing@admin.com', title: 'Invoice Overdue', message: 'Invoice INV-2024-008 for Aisha Patel is 15 days overdue.', type: 'billing', status: 'unread' },
      { email: 'admin@admin.com', title: 'SMS Campaign Completed', message: '"January Promo" campaign by John Smith completed with 97% delivery rate.', type: 'campaign', status: 'read' },
      { email: 'tech@admin.com', title: 'Server Alert', message: 'Twilio gateway response time has increased by 200ms in the last hour.', type: 'system', status: 'unread' },
    ];

    for (let i = 0; i < notifications.length; i++) {
      const n = notifications[i];
      const userId = userById[n.email];
      if (!userId) continue;
      await prisma.notification.upsert({
        where: { uid: `notif-${i + 1}` },
        update: {},
        create: {
          uid: `notif-${i + 1}`,
          userId,
          title: n.title,
          message: n.message,
          type: n.type,
          status: n.status,
        },
      });
    }
    console.log(`    ✅ Created ${notifications.length} notifications`);

    // ──────────────────────────────────────────────
    // 13. SMS REPORTS (12)
    // ──────────────────────────────────────────────
    console.log('  Creating SMS reports...');

    const smsReports = [
      { email: 'john@acmecorp.com', from: 'ACMECORP', to: '+1 555-0101', message: 'Your order #12345 has been shipped! Track at example.com/track', status: 'delivered', cost: 0.012 },
      { email: 'sarah@globaltech.com', from: 'GLOBALTECH', to: '+44 7700-0401', message: 'Meeting reminder: Team standup at 10 AM tomorrow', status: 'delivered', cost: 0.015 },
      { email: 'john@acmecorp.com', from: 'ACMECORP', to: '+1 555-0201', message: 'Flash Sale! 50% off all items. Use code FLASH50', status: 'sent', cost: 0.012 },
      { email: 'james@techfirm.com', from: 'TECHFRM', to: '+1 555-0107', message: 'Your subscription will renew on Feb 1. Current plan: Enterprise', status: 'delivered', cost: 0.012 },
      { email: 'emma@euromail.com', from: 'EUROMAIL', to: '+49 151-0801', message: 'Willkommen! Ihr Konto wurde erfolgreich erstellt.', status: 'delivered', cost: 0.018 },
      { email: 'michael@asiainc.com', from: 'ASIATICK', to: '+86 138-0001', message: '您的验证码是 456789，5分钟内有效', status: 'failed', cost: 0.020 },
      { email: 'john@acmecorp.com', from: 'ACMECORP', to: '+1 555-0301', message: 'Appointment confirmed for Jan 15 at 2:00 PM', status: 'delivered', cost: 0.012 },
      { email: 'lisa@latamco.com', from: 'LATAMCO', to: '+52 55-0106', message: 'Recordatorio: Su cita es manana a las 10:00 AM', status: 'pending', cost: 0.016 },
      { email: 'robert@mktgpro.com', from: 'MKTGPRO', to: '+1 555-0401', message: "Don't miss our webinar on SMS marketing best practices!", status: 'delivered', cost: 0.012 },
      { email: 'tom@nordic.se', from: 'NORDICTECH', to: '+46 70-1011', message: 'Din beställning har skickats. Spårningsnummer: SE123456789', status: 'delivered', cost: 0.022 },
      { email: 'john@acmecorp.com', from: 'ACMECORP', to: '+1 555-0501', message: 'Happy Birthday! Enjoy 20% off your next purchase', status: 'delivered', cost: 0.012 },
      { email: 'sarah@globaltech.com', from: 'GLOBALTECH', to: '+1 555-0601', message: 'Your OTP for account verification is 839201', status: 'failed', cost: 0.012 },
    ];

    for (let i = 0; i < smsReports.length; i++) {
      const r = smsReports[i];
      const userId = userById[r.email];
      if (!userId) continue;
      await prisma.smsReport.upsert({
        where: { id: 9980 + i },
        update: {},
        create: {
          userId,
          from: r.from,
          to: r.to,
          message: r.message,
          status: r.status,
          cost: r.cost,
        },
      });
    }
    console.log(`    ✅ Created ${smsReports.length} SMS reports`);

    // ──────────────────────────────────────────────
    // 14. COUNTRIES (12)
    // ──────────────────────────────────────────────
    console.log('  Creating countries...');

    const countries = [
      { name: 'United States', code: 'US', phoneCode: '+1', status: 'active' },
      { name: 'United Kingdom', code: 'GB', phoneCode: '+44', status: 'active' },
      { name: 'India', code: 'IN', phoneCode: '+91', status: 'active' },
      { name: 'Germany', code: 'DE', phoneCode: '+49', status: 'active' },
      { name: 'France', code: 'FR', phoneCode: '+33', status: 'active' },
      { name: 'Canada', code: 'CA', phoneCode: '+1', status: 'active' },
      { name: 'Australia', code: 'AU', phoneCode: '+61', status: 'active' },
      { name: 'Japan', code: 'JP', phoneCode: '+81', status: 'inactive' },
      { name: 'Brazil', code: 'BR', phoneCode: '+55', status: 'inactive' },
      { name: 'Mexico', code: 'MX', phoneCode: '+52', status: 'active' },
      { name: 'Spain', code: 'ES', phoneCode: '+34', status: 'active' },
      { name: 'Italy', code: 'IT', phoneCode: '+39', status: 'active' },
    ];

    for (const c of countries) {
      await prisma.country.upsert({
        where: { code: c.code },
        update: {},
        create: {
          name: c.name,
          code: c.code,
          phoneCode: c.phoneCode,
          status: c.status,
        },
      });
    }
    console.log(`    ✅ Created ${countries.length} countries`);

    // ──────────────────────────────────────────────
    // 15. CURRENCIES (6)
    // ──────────────────────────────────────────────
    console.log('  Creating currencies...');

    const currencies = [
      { name: 'US Dollar', code: 'USD', symbol: '$', rate: 1.000, status: 'active' },
      { name: 'Euro', code: 'EUR', symbol: '€', rate: 0.92, status: 'active' },
      { name: 'British Pound', code: 'GBP', symbol: '£', rate: 0.79, status: 'active' },
      { name: 'Indian Rupee', code: 'INR', symbol: '₹', rate: 83.12, status: 'active' },
      { name: 'Japanese Yen', code: 'JPY', symbol: '¥', rate: 149.50, status: 'inactive' },
      { name: 'Australian Dollar', code: 'AUD', symbol: 'A$', rate: 1.53, status: 'inactive' },
    ];

    for (const c of currencies) {
      await prisma.currency.upsert({
        where: { code: c.code },
        update: {},
        create: {
          name: c.name,
          code: c.code,
          symbol: c.symbol,
          rate: c.rate,
          status: c.status,
        },
      });
    }
    console.log(`    ✅ Created ${currencies.length} currencies`);

    // ──────────────────────────────────────────────
    // 16. EMAIL TEMPLATES (6)
    // ──────────────────────────────────────────────
    console.log('  Creating email templates...');

    const emailTemplates = [
      { name: 'Welcome Email', subject: 'Welcome to SDASMS!', type: 'customer', body: 'Dear {{name}},\n\nWelcome to SDASMS! Your account has been created successfully. You can now start sending SMS campaigns, manage contacts, and track delivery reports.\n\nBest regards,\nThe SDASMS Team', status: 'active' },
      { name: 'Password Reset', subject: 'Reset Your Password', type: 'auth', body: 'Hello {{name}},\n\nYou requested a password reset. Click the link below to set a new password:\n\n{{reset_link}}\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.', status: 'active' },
      { name: 'Invoice Created', subject: 'Invoice #{{invoice_id}} Created', type: 'billing', body: 'Dear {{name}},\n\nA new invoice has been generated for your subscription.\n\nInvoice #: {{invoice_id}}\nAmount: {{amount}} {{currency}}\nDue Date: {{due_date}}\n\nPlease make payment at your earliest convenience.', status: 'active' },
      { name: 'Subscription Expiring', subject: 'Your Subscription is Expiring Soon', type: 'billing', body: 'Dear {{name}},\n\nYour subscription will expire on {{expiry_date}}. To avoid service interruption, please renew your subscription.\n\nPlan: {{plan_name}}\nExpiry: {{expiry_date}}', status: 'active' },
      { name: 'SMS Balance Low', subject: 'Low SMS Balance Alert', type: 'notification', body: 'Dear {{name}},\n\nYour SMS balance has fallen below the threshold.\n\nCurrent Balance: {{balance}}\nThreshold: {{threshold}}\n\nTop up your account to continue sending messages.', status: 'active' },
      { name: 'Campaign Completed', subject: 'Campaign Completed: {{campaign_name}}', type: 'notification', body: 'Dear {{name}},\n\nYour campaign "{{campaign_name}}" has completed.\n\nTotal Contacts: {{total_contacts}}\nDelivered: {{delivered}}\nFailed: {{failed}}\nDelivery Rate: {{delivery_rate}}%', status: 'active' },
    ];

    for (const t of emailTemplates) {
      const idx = emailTemplates.indexOf(t) + 1;
      await prisma.emailTemplate.upsert({
        where: { uid: `tmpl-${idx}` },
        update: {},
        create: {
          uid: `tmpl-${idx}`,
          name: t.name,
          subject: t.subject,
          type: t.type,
          body: t.body,
          status: t.status,
        },
      });
    }
    console.log(`    ✅ Created ${emailTemplates.length} email templates`);

    // ──────────────────────────────────────────────
    // 17. LANGUAGES (8)
    // ──────────────────────────────────────────────
    console.log('  Creating languages...');

    const languages = [
      { name: 'English', code: 'en', direction: 'LTR', status: 'active', isDefault: true },
      { name: 'Spanish', code: 'es', direction: 'LTR', status: 'active', isDefault: false },
      { name: 'French', code: 'fr', direction: 'LTR', status: 'active', isDefault: false },
      { name: 'German', code: 'de', direction: 'LTR', status: 'active', isDefault: false },
      { name: 'Hindi', code: 'hi', direction: 'LTR', status: 'inactive', isDefault: false },
      { name: 'Arabic', code: 'ar', direction: 'RTL', status: 'inactive', isDefault: false },
      { name: 'Portuguese', code: 'pt', direction: 'LTR', status: 'active', isDefault: false },
      { name: 'Japanese', code: 'ja', direction: 'LTR', status: 'inactive', isDefault: false },
    ];

    for (const l of languages) {
      await prisma.language.upsert({
        where: { code: l.code },
        update: {},
        create: {
          name: l.name,
          code: l.code,
          direction: l.direction,
          status: l.status,
          isDefault: l.isDefault,
        },
      });
    }
    console.log(`    ✅ Created ${languages.length} languages`);

    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
