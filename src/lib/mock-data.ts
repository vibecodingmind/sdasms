// Mock data for demo/prototype when database is not connected
// All API routes try Prisma first, fall back to mock data

export const mockUser = {
  id: 1,
  uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  parentId: null,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@admin.com',
  status: 'active',
  smsUnit: 52480,
  isAdmin: true,
  isCustomer: true,
  locale: 'en',
  timezone: 'UTC',
  avatar: null,
  dltEntityId: 'DLT_ENTITY_001',
  dltTelemarketerId: 'TM_001',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-12-01'),
};

export const mockDashboard = {
  totalContacts: 24583,
  smsSentToday: 12450,
  smsSentMonth: 347820,
  smsBalance: 52480,
  activeCampaigns: 7,
  deliveryRate: 94.5,
  contactsGrowth: 12.3,
  smsGrowth: 8.7,
  balanceGrowth: -3.2,
  campaignGrowth: 16.7,
  weeklyStats: [
    { day: 'Mon', sent: 45200, delivered: 42800, failed: 2400 },
    { day: 'Tue', sent: 52100, delivered: 49500, failed: 2600 },
    { day: 'Wed', sent: 48900, delivered: 46200, failed: 2700 },
    { day: 'Thu', sent: 61300, delivered: 58700, failed: 2600 },
    { day: 'Fri', sent: 54700, delivered: 52100, failed: 2600 },
    { day: 'Sat', sent: 38200, delivered: 36300, failed: 1900 },
    { day: 'Sun', sent: 29420, delivered: 27900, failed: 1520 },
  ],
  deliveryStatus: [
    { name: 'Delivered', value: 61400, color: '#22c55e' },
    { name: 'Failed', value: 4320, color: '#ef4444' },
    { name: 'Pending', value: 2890, color: '#f59e0b' },
    { name: 'Rejected', value: 870, color: '#8b5cf6' },
    { name: 'Bounced', value: 450, color: '#6b7280' },
  ],
  recentCampaigns: [
    { id: 1, uid: 'c1', campaignName: 'Flash Sale Weekend', status: 'done', contactCount: 15420, delivered: 14850, failed: 570, createdAt: '2024-12-01T10:30:00' },
    { id: 2, uid: 'c2', campaignName: 'Order Confirmation', status: 'sending', contactCount: 3250, delivered: 2100, failed: 85, createdAt: '2024-12-01T14:15:00' },
    { id: 3, uid: 'c3', campaignName: 'Appointment Reminder', status: 'scheduled', contactCount: 890, delivered: 0, failed: 0, createdAt: '2024-12-02T09:00:00' },
    { id: 4, uid: 'c4', campaignName: 'WhatsApp Promo Dec', status: 'done', contactCount: 5200, delivered: 4980, failed: 220, createdAt: '2024-11-30T16:45:00' },
    { id: 5, uid: 'c5', campaignName: 'OTP Verification', status: 'sending', contactCount: 1250, delivered: 890, failed: 30, createdAt: '2024-12-01T11:00:00' },
  ],
  recentActivity: [
    { id: 1, type: 'campaign', message: 'Campaign "Flash Sale Weekend" completed with 96.3% delivery rate', time: '2 hours ago' },
    { id: 2, type: 'payment', message: 'Top-up of ₹5,000 processed successfully', time: '4 hours ago' },
    { id: 3, type: 'contact', message: '1,250 new contacts imported from CSV', time: '6 hours ago' },
    { id: 4, type: 'alert', message: 'SMS balance running low (below 55,000)', time: '1 day ago' },
    { id: 5, type: 'campaign', message: 'Campaign "WhatsApp Promo Dec" completed', time: '1 day ago' },
    { id: 6, type: 'server', message: 'Sending server "Twilio India" reconnected', time: '2 days ago' },
  ],
};

export const mockCampaigns = [
  { id: 1, uid: 'c1', userId: 1, campaignName: 'Flash Sale Weekend', message: '🔥 MEGA SALE! Up to 70% OFF on all products. Use code FLASH70 at checkout. Offer valid this weekend only! Shop now: https://shop.example.com', mediaUrl: null, scheduleTime: '2024-12-01T10:30:00', scheduleType: 'onetime', status: 'done', dltTemplateId: '1107163284567890123', createdAt: '2024-12-01T10:30:00', contactCount: 15420, delivered: 14850, failed: 570, type: 'sms' },
  { id: 2, uid: 'c2', userId: 1, campaignName: 'Order Confirmation', message: 'Your order #ORD-2024-12345 has been confirmed! Expected delivery: Dec 5-7. Track here: https://shop.example.com/track/12345', mediaUrl: null, scheduleTime: null, scheduleType: 'onetime', status: 'sending', dltTemplateId: '1107163284567890124', createdAt: '2024-12-01T14:15:00', contactCount: 3250, delivered: 2100, failed: 85, type: 'sms' },
  { id: 3, uid: 'c3', userId: 1, campaignName: 'Appointment Reminder', message: 'Reminder: You have an appointment with Dr. Sharma on Dec 2 at 3:00 PM. Reply CANCEL to reschedule.', mediaUrl: null, scheduleTime: '2024-12-02T08:30:00', scheduleType: 'onetime', status: 'scheduled', dltTemplateId: '1107163284567890125', createdAt: '2024-12-01T20:00:00', contactCount: 890, delivered: 0, failed: 0, type: 'sms' },
  { id: 4, uid: 'c4', userId: 1, campaignName: 'WhatsApp Promo Dec', message: '🎉 December Special! Get 30% off on premium plans. Limited time offer. Tap to learn more!', mediaUrl: null, scheduleTime: null, scheduleType: 'onetime', status: 'done', dltTemplateId: null, createdAt: '2024-11-30T16:45:00', contactCount: 5200, delivered: 4980, failed: 220, type: 'whatsapp' },
  { id: 5, uid: 'c5', userId: 1, campaignName: 'OTP Verification', message: 'Your OTP for verification is {{otp}}. Valid for 5 minutes. Do not share this code.', mediaUrl: null, scheduleTime: null, scheduleType: 'onetime', status: 'sending', dltTemplateId: null, createdAt: '2024-12-01T11:00:00', contactCount: 1250, delivered: 890, failed: 30, type: 'otp' },
  { id: 6, uid: 'c6', userId: 1, campaignName: 'Viber Holiday Greetings', message: '✨ Wishing you a Happy Holiday Season! Enjoy exclusive deals at our store this December.', mediaUrl: null, scheduleTime: '2024-12-25T10:00:00', scheduleType: 'onetime', status: 'scheduled', dltTemplateId: null, createdAt: '2024-11-28T09:00:00', contactCount: 8000, delivered: 0, failed: 0, type: 'viber' },
  { id: 7, uid: 'c7', userId: 1, campaignName: 'Monthly Newsletter', message: '📰 Monthly Update: New features added, system maintenance scheduled, and tips for better delivery rates.', mediaUrl: null, scheduleTime: null, scheduleType: 'onetime', status: 'done', dltTemplateId: null, createdAt: '2024-11-25T08:00:00', contactCount: 24500, delivered: 23100, failed: 1400, type: 'sms' },
  { id: 8, uid: 'c8', userId: 1, campaignName: 'Payment Reminder', message: 'Friendly reminder: Your subscription expires in 3 days. Renew now to avoid service interruption.', mediaUrl: null, scheduleTime: null, scheduleType: 'onetime', status: 'failed', dltTemplateId: '1107163284567890126', createdAt: '2024-12-01T07:00:00', contactCount: 450, delivered: 120, failed: 330, type: 'sms' },
  { id: 9, uid: 'c9', userId: 1, campaignName: 'New Product Launch', message: '🚀 Introducing our newest product! Be the first to experience innovation. Pre-order now at https://shop.example.com/new', mediaUrl: null, scheduleTime: '2024-12-05T09:00:00', scheduleType: 'onetime', status: 'pending', dltTemplateId: null, createdAt: '2024-12-01T18:00:00', contactCount: 18000, delivered: 0, failed: 0, type: 'whatsapp' },
  { id: 10, uid: 'c10', userId: 1, campaignName: 'Delivery Update', message: 'Your package has been dispatched! Tracking ID: TK987654321. Expected delivery by Dec 3.', mediaUrl: null, scheduleTime: null, scheduleType: 'onetime', status: 'cancelled', dltTemplateId: null, createdAt: '2024-11-29T14:30:00', contactCount: 600, delivered: 0, failed: 0, type: 'sms' },
];

export const mockContacts = [
  { id: 1, uid: 'ct1', userId: 1, groupId: 1, phone: '+919876543210', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh@example.com', status: 'subscribed', createdAt: '2024-01-15' },
  { id: 2, uid: 'ct2', userId: 1, groupId: 1, phone: '+919876543211', firstName: 'Priya', lastName: 'Sharma', email: 'priya@example.com', status: 'subscribed', createdAt: '2024-01-16' },
  { id: 3, uid: 'ct3', userId: 1, groupId: 2, phone: '+919876543212', firstName: 'Amit', lastName: 'Patel', email: 'amit@example.com', status: 'subscribed', createdAt: '2024-01-17' },
  { id: 4, uid: 'ct4', userId: 1, groupId: 2, phone: '+919876543213', firstName: 'Sneha', lastName: 'Verma', email: 'sneha@example.com', status: 'unsubscribed', createdAt: '2024-02-01' },
  { id: 5, uid: 'ct5', userId: 1, groupId: 1, phone: '+919876543214', firstName: 'Vikram', lastName: 'Singh', email: 'vikram@example.com', status: 'subscribed', createdAt: '2024-02-05' },
  { id: 6, uid: 'ct6', userId: 1, groupId: 3, phone: '+919876543215', firstName: 'Neha', lastName: 'Gupta', email: 'neha@example.com', status: 'subscribed', createdAt: '2024-02-10' },
  { id: 7, uid: 'ct7', userId: 1, groupId: 3, phone: '+919876543216', firstName: 'Arjun', lastName: 'Reddy', email: 'arjun@example.com', status: 'blacklisted', createdAt: '2024-02-15' },
  { id: 8, uid: 'ct8', userId: 1, groupId: 2, phone: '+919876543217', firstName: 'Kavita', lastName: 'Joshi', email: 'kavita@example.com', status: 'subscribed', createdAt: '2024-02-20' },
  { id: 9, uid: 'ct9', userId: 1, groupId: 1, phone: '+919876543218', firstName: 'Deepak', lastName: 'Mehta', email: 'deepak@example.com', status: 'subscribed', createdAt: '2024-03-01' },
  { id: 10, uid: 'ct10', userId: 1, groupId: 3, phone: '+919876543219', firstName: 'Anita', lastName: 'Das', email: 'anita@example.com', status: 'subscribed', createdAt: '2024-03-05' },
  { id: 11, uid: 'ct11', userId: 1, groupId: 2, phone: '+919876543220', firstName: 'Rahul', lastName: 'Nair', email: 'rahul@example.com', status: 'subscribed', createdAt: '2024-03-10' },
  { id: 12, uid: 'ct12', userId: 1, groupId: 1, phone: '+919876543221', firstName: 'Pooja', lastName: 'Iyer', email: 'pooja@example.com', status: 'unsubscribed', createdAt: '2024-03-15' },
  { id: 13, uid: 'ct13', userId: 1, groupId: 3, phone: '+919876543222', firstName: 'Sanjay', lastName: 'Mishra', email: 'sanjay@example.com', status: 'subscribed', createdAt: '2024-03-20' },
  { id: 14, uid: 'ct14', userId: 1, groupId: 2, phone: '+919876543223', firstName: 'Meera', lastName: 'Pillai', email: 'meera@example.com', status: 'subscribed', createdAt: '2024-04-01' },
  { id: 15, uid: 'ct15', userId: 1, groupId: 1, phone: '+919876543224', firstName: 'Suresh', lastName: 'Rao', email: 'suresh@example.com', status: 'subscribed', createdAt: '2024-04-05' },
];

export const mockGroups = [
  { id: 1, uid: 'g1', userId: 1, name: 'Premium Customers', description: 'High-value customers with premium tier subscription', status: 'active', contactCount: 5240, createdAt: '2024-01-15' },
  { id: 2, uid: 'g2', userId: 1, name: 'New Users', description: 'Customers registered in the last 30 days', status: 'active', contactCount: 8320, createdAt: '2024-02-01' },
  { id: 3, uid: 'g3', userId: 1, name: 'Inactive Users', description: 'Users who have not logged in for 60+ days', status: 'active', contactCount: 3420, createdAt: '2024-02-15' },
  { id: 4, uid: 'g4', userId: 1, name: 'VIP Partners', description: 'Business partners and enterprise clients', status: 'active', contactCount: 450, createdAt: '2024-03-01' },
  { id: 5, uid: 'g5', userId: 1, name: 'Newsletter Subscribers', description: 'Opted in for monthly newsletter', status: 'active', contactCount: 12500, createdAt: '2024-03-15' },
  { id: 6, uid: 'g6', userId: 1, name: 'Trial Users', description: 'Users on free trial period', status: 'active', contactCount: 2150, createdAt: '2024-04-01' },
];

export const mockTemplates = [
  { id: 1, uid: 't1', userId: 1, name: 'OTP Verification', message: 'Your OTP for {{service}} is {{otp}}. Valid for 5 minutes. Do not share this code with anyone.', status: 'active', dltTemplateId: '1107163284567890123', createdAt: '2024-01-15' },
  { id: 2, uid: 't2', userId: 1, name: 'Order Confirmation', message: 'Hi {{name}}, your order #{{order_id}} has been confirmed! Expected delivery: {{delivery_date}}. Track: {{tracking_url}}', status: 'active', dltTemplateId: '1107163284567890124', createdAt: '2024-01-20' },
  { id: 3, uid: 't3', userId: 1, name: 'Appointment Reminder', message: 'Reminder: You have an appointment with {{doctor}} on {{date}} at {{time}}. Reply CANCEL to reschedule.', status: 'active', dltTemplateId: '1107163284567890125', createdAt: '2024-02-01' },
  { id: 4, uid: 't4', userId: 1, name: 'Payment Reminder', message: 'Hi {{name}}, your payment of ₹{{amount}} is due on {{due_date}}. Please pay now to avoid late fees.', status: 'active', dltTemplateId: '1107163284567890126', createdAt: '2024-02-15' },
  { id: 5, uid: 't5', userId: 1, name: 'Welcome Message', message: 'Welcome to {{company}}, {{name}}! We are excited to have you. Use code WELCOME10 for 10% off your first purchase.', status: 'active', dltTemplateId: '1107163284567890127', createdAt: '2024-03-01' },
  { id: 6, uid: 't6', userId: 1, name: 'Delivery Update', message: 'Your package is on its way! Tracking ID: {{tracking_id}}. Expected delivery: {{delivery_date}}.', status: 'inactive', dltTemplateId: null, createdAt: '2024-03-15' },
  { id: 7, uid: 't7', userId: 1, name: 'Flash Sale', message: '🔥 FLASH SALE! Up to {{discount}}% OFF on all products. Use code {{code}} at checkout. Valid {{validity}} only!', status: 'active', dltTemplateId: '1107163284567890128', createdAt: '2024-04-01' },
  { id: 8, uid: 't8', userId: 1, name: 'Account Verification', message: 'Verify your {{company}} account: {{verification_link}}. This link expires in 24 hours.', status: 'active', dltTemplateId: null, createdAt: '2024-04-10' },
];

export const mockSendingServers = [
  { id: 1, uid: 'ss1', userId: 1, name: 'Twilio India', type: 'http', status: 'active', quotaValue: 100, smsPerRequest: 100, settings: { url: 'https://api.twilio.com/2010-04-01', method: 'POST' }, createdAt: '2024-01-15' },
  { id: 2, uid: 'ss2', userId: 1, name: 'SMPP Gateway', type: 'smpp', status: 'active', quotaValue: 500, smsPerRequest: 200, settings: { host: 'smpp.example.com', port: 2775, systemId: 'smspro', systemType: 'SMPP' }, createdAt: '2024-02-01' },
  { id: 3, uid: 'ss3', userId: 1, name: 'WhatsApp Business API', type: 'whatsapp', status: 'active', quotaValue: 50, smsPerRequest: 50, settings: { phoneId: '123456789', accessToken: 'whatsapp_token' }, createdAt: '2024-02-15' },
  { id: 4, uid: 'ss4', userId: 1, name: 'Viber Business', type: 'viber', status: 'inactive', quotaValue: 30, smsPerRequest: 30, settings: { webhookUrl: 'https://smspro.example.com/webhook/viber' }, createdAt: '2024-03-01' },
  { id: 5, uid: 'ss5', userId: 1, name: 'MSG91 OTP', type: 'otp', status: 'active', quotaValue: 200, smsPerRequest: 100, settings: { authKey: 'msg91_auth_key', templateId: 'msg91_template' }, createdAt: '2024-03-15' },
  { id: 6, uid: 'ss6', userId: 1, name: 'AWS SNS', type: 'http', status: 'active', quotaValue: 1000, smsPerRequest: 500, settings: { region: 'ap-south-1', accessKey: 'AKIAIOSFODNN7' }, createdAt: '2024-04-01' },
];

export const mockSmsRoutes = [
  { id: 1, userId: 1, name: 'India Default Route', sendingServerId: 1, sendingServerName: 'Twilio India', connectType: 'http', countryIds: ['IN'], status: 'active', createdAt: '2024-01-15' },
  { id: 2, userId: 1, name: 'International Route', sendingServerId: 6, sendingServerName: 'AWS SNS', connectType: 'http', countryIds: ['US', 'UK', 'AE'], status: 'active', createdAt: '2024-02-01' },
  { id: 3, userId: 1, name: 'WhatsApp Route', sendingServerId: 3, sendingServerName: 'WhatsApp Business API', connectType: 'whatsapp', countryIds: ['IN', 'US', 'UK'], status: 'active', createdAt: '2024-02-15' },
  { id: 4, userId: 1, name: 'OTP Route India', sendingServerId: 5, sendingServerName: 'MSG91 OTP', connectType: 'otp', countryIds: ['IN'], status: 'active', createdAt: '2024-03-15' },
  { id: 5, userId: 1, name: 'High Volume Route', sendingServerId: 2, sendingServerName: 'SMPP Gateway', connectType: 'smpp', countryIds: ['IN'], status: 'inactive', createdAt: '2024-04-01' },
];

export const mockSenderIds = [
  { id: 1, uid: 'si1', userId: 1, senderId: 'SMSPro', status: 'active', supportingCountries: ['IN'], createdAt: '2024-01-15' },
  { id: 2, uid: 'si2', userId: 1, senderId: 'SHOPNOW', status: 'active', supportingCountries: ['IN'], createdAt: '2024-02-01' },
  { id: 3, uid: 'si3', userId: 1, senderId: 'MYAPP', status: 'pending', supportingCountries: ['IN', 'US'], createdAt: '2024-03-01' },
  { id: 4, uid: 'si4', userId: 1, senderId: 'ALERTS', status: 'active', supportingCountries: ['IN'], createdAt: '2024-03-15' },
  { id: 5, uid: 'si5', userId: 1, senderId: 'INFORM', status: 'inactive', supportingCountries: ['IN'], createdAt: '2024-04-01' },
  { id: 6, uid: 'si6', userId: 1, senderId: 'UPDATE', status: 'pending', supportingCountries: ['US', 'UK'], createdAt: '2024-04-10' },
];

export const mockReports = [
  { id: 1, userId: 1, campaignId: 1, from: 'SMSPro', to: '+919876543210', message: 'Flash Sale message...', status: 'delivered', cost: 0.50, smsCount: 1, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-12-01T10:30:15' },
  { id: 2, userId: 1, campaignId: 1, from: 'SMSPro', to: '+919876543211', message: 'Flash Sale message...', status: 'delivered', cost: 0.50, smsCount: 1, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-12-01T10:30:16' },
  { id: 3, userId: 1, campaignId: 1, from: 'SMSPro', to: '+919876543212', message: 'Flash Sale message...', status: 'failed', cost: 0, smsCount: 1, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-12-01T10:30:17' },
  { id: 4, userId: 1, campaignId: 2, from: 'SHOPNOW', to: '+919876543213', message: 'Order confirmation...', status: 'delivered', cost: 0.50, smsCount: 1, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-12-01T14:15:10' },
  { id: 5, userId: 1, campaignId: 2, from: 'SHOPNOW', to: '+919876543214', message: 'Order confirmation...', status: 'pending', cost: 0.50, smsCount: 1, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-12-01T14:15:11' },
  { id: 6, userId: 1, campaignId: 4, from: '919876543200', to: '+919876543215', message: 'WhatsApp promo...', status: 'delivered', cost: 0.75, smsCount: 1, direction: 'outbound', sendBy: 'WhatsApp Business', createdAt: '2024-11-30T16:45:20' },
  { id: 7, userId: 1, campaignId: 4, from: '919876543200', to: '+919876543216', message: 'WhatsApp promo...', status: 'read', cost: 0.75, smsCount: 1, direction: 'outbound', sendBy: 'WhatsApp Business', createdAt: '2024-11-30T16:45:21' },
  { id: 8, userId: 1, campaignId: 5, from: 'SMSPro', to: '+919876543217', message: 'OTP: 485923', status: 'delivered', cost: 0.30, smsCount: 1, direction: 'outbound', sendBy: 'MSG91', createdAt: '2024-12-01T11:00:05' },
  { id: 9, userId: 1, campaignId: 7, from: 'SMSPro', to: '+919876543218', message: 'Monthly newsletter...', status: 'delivered', cost: 0.50, smsCount: 2, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-11-25T08:00:30' },
  { id: 10, userId: 1, campaignId: 8, from: 'ALERTS', to: '+919876543219', message: 'Payment reminder...', status: 'failed', cost: 0, smsCount: 1, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-12-01T07:00:10' },
  { id: 11, userId: 1, campaignId: 8, from: 'ALERTS', to: '+919876543220', message: 'Payment reminder...', status: 'rejected', cost: 0, smsCount: 1, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-12-01T07:00:11' },
  { id: 12, userId: 1, campaignId: 7, from: 'SMSPro', to: '+919876543221', message: 'Monthly newsletter...', status: 'bounced', cost: 0.50, smsCount: 2, direction: 'outbound', sendBy: 'Twilio India', createdAt: '2024-11-25T08:00:35' },
];

export const mockPlans = [
  { id: 1, uid: 'p1', name: 'Starter', price: 999, billingCycle: 'monthly', status: 'active', isDlt: false, features: ['5,000 SMS/month', '1 Sending Server', 'Basic Reports', 'Email Support'], coverage: ['IN'], creditPrice: 0.20 },
  { id: 2, uid: 'p2', name: 'Business', price: 2999, billingCycle: 'monthly', status: 'active', isDlt: true, features: ['25,000 SMS/month', '5 Sending Servers', 'Advanced Reports', 'DLT Templates', 'Priority Support'], coverage: ['IN', 'US', 'UK', 'AE'], creditPrice: 0.12 },
  { id: 3, uid: 'p3', name: 'Professional', price: 7999, billingCycle: 'monthly', status: 'active', isDlt: true, features: ['100,000 SMS/month', 'Unlimited Servers', 'Analytics Dashboard', 'WhatsApp/Viber', 'API Access', '24/7 Support'], coverage: ['IN', 'US', 'UK', 'AE', 'SG', 'AU'], creditPrice: 0.08 },
  { id: 4, uid: 'p4', name: 'Enterprise', price: 19999, billingCycle: 'monthly', status: 'active', isDlt: true, features: ['500,000 SMS/month', 'Unlimited Everything', 'Custom Integration', 'Dedicated Account Manager', 'SLA Guarantee', 'White Label Option'], coverage: ['Global'], creditPrice: 0.04 },
  { id: 5, uid: 'p5', name: 'Starter Annual', price: 9999, billingCycle: 'yearly', status: 'active', isDlt: false, features: ['5,000 SMS/month', '1 Sending Server', 'Basic Reports', 'Email Support', 'Save 17%'], coverage: ['IN'], creditPrice: 0.17 },
  { id: 6, uid: 'p6', name: 'Business Annual', price: 29990, billingCycle: 'yearly', status: 'active', isDlt: true, features: ['25,000 SMS/month', '5 Sending Servers', 'Advanced Reports', 'DLT Templates', 'Priority Support', 'Save 17%'], coverage: ['IN', 'US', 'UK', 'AE'], creditPrice: 0.10 },
];

export const mockSubscription = {
  id: 1,
  uid: 'sub1',
  userId: 1,
  planId: 3,
  planName: 'Professional',
  status: 'active',
  currentPeriodEndsAt: '2025-01-15',
  smsUsed: 78250,
  smsLimit: 100000,
  price: 7999,
  billingCycle: 'monthly',
  createdAt: '2024-07-15',
};

export const mockTopups = [
  { id: 1, uid: 'tp1', userId: 1, paymentMethod: 'Razorpay', amount: 5000, currency: 'INR', status: 'completed', transactionId: 'TXN_001_2024', createdAt: '2024-12-01' },
  { id: 2, uid: 'tp2', userId: 1, paymentMethod: 'Razorpay', amount: 10000, currency: 'INR', status: 'completed', transactionId: 'TXN_002_2024', createdAt: '2024-11-15' },
  { id: 3, uid: 'tp3', userId: 1, paymentMethod: 'Stripe', amount: 5000, currency: 'INR', status: 'completed', transactionId: 'TXN_003_2024', createdAt: '2024-10-20' },
  { id: 4, uid: 'tp4', userId: 1, paymentMethod: 'Razorpay', amount: 25000, currency: 'INR', status: 'completed', transactionId: 'TXN_004_2024', createdAt: '2024-09-10' },
  { id: 5, uid: 'tp5', userId: 1, paymentMethod: 'Stripe', amount: 15000, currency: 'INR', status: 'failed', transactionId: 'TXN_005_2024', createdAt: '2024-08-25' },
];

export const mockInvoices = [
  { id: 1, uid: 'inv1', userId: 1, amount: 7999, currency: 'INR', status: 'paid', type: 'subscription', transactionId: 'INV_SUB_001', createdAt: '2024-12-01' },
  { id: 2, uid: 'inv2', userId: 1, amount: 7999, currency: 'INR', status: 'paid', type: 'subscription', transactionId: 'INV_SUB_002', createdAt: '2024-11-01' },
  { id: 3, uid: 'inv3', userId: 1, amount: 5000, currency: 'INR', status: 'paid', type: 'topup', transactionId: 'INV_TOP_001', createdAt: '2024-11-15' },
  { id: 4, uid: 'inv4', userId: 1, amount: 7999, currency: 'INR', status: 'paid', type: 'subscription', transactionId: 'INV_SUB_003', createdAt: '2024-10-01' },
  { id: 5, uid: 'inv5', userId: 1, amount: 10000, currency: 'INR', status: 'paid', type: 'topup', transactionId: 'INV_TOP_002', createdAt: '2024-10-20' },
];

export const mockWebhooks = [
  { id: 1, uid: 'wh1', userId: 1, url: 'https://myapp.example.com/webhooks/delivery', events: ['delivery_report', 'campaign_completed'], status: 'active', createdAt: '2024-03-15' },
  { id: 2, uid: 'wh2', userId: 1, url: 'https://crm.example.com/api/sms-events', events: ['contact_unsubscribed', 'contact_bounced'], status: 'active', createdAt: '2024-04-01' },
];
