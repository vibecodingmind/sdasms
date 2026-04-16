// ============================================================
// RBAC - Role-Based Access Control System for SDASMS
// ============================================================

// ==================== ROLE DEFINITIONS ====================
export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'support_admin'
  | 'billing_admin'
  | 'technical_admin'
  | 'viewer'
  | 'customer_owner'
  | 'customer_admin'
  | 'customer_member';

export type PermissionScope = 'admin' | 'customer';

// ==================== PERMISSION DEFINITIONS ====================
// Format: resource.action
export const AdminPermissions = {
  // Dashboard
  dashboard: { label: 'Dashboard', scope: 'admin' as PermissionScope },
  'dashboard.view': { label: 'View Dashboard', scope: 'admin' as PermissionScope },

  // Customer Management
  customers: { label: 'Customers', scope: 'admin' as PermissionScope },
  'customers.view': { label: 'View Customers', scope: 'admin' as PermissionScope },
  'customers.create': { label: 'Create Customers', scope: 'admin' as PermissionScope },
  'customers.edit': { label: 'Edit Customers', scope: 'admin' as PermissionScope },
  'customers.delete': { label: 'Delete Customers', scope: 'admin' as PermissionScope },
  'customers.impersonate': { label: 'Impersonate Customers', scope: 'admin' as PermissionScope },

  // Subscriptions
  subscriptions: { label: 'Subscriptions', scope: 'admin' as PermissionScope },
  'subscriptions.view': { label: 'View Subscriptions', scope: 'admin' as PermissionScope },
  'subscriptions.manage': { label: 'Manage Subscriptions', scope: 'admin' as PermissionScope },

  // Announcements
  announcements: { label: 'Announcements', scope: 'admin' as PermissionScope },
  'announcements.view': { label: 'View Announcements', scope: 'admin' as PermissionScope },
  'announcements.manage': { label: 'Manage Announcements', scope: 'admin' as PermissionScope },

  // Plans
  plans: { label: 'Plans', scope: 'admin' as PermissionScope },
  'plans.view': { label: 'View Plans', scope: 'admin' as PermissionScope },
  'plans.manage': { label: 'Manage Plans', scope: 'admin' as PermissionScope },

  // Currencies
  currencies: { label: 'Currencies', scope: 'admin' as PermissionScope },
  'currencies.manage': { label: 'Manage Currencies', scope: 'admin' as PermissionScope },

  // Sending
  sending_servers: { label: 'Sending Servers', scope: 'admin' as PermissionScope },
  'sending_servers.view': { label: 'View Sending Servers', scope: 'admin' as PermissionScope },
  'sending_servers.manage': { label: 'Manage Sending Servers', scope: 'admin' as PermissionScope },
  'sms_templates': { label: 'SMS Templates', scope: 'admin' as PermissionScope },
  'sms_templates.view': { label: 'View SMS Templates', scope: 'admin' as PermissionScope },
  'sms_templates.manage': { label: 'Manage SMS Templates', scope: 'admin' as PermissionScope },
  'sender_ids': { label: 'Sender IDs', scope: 'admin' as PermissionScope },
  'sender_ids.view': { label: 'View Sender IDs', scope: 'admin' as PermissionScope },
  'sender_ids.manage': { label: 'Manage Sender IDs', scope: 'admin' as PermissionScope },

  // Security
  blacklist: { label: 'Blacklist', scope: 'admin' as PermissionScope },
  'blacklist.view': { label: 'View Blacklist', scope: 'admin' as PermissionScope },
  'blacklist.manage': { label: 'Manage Blacklist', scope: 'admin' as PermissionScope },
  spam_words: { label: 'Spam Words', scope: 'admin' as PermissionScope },
  'spam_words.manage': { label: 'Manage Spam Words', scope: 'admin' as PermissionScope },
  blocked_sender_ids: { label: 'Blocked Sender IDs', scope: 'admin' as PermissionScope },
  'blocked_sender_ids.manage': { label: 'Manage Blocked Sender IDs', scope: 'admin' as PermissionScope },

  // Administrators
  administrators: { label: 'Administrators', scope: 'admin' as PermissionScope },
  'administrators.view': { label: 'View Administrators', scope: 'admin' as PermissionScope },
  'administrators.manage': { label: 'Manage Administrators', scope: 'admin' as PermissionScope },
  admin_roles: { label: 'Admin Roles', scope: 'admin' as PermissionScope },
  'admin_roles.manage': { label: 'Manage Admin Roles', scope: 'admin' as PermissionScope },

  // Settings
  settings: { label: 'Settings', scope: 'admin' as PermissionScope },
  'settings.view': { label: 'View Settings', scope: 'admin' as PermissionScope },
  'settings.manage': { label: 'Manage Settings', scope: 'admin' as PermissionScope },
  countries: { label: 'Countries', scope: 'admin' as PermissionScope },
  'countries.manage': { label: 'Manage Countries', scope: 'admin' as PermissionScope },
  ai_setting: { label: 'AI Setting', scope: 'admin' as PermissionScope },
  'ai_setting.manage': { label: 'Manage AI Setting', scope: 'admin' as PermissionScope },
  languages: { label: 'Languages', scope: 'admin' as PermissionScope },
  'languages.manage': { label: 'Manage Languages', scope: 'admin' as PermissionScope },
  payment_gateways: { label: 'Payment Gateways', scope: 'admin' as PermissionScope },
  'payment_gateways.manage': { label: 'Manage Payment Gateways', scope: 'admin' as PermissionScope },
  email_templates: { label: 'Email Templates', scope: 'admin' as PermissionScope },
  'email_templates.manage': { label: 'Manage Email Templates', scope: 'admin' as PermissionScope },
  maintenance_mode: { label: 'Maintenance Mode', scope: 'admin' as PermissionScope },
  'maintenance_mode.manage': { label: 'Manage Maintenance Mode', scope: 'admin' as PermissionScope },
  update_application: { label: 'Update Application', scope: 'admin' as PermissionScope },
  'update_application.manage': { label: 'Manage Update Application', scope: 'admin' as PermissionScope },

  // Reports
  reports: { label: 'Reports', scope: 'admin' as PermissionScope },
  'reports.view': { label: 'View Reports', scope: 'admin' as PermissionScope },
  'reports.sms_history': { label: 'SMS History Reports', scope: 'admin' as PermissionScope },
  'reports.campaigns': { label: 'Campaign Reports', scope: 'admin' as PermissionScope },

  // Invoices
  invoices: { label: 'Invoices', scope: 'admin' as PermissionScope },
  'invoices.view': { label: 'View Invoices', scope: 'admin' as PermissionScope },
  'invoices.manage': { label: 'Manage Invoices', scope: 'admin' as PermissionScope },

  // Support
  support_tickets: { label: 'Support Tickets', scope: 'admin' as PermissionScope },
  'support_tickets.view': { label: 'View Support Tickets', scope: 'admin' as PermissionScope },
  'support_tickets.manage': { label: 'Manage Support Tickets', scope: 'admin' as PermissionScope },
  help_center: { label: 'Help Center', scope: 'admin' as PermissionScope },

  // SMS
  'sms.send': { label: 'Send SMS', scope: 'admin' as PermissionScope },
  'sms.compose': { label: 'Compose SMS', scope: 'admin' as PermissionScope },

  // Theme
  'theme.customizer': { label: 'Theme Customizer', scope: 'admin' as PermissionScope },

  // Terms & Privacy
  'terms_of_use.manage': { label: 'Manage Terms of Use', scope: 'admin' as PermissionScope },
  'privacy_policy.manage': { label: 'Manage Privacy Policy', scope: 'admin' as PermissionScope },
} as const;

export type AdminPermissionKey = keyof typeof AdminPermissions;

// Customer-side permissions
export const CustomerPermissions = {
  // Dashboard
  dashboard: { label: 'Dashboard' },

  // SMS
  'sms.quick_send': { label: 'Quick Send' },
  'sms.campaign_builder': { label: 'Campaign Builder' },
  'sms.send_using_file': { label: 'Send Using File' },
  'sms.templates': { label: 'SMS Templates' },

  // Contacts
  'contacts.view': { label: 'View Contacts' },
  'contacts.create': { label: 'Create Contacts' },
  'contacts.edit': { label: 'Edit Contacts' },
  'contacts.delete': { label: 'Delete Contacts' },
  'contact_groups.view': { label: 'View Contact Groups' },
  'contact_groups.create': { label: 'Create Contact Groups' },
  'contact_groups.edit': { label: 'Edit Contact Groups' },
  'contact_groups.delete': { label: 'Delete Contact Groups' },

  // Sender IDs
  'sender_ids.view': { label: 'View Sender IDs' },
  'sender_ids.request': { label: 'Request Sender ID' },
  'sender_ids.delete': { label: 'Delete Sender ID' },

  // Messages & Reports
  'all_messages.view': { label: 'View All Messages' },
  'campaigns.view': { label: 'View Campaigns' },
  'reports.view': { label: 'View Reports' },

  // Blacklist
  'blacklist.view': { label: 'View Blacklist' },
  'blacklist.create': { label: 'Create Blacklist' },
  'blacklist.delete': { label: 'Delete Blacklist' },

  // Billing
  'billing.view': { label: 'View Billing' },
  'billing.topup': { label: 'Top Up SMS' },
  'billing.invoices': { label: 'View Invoices' },

  // Account & Settings
  'account.view': { label: 'View Account' },
  'account.edit': { label: 'Edit Account' },
  'settings.view': { label: 'View Settings' },
  'settings.manage': { label: 'Manage Settings' },

  // Team (sub-user management - owner/admin only)
  'team.view': { label: 'View Team' },
  'team.invite': { label: 'Invite Users' },
  'team.edit': { label: 'Edit Team Members' },
  'team.delete': { label: 'Remove Team Members' },
  'team.roles': { label: 'Manage Roles' },

  // Support
  'support.view': { label: 'View Support' },
  'support.create': { label: 'Create Ticket' },

  // Developers
  'developers.view': { label: 'View Developers' },
  'developers.regenerate_token': { label: 'Regenerate API Token' },

  // Automations
  'automations.view': { label: 'View Automations' },
  'automations.manage': { label: 'Manage Automations' },
} as const;

export type CustomerPermissionKey = keyof typeof CustomerPermissions;

// ==================== ROLE-PERMISSION MAPPINGS ====================
// Maps each role to its set of permissions
export const RolePermissionMap: Record<UserRole, string[]> = {
  super_admin: ['all'],

  admin: [
    'dashboard', 'dashboard.view',
    'customers', 'customers.view', 'customers.create', 'customers.edit',
    'subscriptions', 'subscriptions.view', 'subscriptions.manage',
    'announcements', 'announcements.view', 'announcements.manage',
    'plans', 'plans.view',
    'sending_servers', 'sending_servers.view',
    'sms_templates', 'sms_templates.view',
    'sender_ids', 'sender_ids.view',
    'blacklist', 'blacklist.view',
    'reports', 'reports.view', 'reports.sms_history', 'reports.campaigns',
    'invoices', 'invoices.view',
    'support_tickets', 'support_tickets.view',
    'help_center',
    'sms.send', 'sms.compose',
  ],

  support_admin: [
    'dashboard', 'dashboard.view',
    'customers', 'customers.view', 'customers.edit',
    'subscriptions', 'subscriptions.view',
    'announcements', 'announcements.view',
    'support_tickets', 'support_tickets.view', 'support_tickets.manage',
    'help_center',
    'reports', 'reports.view',
  ],

  billing_admin: [
    'dashboard', 'dashboard.view',
    'customers', 'customers.view',
    'subscriptions', 'subscriptions.view', 'subscriptions.manage',
    'plans', 'plans.view', 'plans.manage',
    'invoices', 'invoices.view', 'invoices.manage',
    'currencies', 'currencies.manage',
    'payment_gateways', 'payment_gateways.manage',
    'reports', 'reports.view',
  ],

  technical_admin: [
    'dashboard', 'dashboard.view',
    'sending_servers', 'sending_servers.view', 'sending_servers.manage',
    'settings', 'settings.view', 'settings.manage',
    'settings.manage',
    'countries', 'countries.manage',
    'ai_setting', 'ai_setting.manage',
    'languages', 'languages.manage',
    'email_templates', 'email_templates.manage',
    'maintenance_mode', 'maintenance_mode.manage',
    'update_application', 'update_application.manage',
    'reports', 'reports.view',
  ],

  viewer: [
    'dashboard', 'dashboard.view',
    'customers', 'customers.view',
    'reports', 'reports.view',
    'invoices', 'invoices.view',
  ],

  customer_owner: [
    // Owner has ALL customer permissions
    'all_customer',
  ],

  customer_admin: [
    // Admin has most but not team management or billing
    'dashboard',
    'sms.quick_send', 'sms.campaign_builder', 'sms.send_using_file', 'sms.templates',
    'contacts.view', 'contacts.create', 'contacts.edit', 'contacts.delete',
    'contact_groups.view', 'contact_groups.create', 'contact_groups.edit', 'contact_groups.delete',
    'sender_ids.view', 'sender_ids.request',
    'all_messages.view', 'campaigns.view', 'reports.view',
    'blacklist.view', 'blacklist.create', 'blacklist.delete',
    'billing.view', 'billing.invoices',
    'account.view', 'account.edit',
    'settings.view',
    'support.view', 'support.create',
    'developers.view',
    'automations.view',
  ],

  customer_member: [
    // Basic member with limited permissions
    'dashboard',
    'sms.quick_send',
    'contacts.view',
    'contact_groups.view',
    'all_messages.view',
    'billing.view',
    'account.view',
    'support.view', 'support.create',
  ],
};

// ==================== ROLE METADATA ====================
export const RoleMeta: Record<UserRole, { label: string; description: string; color: string; scope: 'admin' | 'customer' }> = {
  super_admin: { label: 'Super Admin', description: 'Full access to everything', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', scope: 'admin' },
  admin: { label: 'Admin', description: 'Standard admin access', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', scope: 'admin' },
  support_admin: { label: 'Support Admin', description: 'Customer support management', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', scope: 'admin' },
  billing_admin: { label: 'Billing Admin', description: 'Billing and payments management', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', scope: 'admin' },
  technical_admin: { label: 'Technical Admin', description: 'System and infrastructure management', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', scope: 'admin' },
  viewer: { label: 'Viewer', description: 'Read-only access', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', scope: 'admin' },
  customer_owner: { label: 'Owner', description: 'Account owner with full access', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', scope: 'customer' },
  customer_admin: { label: 'Admin', description: 'Team admin with most permissions', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', scope: 'customer' },
  customer_member: { label: 'Member', description: 'Basic team member access', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', scope: 'customer' },
};

// ==================== ADMIN VIEW → PERMISSION MAPPING ====================
// Maps each admin ViewId to the permission required to access it
export const AdminViewPermissions: Record<string, string> = {
  'dashboard': 'dashboard.view',
  'compose-sms': 'sms.compose',
  'customers': 'customers.view',
  'subscription': 'subscriptions.view',
  'announcements': 'announcements.view',
  'plans': 'plans.view',
  'currencies': 'currencies.manage',
  'tax-setting': 'settings.manage',
  'sending-servers': 'sending_servers.view',
  'sender-id': 'sender_ids.view',
  'blacklist': 'blacklist.view',
  'spam-words': 'spam_words.manage',
  'blocked-sender-id': 'blocked_sender_ids.manage',
  'administrators': 'administrators.view',
  'admin-roles': 'admin_roles.manage',
  'all-settings': 'settings.view',
  'countries': 'countries.manage',
  'ai-setting': 'ai_setting.manage',
  'language': 'languages.manage',
  'payment-gateways': 'payment_gateways.manage',
  'email-templates': 'email_templates.manage',
  'terms-of-use': 'terms_of_use.manage',
  'privacy-policy': 'privacy_policy.manage',
  'maintenance-mode': 'maintenance_mode.manage',
  'update-application': 'update_application.manage',
  'report-dashboard': 'reports.view',
  'sms-history': 'reports.sms_history',
  'campaigns-report': 'reports.campaigns',
  'invoices': 'invoices.view',
  'theme-customizer': 'theme.customizer',
  'sms-templates': 'sms_templates.view',
  'support-tickets': 'support_tickets.view',
  'help-center': 'help_center',
};

// ==================== CUSTOMER VIEW → PERMISSION MAPPING ====================
export const CustomerViewPermissions: Record<string, string> = {
  'customer-dashboard': 'dashboard',
  'account': 'account.view',
  'compose-sms': 'sms.quick_send',
  'contacts': 'contacts.view',
  'contact-groups': 'contact_groups.view',
  'all-messages': 'all_messages.view',
  'sms-history': 'all_messages.view',
  'sms-templates': 'sms.templates',
  'sender-ids': 'sender_ids.view',
  'billing': 'billing.view',
  'campaign-builder': 'sms.campaign_builder',
  'campaigns': 'campaigns.view',
  'blacklist': 'blacklist.view',
  'automations': 'automations.view',
  'developers': 'developers.view',
  'reports': 'reports.view',
  'support': 'support.view',
  'help-center': 'support.view',
  'settings': 'settings.view',
};

// ==================== PERMISSION CHECKING UTILITIES ====================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = RolePermissionMap[role] || [];
  if (perms.includes('all')) return true;
  if (perms.includes('all_customer')) {
    return permission in CustomerPermissions;
  }
  return perms.includes(permission);
}

/**
 * Check if an admin role can access a specific view
 */
export function canAccessAdminView(role: UserRole, viewId: string): boolean {
  // Super admin can access everything
  if (hasPermission(role, 'all')) return true;

  const requiredPermission = AdminViewPermissions[viewId];
  if (!requiredPermission) return false;

  return hasPermission(role, requiredPermission);
}

/**
 * Check if a customer role can access a specific view
 */
export function canAccessCustomerView(role: UserRole, viewId: string): boolean {
  // Owner has all customer permissions
  if (hasPermission(role, 'all_customer')) return true;

  const requiredPermission = CustomerViewPermissions[viewId];
  if (!requiredPermission) return false;

  return hasPermission(role, requiredPermission);
}

/**
 * Get all admin views accessible by a role
 */
export function getAccessibleAdminViews(role: UserRole, allViews: string[]): string[] {
  if (hasPermission(role, 'all')) return allViews;
  return allViews.filter((viewId) => canAccessAdminView(role, viewId));
}

/**
 * Get all customer views accessible by a role
 */
export function getAccessibleCustomerViews(role: UserRole, allViews: string[]): string[] {
  if (hasPermission(role, 'all_customer')) return allViews;
  return allViews.filter((viewId) => canAccessCustomerView(role, viewId));
}

/**
 * Get the list of permission strings for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return RolePermissionMap[role] || [];
}

/**
 * Check if user is an admin-level role
 */
export function isAdminRole(role: UserRole): boolean {
  return ['super_admin', 'admin', 'support_admin', 'billing_admin', 'technical_admin', 'viewer'].includes(role);
}

/**
 * Check if user is a customer-level role
 */
export function isCustomerRole(role: UserRole): boolean {
  return ['customer_owner', 'customer_admin', 'customer_member'].includes(role);
}

/**
 * Get customer roles that a given customer role can assign to sub-users
 */
export function getAssignableCustomerRoles(currentRole: UserRole): UserRole[] {
  switch (currentRole) {
    case 'customer_owner':
      return ['customer_owner', 'customer_admin', 'customer_member'];
    case 'customer_admin':
      return ['customer_admin', 'customer_member'];
    default:
      return [];
  }
}

/**
 * Check if a customer role can manage team members
 */
export function canManageTeam(role: UserRole): boolean {
  return ['customer_owner', 'customer_admin'].includes(role);
}

/**
 * Check if a customer role can perform billing operations (topup)
 */
export function canManageBilling(role: UserRole): boolean {
  return role === 'customer_owner';
}

/**
 * Check if an admin role can impersonate customers
 */
export function canImpersonate(role: UserRole): boolean {
  return role === 'super_admin' || role === 'admin';
}
