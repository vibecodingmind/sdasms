// ============================================================
// Mock Data for SMS Admin Panel
// ============================================================

export const mockAdmin = {
  id: 1,
  uid: "admin-001",
  first_name: "Super",
  last_name: "Admin",
  email: "admin@admin.com",
  is_admin: true,
  avatar: null,
  status: "active",
};

export const mockCustomers = [
  { id: 1, uid: "c-001", first_name: "John", last_name: "Smith", email: "john@acmecorp.com", phone: "+1 555-0101", plan: "Enterprise", sms_balance: 45000, status: "active", joined: "2024-01-15", revenue: 12500 },
  { id: 2, uid: "c-002", first_name: "Sarah", last_name: "Johnson", email: "sarah@globaltech.com", phone: "+1 555-0102", plan: "Business", sms_balance: 22000, status: "active", joined: "2024-02-20", revenue: 8900 },
  { id: 3, uid: "c-003", first_name: "Michael", last_name: "Chen", email: "michael@asiainc.com", phone: "+86 138-0001", plan: "Starter", sms_balance: 5600, status: "active", joined: "2024-03-10", revenue: 3200 },
  { id: 4, uid: "c-004", first_name: "Emma", last_name: "Williams", email: "emma@euromail.com", phone: "+44 7700-0401", plan: "Enterprise", sms_balance: 67000, status: "active", joined: "2024-01-05", revenue: 15600 },
  { id: 5, uid: "c-005", first_name: "David", last_name: "Brown", email: "david@startup.io", phone: "+1 555-0105", plan: "Business", sms_balance: 12000, status: "inactive", joined: "2024-04-18", revenue: 5400 },
  { id: 6, uid: "c-006", first_name: "Lisa", last_name: "Martinez", email: "lisa@latamco.com", phone: "+52 55-0106", plan: "Starter", sms_balance: 800, status: "active", joined: "2024-05-22", revenue: 1500 },
  { id: 7, uid: "c-007", first_name: "James", last_name: "Wilson", email: "james@techfirm.com", phone: "+1 555-0107", plan: "Enterprise", sms_balance: 91000, status: "active", joined: "2023-11-30", revenue: 22000 },
  { id: 8, uid: "c-008", first_name: "Aisha", last_name: "Patel", email: "aisha@indiatech.in", phone: "+91 9876-0801", plan: "Business", sms_balance: 18500, status: "active", joined: "2024-06-01", revenue: 7200 },
  { id: 9, uid: "c-009", first_name: "Robert", last_name: "Taylor", email: "robert@mktgpro.com", phone: "+1 555-0109", plan: "Starter", sms_balance: 3200, status: "inactive", joined: "2024-07-15", revenue: 2800 },
  { id: 10, uid: "c-010", first_name: "Maria", last_name: "Garcia", email: "maria@bizlat.com", phone: "+34 600-1010", plan: "Business", sms_balance: 15000, status: "active", joined: "2024-03-25", revenue: 6100 },
  { id: 11, uid: "c-011", first_name: "Tom", last_name: "Anderson", email: "tom@nordic.se", phone: "+46 70-1011", plan: "Enterprise", sms_balance: 55000, status: "active", joined: "2024-02-14", revenue: 18200 },
  { id: 12, uid: "c-012", first_name: "Nina", last_name: "Kowalski", email: "nina@polandtel.pl", phone: "+48 500-1012", plan: "Starter", sms_balance: 1000, status: "active", joined: "2024-08-01", revenue: 950 },
];

export const mockSubscriptions = [
  { id: 1, uid: "sub-001", customer: "John Smith", plan: "Enterprise", start_date: "2024-01-15", end_date: "2025-01-15", status: "active", amount: 499.99 },
  { id: 2, uid: "sub-002", customer: "Sarah Johnson", plan: "Business", start_date: "2024-02-20", end_date: "2025-02-20", status: "active", amount: 199.99 },
  { id: 3, uid: "sub-003", customer: "Michael Chen", plan: "Starter", start_date: "2024-03-10", end_date: "2024-06-10", status: "expired", amount: 49.99 },
  { id: 4, uid: "sub-004", customer: "Emma Williams", plan: "Enterprise", start_date: "2024-01-05", end_date: "2025-01-05", status: "active", amount: 499.99 },
  { id: 5, uid: "sub-005", customer: "David Brown", plan: "Business", start_date: "2024-04-18", end_date: "2024-10-18", status: "expired", amount: 199.99 },
  { id: 6, uid: "sub-006", customer: "Lisa Martinez", plan: "Starter", start_date: "2024-05-22", end_date: "2025-05-22", status: "active", amount: 49.99 },
  { id: 7, uid: "sub-007", customer: "James Wilson", plan: "Enterprise", start_date: "2023-11-30", end_date: "2024-11-30", status: "active", amount: 499.99 },
  { id: 8, uid: "sub-008", customer: "Aisha Patel", plan: "Business", start_date: "2024-06-01", end_date: "2025-06-01", status: "active", amount: 199.99 },
  { id: 9, uid: "sub-009", customer: "Robert Taylor", plan: "Starter", start_date: "2024-07-15", end_date: "2024-07-15", status: "cancelled", amount: 49.99 },
  { id: 10, uid: "sub-010", customer: "Tom Anderson", plan: "Enterprise", start_date: "2024-02-14", end_date: "2025-02-14", status: "active", amount: 499.99 },
];

export const mockAnnouncements = [
  { id: 1, uid: "ann-001", title: "System Maintenance Scheduled", message: "We will be performing scheduled maintenance on Jan 15, 2025 from 2:00 AM to 4:00 AM UTC. Services may be temporarily unavailable.", status: "active", created: "2024-12-20" },
  { id: 2, uid: "ann-002", title: "New WhatsApp Channel Launch", message: "We're excited to announce the launch of our new WhatsApp Business API integration. All Enterprise and Business plan users can now send messages via WhatsApp.", status: "active", created: "2024-11-15" },
  { id: 3, uid: "ann-003", title: "Holiday Hours", message: "Our support team will have reduced hours during the holiday season. Emergency support will remain available 24/7.", status: "inactive", created: "2024-12-01" },
  { id: 4, uid: "ann-004", title: "Pricing Update for 2025", message: "Starting February 2025, there will be a small adjustment to our pricing plans. Current subscribers are locked in at their existing rates.", status: "active", created: "2025-01-05" },
];

export const mockPlans = [
  { id: 1, uid: "plan-001", name: "Starter", price: 49.99, billing_cycle: "monthly", features: { sms: "5,000", contacts: "1,000", groups: "5", sender_ids: "1", templates: "10" }, status: "active", credit_price: 0.01 },
  { id: 2, uid: "plan-002", name: "Business", price: 199.99, billing_cycle: "monthly", features: { sms: "50,000", contacts: "25,000", groups: "25", sender_ids: "5", templates: "50", api_access: true }, status: "active", credit_price: 0.008 },
  { id: 3, uid: "plan-003", name: "Enterprise", price: 499.99, billing_cycle: "monthly", features: { sms: "Unlimited", contacts: "Unlimited", groups: "Unlimited", sender_ids: "25", templates: "Unlimited", api_access: true, priority_support: true, dedicated_server: true }, status: "active", credit_price: 0.005 },
  { id: 4, uid: "plan-004", name: "Starter Annual", price: 499.00, billing_cycle: "yearly", features: { sms: "5,000/mo", contacts: "1,000", groups: "5", sender_ids: "1", templates: "10" }, status: "active", credit_price: 0.009 },
  { id: 5, uid: "plan-005", name: "Business Annual", price: 1999.00, billing_cycle: "yearly", features: { sms: "50,000/mo", contacts: "25,000", groups: "25", sender_ids: "5", templates: "50", api_access: true }, status: "active", credit_price: 0.007 },
];

export const mockCurrencies = [
  { id: 1, name: "US Dollar", code: "USD", symbol: "$", rate: 1.000, status: "active" },
  { id: 2, name: "Euro", code: "EUR", symbol: "€", rate: 0.92, status: "active" },
  { id: 3, name: "British Pound", code: "GBP", symbol: "£", rate: 0.79, status: "active" },
  { id: 4, name: "Indian Rupee", code: "INR", symbol: "₹", rate: 83.12, status: "active" },
  { id: 5, name: "Japanese Yen", code: "JPY", symbol: "¥", rate: 149.50, status: "inactive" },
  { id: 6, name: "Australian Dollar", code: "AUD", symbol: "A$", rate: 1.53, status: "inactive" },
];

export const mockSendingServers = [
  { id: 1, uid: "srv-001", name: "Twilio HTTP Gateway", type: "http", quota_value: 100000, status: "active", settings: { url: "https://api.twilio.com", api_key: "****" } },
  { id: 2, uid: "srv-002", name: "Nexmo SMPP Server", type: "smpp", quota_value: 500000, status: "active", settings: { host: "smpp.nexmo.com", port: 2775 } },
  { id: 3, uid: "srv-003", name: "WhatsApp Business API", type: "whatsapp", quota_value: 50000, status: "active", settings: { phone_id: "+1234567890", token: "****" } },
  { id: 4, uid: "srv-004", name: "Viber Business Channel", type: "viber", quota_value: 25000, status: "inactive", settings: { webhook: "https://..." } },
  { id: 5, uid: "srv-005", name: "MSG91 OTP Server", type: "otp", quota_value: 200000, status: "active", settings: { auth_key: "****" } },
  { id: 6, uid: "srv-006", name: "Plivo HTTP API", type: "http", quota_value: 75000, status: "active", settings: { auth_id: "****", auth_token: "****" } },
  { id: 7, uid: "srv-007", name: "Route Mobile SMPP", type: "smpp", quota_value: 300000, status: "inactive", settings: { host: "smpp.routemobile.com", port: 2776 } },
];

export const mockSenderIds = [
  { id: 1, uid: "sid-001", sender_id: "ACMECORP", customer: "John Smith", status: "active", countries: ["US", "CA", "UK"] },
  { id: 2, uid: "sid-002", sender_id: "GLOBALTECH", customer: "Sarah Johnson", status: "active", countries: ["US", "UK"] },
  { id: 3, uid: "sid-003", sender_id: "ASIATICK", customer: "Michael Chen", status: "pending", countries: ["IN", "SG"] },
  { id: 4, uid: "sid-004", sender_id: "EUROMAIL", customer: "Emma Williams", status: "active", countries: ["DE", "FR", "ES", "IT"] },
  { id: 5, uid: "sid-005", sender_id: "STARTUP1", customer: "David Brown", status: "inactive", countries: ["US"] },
  { id: 6, uid: "sid-006", sender_id: "LATAMCO", customer: "Lisa Martinez", status: "pending", countries: ["MX", "CO", "AR"] },
  { id: 7, uid: "sid-007", sender_id: "TECHFRM", customer: "James Wilson", status: "active", countries: ["US", "CA", "UK", "AU"] },
  { id: 8, uid: "sid-008", sender_id: "MKTGPRO", customer: "Robert Taylor", status: "active", countries: ["US"] },
];

export const mockBlacklists = [
  { id: 1, uid: "bl-001", number: "+1 555-999-0001", customer: "John Smith", reason: "Spam complaints received", date: "2024-08-15" },
  { id: 2, uid: "bl-002", number: "+1 555-999-0002", customer: "System", reason: "Invalid number - undeliverable", date: "2024-09-01" },
  { id: 3, uid: "bl-003", number: "+44 7700-999-003", customer: "Emma Williams", reason: "Opt-out request", date: "2024-10-05" },
  { id: 4, uid: "bl-004", number: "+91 9876-999-004", customer: "System", reason: "Regulatory block - DND", date: "2024-07-20" },
  { id: 5, uid: "bl-005", number: "+1 555-999-0005", customer: "Sarah Johnson", reason: "Abusive messages", date: "2024-11-12" },
];

export const mockSpamWords = [
  { id: 1, word: "FREE", category: "financial" },
  { id: 2, word: "WINNER", category: "scam" },
  { id: 3, word: "CONGRATULATIONS", category: "scam" },
  { id: 4, word: "CLICK HERE", category: "phishing" },
  { id: 5, word: "URGENT", category: "spam" },
  { id: 6, word: "100% FREE", category: "financial" },
  { id: 7, word: "NO COST", category: "financial" },
  { id: 8, word: "ACT NOW", category: "spam" },
  { id: 9, word: "LIMITED TIME", category: "spam" },
  { id: 10, word: "CASH BONUS", category: "financial" },
  { id: 11, word: "EARN MONEY", category: "financial" },
  { id: 12, word: "MILLION DOLLAR", category: "scam" },
  { id: 13, word: "NIGERIAN", category: "scam" },
  { id: 14, word: "LOTTERY", category: "scam" },
  { id: 15, word: "PRIZE CLAIM", category: "scam" },
];

export const mockBlockedSenderIds = [
  { id: 1, sender_id: "SPAMMER01", reason: "Sending unsolicited promotional messages", blocked_date: "2024-06-15" },
  { id: 2, sender_id: "FAKEALRT", reason: "Impersonation - phishing attempt", blocked_date: "2024-07-22" },
  { id: 3, sender_id: "TELEMKT1", reason: "Excessive spam complaints from recipients", blocked_date: "2024-08-30" },
  { id: 4, sender_id: "BULKMSG9", reason: "Violation of messaging policy", blocked_date: "2024-09-14" },
];

export const mockAdministrators = [
  { id: 1, first_name: "Super", last_name: "Admin", email: "admin@admin.com", role: "Super Admin", status: "active", last_login: "2025-01-10 14:30" },
  { id: 2, first_name: "Support", last_name: "Manager", email: "support@admin.com", role: "Support Admin", status: "active", last_login: "2025-01-10 09:15" },
  { id: 3, first_name: "Billing", last_name: "Admin", email: "billing@admin.com", role: "Billing Admin", status: "active", last_login: "2025-01-09 16:45" },
  { id: 4, first_name: "Tech", last_name: "Lead", email: "tech@admin.com", role: "Technical Admin", status: "inactive", last_login: "2024-12-28 11:00" },
];

export const mockRoles = [
  { id: 1, name: "Super Admin", users_count: 1, permissions: ["all"] },
  { id: 2, name: "Support Admin", users_count: 1, permissions: ["customers.view", "customers.edit", "reports.view", "announcements.manage"] },
  { id: 3, name: "Billing Admin", users_count: 1, permissions: ["invoices.view", "invoices.manage", "plans.manage", "customers.view"] },
  { id: 4, name: "Technical Admin", users_count: 1, permissions: ["servers.manage", "settings.manage", "reports.view"] },
  { id: 5, name: "Viewer", users_count: 0, permissions: ["customers.view", "reports.view", "dashboard.view"] },
];

export const mockCountries = [
  { id: 1, name: "United States", code: "US", phone_code: "+1", status: "active" },
  { id: 2, name: "United Kingdom", code: "GB", phone_code: "+44", status: "active" },
  { id: 3, name: "India", code: "IN", phone_code: "+91", status: "active" },
  { id: 4, name: "Germany", code: "DE", phone_code: "+49", status: "active" },
  { id: 5, name: "France", code: "FR", phone_code: "+33", status: "active" },
  { id: 6, name: "Canada", code: "CA", phone_code: "+1", status: "active" },
  { id: 7, name: "Australia", code: "AU", phone_code: "+61", status: "active" },
  { id: 8, name: "Japan", code: "JP", phone_code: "+81", status: "inactive" },
  { id: 9, name: "Brazil", code: "BR", phone_code: "+55", status: "inactive" },
  { id: 10, name: "Mexico", code: "MX", phone_code: "+52", status: "active" },
  { id: 11, name: "Spain", code: "ES", phone_code: "+34", status: "active" },
  { id: 12, name: "Italy", code: "IT", phone_code: "+39", status: "active" },
];

export const mockLanguages = [
  { id: 1, name: "English", code: "en", direction: "LTR", status: "active", is_default: true },
  { id: 2, name: "Spanish", code: "es", direction: "LTR", status: "active", is_default: false },
  { id: 3, name: "French", code: "fr", direction: "LTR", status: "active", is_default: false },
  { id: 4, name: "German", code: "de", direction: "LTR", status: "active", is_default: false },
  { id: 5, name: "Hindi", code: "hi", direction: "LTR", status: "inactive", is_default: false },
  { id: 6, name: "Arabic", code: "ar", direction: "RTL", status: "inactive", is_default: false },
  { id: 7, name: "Portuguese", code: "pt", direction: "LTR", status: "active", is_default: false },
  { id: 8, name: "Japanese", code: "ja", direction: "LTR", status: "inactive", is_default: false },
];

export const mockEmailTemplates = [
  { id: 1, name: "Welcome Email", subject: "Welcome to SDASMS!", type: "customer", body: "Dear {{name}},\n\nWelcome to SDASMS! Your account has been created successfully..." },
  { id: 2, name: "Password Reset", subject: "Reset Your Password", type: "auth", body: "Hello {{name}},\n\nYou requested a password reset. Click the link below..." },
  { id: 3, name: "Invoice Created", subject: "Invoice #{{invoice_id}} Created", type: "billing", body: "Dear {{name}},\n\nA new invoice has been generated for your subscription..." },
  { id: 4, name: "Subscription Expiring", subject: "Your Subscription is Expiring Soon", type: "billing", body: "Dear {{name}},\n\nYour subscription will expire on {{expiry_date}}..." },
  { id: 5, name: "SMS Balance Low", subject: "Low SMS Balance Alert", type: "notification", body: "Dear {{name}},\n\nYour SMS balance has fallen below the threshold..." },
  { id: 6, name: "Campaign Completed", subject: "Campaign Completed: {{campaign_name}}", type: "notification", body: "Dear {{name}},\n\nYour campaign '{{campaign_name}}' has completed..." },
];

export const mockPaymentGateways = [
  {
    id: 1, name: 'Pesapal', status: 'active', type: 'pesapal',
    description: 'East African payment gateway supporting M-Pesa, Airtel Money, Visa, Mastercard',
    logo: 'pesapal',
    mode: 'live',
    fields: {
      consumer_key: '****',
      consumer_secret: '****',
      ipn_url: 'https://sdasms.com/api/payments/pesapal/ipn',
      callback_url: 'https://sdasms.com/payments/pesapal/callback',
    },
    supported_currencies: ['KES', 'UGX', 'TZS', 'USD'],
    total_transactions: 342,
    total_revenue: 285750,
    last_transaction: '2025-01-10 14:23',
  },
  {
    id: 2, name: 'PayPal', status: 'active', type: 'paypal',
    description: 'Global payment platform supporting cards, bank transfers, and PayPal balance',
    logo: 'paypal',
    mode: 'live',
    fields: {
      client_id: '****',
      client_secret: '****',
      webhook_id: '****',
      webhook_url: 'https://sdasms.com/api/payments/paypal/webhook',
    },
    supported_currencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD'],
    total_transactions: 891,
    total_revenue: 456200,
    last_transaction: '2025-01-10 16:45',
  },
  {
    id: 3, name: 'Stripe', status: 'active', type: 'credit_card',
    description: 'Accept credit cards, debit cards, Apple Pay, Google Pay and more',
    logo: 'stripe',
    mode: 'live',
    fields: {
      publishable_key: '****',
      secret_key: '****',
      webhook_secret: '****',
      webhook_url: 'https://sdasms.com/api/payments/stripe/webhook',
    },
    supported_currencies: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY'],
    total_transactions: 1256,
    total_revenue: 687400,
    last_transaction: '2025-01-10 17:12',
  },
  {
    id: 4, name: 'Manual Payment', status: 'active', type: 'manual',
    description: 'Accept offline payments via bank transfer, check, or cash deposit with admin verification',
    logo: 'manual',
    mode: 'live',
    fields: {
      bank_name: 'National Bank of Kenya',
      account_name: 'SDASMS Limited',
      account_number: '0123456789012',
      branch: 'Nairobi Main',
      swift_code: 'NBOKENA0',
      payment_instructions: 'Please include your account email as the payment reference. Payments are verified within 24 hours on business days.',
    },
    supported_currencies: ['KES', 'USD', 'EUR', 'GBP', 'UGX', 'TZS'],
    total_transactions: 178,
    total_revenue: 124300,
    last_transaction: '2025-01-09 11:30',
  },
];

export const mockPaymentTransactions = [
  // Pesapal transactions
  { id: 1, transaction_id: 'PSP-2025-001', gateway: 'Pesapal', customer: 'John Smith', customer_email: 'john@acmecorp.com', amount: 499.99, currency: 'KES', method: 'M-Pesa', status: 'completed', description: 'Enterprise Plan - Monthly', created_at: '2025-01-10 14:23:00', verified_at: '2025-01-10 14:25:00' },
  { id: 2, transaction_id: 'PSP-2025-002', gateway: 'Pesapal', customer: 'Lisa Martinez', customer_email: 'lisa@latamco.com', amount: 49.99, currency: 'KES', method: 'Airtel Money', status: 'completed', description: 'Starter Plan - Monthly', created_at: '2025-01-09 10:15:00', verified_at: '2025-01-09 10:18:00' },
  { id: 3, transaction_id: 'PSP-2025-003', gateway: 'Pesapal', customer: 'Michael Chen', customer_email: 'michael@asiainc.com', amount: 25.00, currency: 'KES', method: 'Visa', status: 'pending', description: 'SMS Credit Top-up', created_at: '2025-01-10 16:00:00', verified_at: null },
  { id: 4, transaction_id: 'PSP-2025-004', gateway: 'Pesapal', customer: 'Aisha Patel', customer_email: 'aisha@indiatech.in', amount: 199.99, currency: 'KES', method: 'M-Pesa', status: 'failed', description: 'Business Plan - Monthly', created_at: '2025-01-08 09:30:00', verified_at: null },
  { id: 5, transaction_id: 'PSP-2025-005', gateway: 'Pesapal', customer: 'Maria Garcia', customer_email: 'maria@bizlat.com', amount: 199.99, currency: 'KES', method: 'Mastercard', status: 'completed', description: 'Business Plan - Monthly', created_at: '2025-01-07 14:00:00', verified_at: '2025-01-07 14:05:00' },
  // PayPal transactions
  { id: 6, transaction_id: 'PPL-2025-001', gateway: 'PayPal', customer: 'Emma Williams', customer_email: 'emma@euromail.com', amount: 499.99, currency: 'USD', method: 'PayPal Balance', status: 'completed', description: 'Enterprise Plan - Monthly', created_at: '2025-01-10 16:45:00', verified_at: '2025-01-10 16:46:00' },
  { id: 7, transaction_id: 'PPL-2025-002', gateway: 'PayPal', customer: 'Tom Anderson', customer_email: 'tom@nordic.se', amount: 499.99, currency: 'EUR', method: 'Credit Card', status: 'completed', description: 'Enterprise Plan - Monthly', created_at: '2025-01-10 12:30:00', verified_at: '2025-01-10 12:31:00' },
  { id: 8, transaction_id: 'PPL-2025-003', gateway: 'PayPal', customer: 'Sarah Johnson', customer_email: 'sarah@globaltech.com', amount: 199.99, currency: 'USD', method: 'PayPal Balance', status: 'completed', description: 'Business Plan - Monthly', created_at: '2025-01-09 15:00:00', verified_at: '2025-01-09 15:02:00' },
  { id: 9, transaction_id: 'PPL-2025-004', gateway: 'PayPal', customer: 'David Brown', customer_email: 'david@startup.io', amount: 25.00, currency: 'USD', method: 'Bank Transfer', status: 'refunded', description: 'SMS Credit Top-up', created_at: '2025-01-08 11:20:00', verified_at: '2025-01-08 11:22:00' },
  { id: 10, transaction_id: 'PPL-2025-005', gateway: 'PayPal', customer: 'Robert Taylor', customer_email: 'robert@mktgpro.com', amount: 15.00, currency: 'GBP', method: 'Debit Card', status: 'completed', description: 'SMS Credit Top-up', created_at: '2025-01-07 09:00:00', verified_at: '2025-01-07 09:01:00' },
  // Stripe transactions
  { id: 11, transaction_id: 'STR-2025-001', gateway: 'Stripe', customer: 'James Wilson', customer_email: 'james@techfirm.com', amount: 499.99, currency: 'USD', method: 'Visa •••• 4242', status: 'completed', description: 'Enterprise Plan - Monthly', created_at: '2025-01-10 17:12:00', verified_at: '2025-01-10 17:12:00' },
  { id: 12, transaction_id: 'STR-2025-002', gateway: 'Stripe', customer: 'Nina Kowalski', customer_email: 'nina@polandtel.pl', amount: 49.99, currency: 'EUR', method: 'Mastercard •••• 8888', status: 'completed', description: 'Starter Plan - Monthly', created_at: '2025-01-10 14:00:00', verified_at: '2025-01-10 14:00:00' },
  { id: 13, transaction_id: 'STR-2025-003', gateway: 'Stripe', customer: 'John Smith', customer_email: 'john@acmecorp.com', amount: 50.00, currency: 'USD', method: 'Apple Pay', status: 'completed', description: 'SMS Credit Top-up', created_at: '2025-01-09 16:30:00', verified_at: '2025-01-09 16:30:00' },
  { id: 14, transaction_id: 'STR-2025-004', gateway: 'Stripe', customer: 'Aisha Patel', customer_email: 'aisha@indiatech.in', amount: 199.99, currency: 'INR', method: 'Google Pay', status: 'failed', description: 'Business Plan - Monthly', created_at: '2025-01-08 08:00:00', verified_at: null },
  { id: 15, transaction_id: 'STR-2025-005', gateway: 'Stripe', customer: 'Emma Williams', customer_email: 'emma@euromail.com', amount: 100.00, currency: 'USD', method: 'Visa •••• 1234', status: 'completed', description: 'SMS Credit Top-up', created_at: '2025-01-07 11:45:00', verified_at: '2025-01-07 11:45:00' },
  // Manual transactions
  { id: 16, transaction_id: 'MAN-2025-001', gateway: 'Manual Payment', customer: 'Tom Anderson', customer_email: 'tom@nordic.se', amount: 499.99, currency: 'KES', method: 'Bank Transfer', status: 'completed', description: 'Enterprise Plan - Monthly', created_at: '2025-01-09 11:30:00', verified_at: '2025-01-10 09:00:00' },
  { id: 17, transaction_id: 'MAN-2025-002', gateway: 'Manual Payment', customer: 'Maria Garcia', customer_email: 'maria@bizlat.com', amount: 199.99, currency: 'USD', method: 'Bank Deposit', status: 'completed', description: 'Business Plan - Monthly', created_at: '2025-01-08 13:00:00', verified_at: '2025-01-08 16:00:00' },
  { id: 18, transaction_id: 'MAN-2025-003', gateway: 'Manual Payment', customer: 'Robert Taylor', customer_email: 'robert@mktgpro.com', amount: 49.99, currency: 'KES', method: 'Check', status: 'pending', description: 'Starter Plan - Monthly', created_at: '2025-01-10 10:00:00', verified_at: null },
  { id: 19, transaction_id: 'MAN-2025-004', gateway: 'Manual Payment', customer: 'Lisa Martinez', customer_email: 'lisa@latamco.com', amount: 30.00, currency: 'USD', method: 'Cash Deposit', status: 'rejected', description: 'SMS Credit Top-up', created_at: '2025-01-07 08:30:00', verified_at: null },
  { id: 20, transaction_id: 'MAN-2025-005', gateway: 'Manual Payment', customer: 'David Brown', customer_email: 'david@startup.io', amount: 199.99, currency: 'KES', method: 'Bank Transfer', status: 'completed', description: 'Business Plan - Monthly', created_at: '2025-01-06 15:00:00', verified_at: '2025-01-07 10:00:00' },
];

export const mockInvoices = [
  { id: 1, uid: "inv-001", invoice_no: "INV-2024-001", customer: "John Smith", amount: 499.99, status: "paid", date: "2024-01-15", type: "subscription" },
  { id: 2, uid: "inv-002", invoice_no: "INV-2024-002", customer: "Sarah Johnson", amount: 199.99, status: "paid", date: "2024-02-20", type: "subscription" },
  { id: 3, uid: "inv-003", invoice_no: "INV-2024-003", customer: "Michael Chen", amount: 49.99, status: "paid", date: "2024-03-10", type: "subscription" },
  { id: 4, uid: "inv-004", invoice_no: "INV-2024-004", customer: "Emma Williams", amount: 499.99, status: "paid", date: "2024-04-05", type: "subscription" },
  { id: 5, uid: "inv-005", invoice_no: "INV-2024-005", customer: "David Brown", amount: 25.00, status: "unpaid", date: "2024-10-18", type: "topup" },
  { id: 6, uid: "inv-006", invoice_no: "INV-2024-006", customer: "Lisa Martinez", amount: 49.99, status: "paid", date: "2024-05-22", type: "subscription" },
  { id: 7, uid: "inv-007", invoice_no: "INV-2024-007", customer: "James Wilson", amount: 499.99, status: "paid", date: "2024-06-30", type: "subscription" },
  { id: 8, uid: "inv-008", invoice_no: "INV-2024-008", customer: "Aisha Patel", amount: 199.99, status: "unpaid", date: "2024-12-01", type: "subscription" },
  { id: 9, uid: "inv-009", invoice_no: "INV-2024-009", customer: "Robert Taylor", amount: 15.00, status: "paid", date: "2024-07-15", type: "topup" },
  { id: 10, uid: "inv-010", invoice_no: "INV-2025-001", customer: "Tom Anderson", amount: 499.99, status: "unpaid", date: "2025-01-14", type: "subscription" },
  { id: 11, uid: "inv-011", invoice_no: "INV-2024-011", customer: "Maria Garcia", amount: 199.99, status: "paid", date: "2024-08-25", type: "subscription" },
  { id: 12, uid: "inv-012", invoice_no: "INV-2024-012", customer: "John Smith", amount: 50.00, status: "paid", date: "2024-09-10", type: "topup" },
];

export const mockSmsHistory = [
  { id: 1, from: "ACMECORP", to: "+1 555-0101", message: "Your order #12345 has been shipped! Track at example.com/track", status: "delivered", cost: 0.012, date: "2025-01-10 14:30:00" },
  { id: 2, from: "GLOBALTECH", to: "+44 7700-0401", message: "Meeting reminder: Team standup at 10 AM tomorrow", status: "delivered", cost: 0.015, date: "2025-01-10 13:45:00" },
  { id: 3, from: "ACMECORP", to: "+1 555-0201", message: "Flash Sale! 50% off all items. Use code FLASH50 at checkout", status: "sent", cost: 0.012, date: "2025-01-10 12:00:00" },
  { id: 4, from: "TECHFRM", to: "+1 555-0107", message: "Your subscription will renew on Feb 1. Current plan: Enterprise", status: "delivered", cost: 0.012, date: "2025-01-10 11:30:00" },
  { id: 5, from: "EUROMAIL", to: "+49 151-0801", message: "Willkommen! Ihr Konto wurde erfolgreich erstellt.", status: "delivered", cost: 0.018, date: "2025-01-10 10:15:00" },
  { id: 6, from: "ASIATICK", to: "+86 138-0001", message: "您的验证码是 456789，5分钟内有效", status: "failed", cost: 0.020, date: "2025-01-10 09:00:00" },
  { id: 7, from: "ACMECORP", to: "+1 555-0301", message: "Appointment confirmed for Jan 15 at 2:00 PM", status: "delivered", cost: 0.012, date: "2025-01-10 08:30:00" },
  { id: 8, from: "LATAMCO", to: "+52 55-0106", message: "Recordatorio: Su cita es manana a las 10:00 AM", status: "pending", cost: 0.016, date: "2025-01-10 07:45:00" },
  { id: 9, from: "MKTGPRO", to: "+1 555-0401", message: "Don't miss our webinar on SMS marketing best practices!", status: "delivered", cost: 0.012, date: "2025-01-09 16:00:00" },
  { id: 10, from: "NORDICTECH", to: "+46 70-1011", message: "Din beställning har skickats. Spårningsnummer: SE123456789", status: "delivered", cost: 0.022, date: "2025-01-09 15:00:00" },
  { id: 11, from: "ACMECORP", to: "+1 555-0501", message: "Happy Birthday! Enjoy 20% off your next purchase", status: "delivered", cost: 0.012, date: "2025-01-09 14:00:00" },
  { id: 12, from: "GLOBALTECH", to: "+1 555-0601", message: "Your OTP for account verification is 839201", status: "failed", cost: 0.012, date: "2025-01-09 13:00:00" },
];

export const mockCampaigns = [
  { id: 1, uid: "camp-001", name: "January Promo", customer: "John Smith", type: "SMS", status: "completed", contacts: 5000, delivered: 4850, failed: 150, date: "2025-01-05" },
  { id: 2, uid: "camp-002", name: "Flash Sale Alert", customer: "Sarah Johnson", type: "SMS", status: "completed", contacts: 12000, delivered: 11750, failed: 250, date: "2025-01-03" },
  { id: 3, uid: "camp-003", name: "Welcome Series", customer: "Emma Williams", type: "WhatsApp", status: "active", contacts: 3500, delivered: 2100, failed: 50, date: "2025-01-10" },
  { id: 4, uid: "camp-004", name: "Payment Reminder", customer: "James Wilson", type: "SMS", status: "completed", contacts: 850, delivered: 820, failed: 30, date: "2025-01-08" },
  { id: 5, uid: "camp-005", name: "New Year Greetings", customer: "Lisa Martinez", type: "SMS", status: "completed", contacts: 2000, delivered: 1950, failed: 50, date: "2024-12-31" },
  { id: 6, uid: "camp-006", name: "OTP Verification", customer: "System", type: "OTP", status: "completed", contacts: 45000, delivered: 44200, failed: 800, date: "2025-01-09" },
  { id: 7, uid: "camp-007", name: "Weekly Newsletter", customer: "Tom Anderson", type: "SMS", status: "scheduled", contacts: 18000, delivered: 0, failed: 0, date: "2025-01-15" },
  { id: 8, uid: "camp-008", name: "Abandoned Cart", customer: "Maria Garcia", type: "WhatsApp", status: "active", contacts: 500, delivered: 320, failed: 10, date: "2025-01-10" },
];

export const mockDashboardStats = {
  totalCustomers: 1247,
  customersGrowth: 12.5,
  smsSentToday: 34567,
  smsGrowth: 8.2,
  revenue: 45230.50,
  revenueGrowth: 15.3,
  activeSubscriptions: 892,
  subscriptionsGrowth: 5.7,
};

export const mockRevenueData = [
  { month: "Jul", revenue: 28500 },
  { month: "Aug", revenue: 32100 },
  { month: "Sep", revenue: 29800 },
  { month: "Oct", revenue: 35600 },
  { month: "Nov", revenue: 38200 },
  { month: "Dec", revenue: 42100 },
  { month: "Jan", revenue: 45230 },
];

export const mockRecentOrders = [
  { id: 1, customer: "John Smith", plan: "Enterprise", amount: "$499.99", date: "Jan 15, 2025", status: "completed" },
  { id: 2, customer: "Sarah Johnson", plan: "Business", amount: "$199.99", date: "Jan 14, 2025", status: "completed" },
  { id: 3, customer: "Tom Anderson", plan: "Enterprise", amount: "$499.99", date: "Jan 14, 2025", status: "pending" },
  { id: 4, customer: "Lisa Martinez", plan: "Starter", amount: "$49.99", date: "Jan 13, 2025", status: "completed" },
  { id: 5, customer: "Aisha Patel", plan: "Business", amount: "$199.99", date: "Jan 12, 2025", status: "failed" },
];

export const mockTopCustomers = [
  { name: "James Wilson", email: "james@techfirm.com", sent: 156000, revenue: "$22,000" },
  { name: "Emma Williams", email: "emma@euromail.com", sent: 128500, revenue: "$15,600" },
  { name: "Tom Anderson", email: "tom@nordic.se", sent: 98200, revenue: "$18,200" },
  { name: "John Smith", email: "john@acmecorp.com", sent: 87000, revenue: "$12,500" },
  { name: "Sarah Johnson", email: "sarah@globaltech.com", sent: 62400, revenue: "$8,900" },
];

export const mockSystemOverview = {
  totalUsers: 1247,
  messagesQueued: 1250,
  serverStatus: "Operational",
  uptime: "99.97%",
  dbSize: "2.4 GB",
  lastBackup: "2 hours ago",
};

export const mockReportStats = {
  totalSent: 523450,
  delivered: 510820,
  failed: 8630,
  pending: 4000,
};

export const mockSmsTrend = [
  { date: "Jan 1", sent: 28000 },
  { date: "Jan 2", sent: 32000 },
  { date: "Jan 3", sent: 45000 },
  { date: "Jan 4", sent: 38000 },
  { date: "Jan 5", sent: 52000 },
  { date: "Jan 6", sent: 22000 },
  { date: "Jan 7", sent: 18000 },
  { date: "Jan 8", sent: 35000 },
  { date: "Jan 9", sent: 42000 },
  { date: "Jan 10", sent: 34567 },
];

export const mockDeliveryBreakdown = [
  { name: "Delivered", value: 510820, color: "#10B981" },
  { name: "Failed", value: 8630, color: "#EF4444" },
  { name: "Pending", value: 4000, color: "#F59E0B" },
  { name: "Rejected", value: 150, color: "#6B7280" },
];

export const mockSettings = {
  app_name: "SDASMS",
  logo_url: "/logo.png",
  default_country: "US",
  default_timezone: "UTC",
  sms_unit_cost: "0.012",
  sender_id_verification: true,
  dlt_enabled: false,
  maintenance_mode: false,
  maintenance_message: "We are performing scheduled maintenance. Please try again later.",
  ai_enabled: false,
  ai_api_key: "",
  ai_model: "gpt-3.5-turbo",
  terms_of_use: "# Terms of Use\n\n## 1. Acceptance of Terms\n\nBy accessing and using SDASMS, you agree to be bound by these Terms of Use...\n\n## 2. Service Description\n\nSDASMS provides bulk SMS and multi-channel messaging services...\n\n## 3. User Responsibilities\n\nUsers are responsible for maintaining the confidentiality of their account...",
  privacy_policy: "# Privacy Policy\n\n## 1. Information Collection\n\nWe collect information you provide directly to us, including name, email, phone number...\n\n## 2. Use of Information\n\nWe use the information we collect to provide, maintain, and improve our services...\n\n## 3. Data Security\n\nWe implement appropriate technical and organizational security measures...",
  current_version: "v3.2.1",
  php_version: "8.2.15",
  db_version: "MySQL 8.0.35",
  node_version: "20.11.0",
};
