// ============================================================
// Beem Africa SMS API Client Library
// ============================================================

export interface BeemConfig {
  apiKey: string;
  secretKey: string;
  senderId: string;
}

export interface SendSmsRecipient {
  recipient_id: number;
  dest_addr: string;
}

export interface SendSmsRequest {
  message: string;
  recipients: SendSmsRecipient[];
  scheduleTime?: string;
  encoding?: number;
  sourceAddr?: string;
}

export interface SendSmsResponse {
  successful: boolean;
  request_id: number;
  code: number;
  message: string;
  valid: number;
  invalid: number;
  duplicates: number;
}

export interface BalanceResponse {
  data: {
    credit_balance: number;
  };
}

export interface DeliveryReportItem {
  dest_addr: string;
  status: string;
  request_id: string;
}

export interface SenderName {
  id: number;
  senderid: string;
  sample_content: string;
  status: string;
  created: string;
}

export interface SenderNamesResponse {
  data: SenderName[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface SmsTemplate {
  id: number;
  sms_title: string;
  message: string;
  created: string;
}

export interface SmsTemplatesResponse {
  data: SmsTemplate[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface CreateTemplateResponse {
  data: {
    id: number;
    sms_title: string;
    message: string;
  };
}

export interface EditTemplateResponse {
  data: {
    successful: boolean;
    args: {
      sms_title: string;
      message: string;
    };
  };
}

export interface DeleteTemplateResponse {
  data: {
    code: number;
    message: string;
  };
}

// Beem API error codes
export const BEEM_ERROR_CODES: Record<number, string> = {
  100: 'Success',
  101: 'Invalid phone number',
  102: 'Insufficient balance',
  103: 'Internal server error',
  104: 'Missing required parameters',
  105: 'Invalid schedule time',
  106: 'Invalid encoding',
  107: 'Too many recipients',
  108: 'Invalid recipient format',
  109: 'Invalid or empty message',
  110: 'Message too long',
  111: 'Invalid sender ID',
  112: 'Sender ID not approved',
  113: 'Account suspended',
  114: 'Duplicate request',
  115: 'Rate limit exceeded',
  116: 'Invalid API key',
  117: 'IP not allowed',
  118: 'Invalid callback URL',
  119: 'Message rejected by operator',
  120: 'Invalid authentication',
  121: 'Account not activated',
  122: 'Network error',
  123: 'Unknown error',
};

function getConfig(): BeemConfig | null {
  const apiKey = process.env.BEEM_API_KEY;
  const secretKey = process.env.BEEM_SECRET_KEY;
  const senderId = process.env.BEEM_SENDER_ID;

  if (!apiKey || !secretKey) {
    return null;
  }

  return {
    apiKey,
    secretKey,
    senderId: senderId || 'SDASMS',
  };
}

function getAuthHeader(config: BeemConfig): string {
  return `Basic ${Buffer.from(config.apiKey + ':' + config.secretKey).toString('base64')}`;
}

function getErrorMessage(code: number): string {
  return BEEM_ERROR_CODES[code] || `Unknown error (code: ${code})`;
}

export class BeemApiError extends Error {
  code: number;
  constructor(code: number, message?: string) {
    super(message || getErrorMessage(code));
    this.code = code;
    this.name = 'BeemApiError';
  }
}

// ============================================================
// Send SMS
// ============================================================
export async function sendSms(request: SendSmsRequest): Promise<SendSmsResponse> {
  const config = getConfig();
  if (!config) {
    return getMockSendSmsResponse(request);
  }

  const body: Record<string, unknown> = {
    source_addr: request.sourceAddr || config.senderId,
    schedule_time: '',
    encoding: request.encoding || 0,
    message: request.message,
    recipients: request.recipients,
  };

  if (request.scheduleTime) {
    body.schedule_time = request.scheduleTime;
  }

  try {
    const response = await fetch('https://apisms.beem.africa/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!data.successful && data.code) {
      throw new BeemApiError(data.code, data.message);
    }

    return data as SendSmsResponse;
  } catch (error) {
    if (error instanceof BeemApiError) throw error;
    throw new BeemApiError(122, `Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

// ============================================================
// Check Balance
// ============================================================
export async function checkBalance(): Promise<BalanceResponse> {
  const config = getConfig();
  if (!config) {
    return { data: { credit_balance: 45230 } };
  }

  try {
    const response = await fetch('https://apisms.beem.africa/public/v1/vendors/balance', {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new BeemApiError(120, 'Failed to fetch balance');
    }

    return await response.json() as BalanceResponse;
  } catch (error) {
    if (error instanceof BeemApiError) throw error;
    throw new BeemApiError(122, `Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

// ============================================================
// Delivery Reports
// ============================================================
export async function getDeliveryReports(destAddr: string, requestId: string): Promise<DeliveryReportItem[]> {
  const config = getConfig();
  if (!config) {
    return getMockDeliveryReports(destAddr);
  }

  try {
    const params = new URLSearchParams({
      dest_addr: destAddr,
      request_id: requestId,
    });

    const response = await fetch(
      `https://dlrapi.beem.africa/public/v1/delivery-reports?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(config),
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new BeemApiError(120, 'Failed to fetch delivery reports');
    }

    return await response.json() as DeliveryReportItem[];
  } catch (error) {
    if (error instanceof BeemApiError) throw error;
    throw new BeemApiError(122, `Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

// ============================================================
// Get Sender Names
// ============================================================
export async function getSenderNames(q?: string, status?: string): Promise<SenderNamesResponse> {
  const config = getConfig();
  if (!config) {
    return getMockSenderNames(q, status);
  }

  try {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);

    const url = `https://apisms.beem.africa/public/v1/sender-names${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new BeemApiError(120, 'Failed to fetch sender names');
    }

    return await response.json() as SenderNamesResponse;
  } catch (error) {
    if (error instanceof BeemApiError) throw error;
    throw new BeemApiError(122, `Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

// ============================================================
// Get SMS Templates
// ============================================================
export async function getSmsTemplates(): Promise<SmsTemplatesResponse> {
  const config = getConfig();
  if (!config) {
    return getMockSmsTemplates();
  }

  try {
    const response = await fetch('https://apisms.beem.africa/public/v1/sms-templates', {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new BeemApiError(120, 'Failed to fetch SMS templates');
    }

    return await response.json() as SmsTemplatesResponse;
  } catch (error) {
    if (error instanceof BeemApiError) throw error;
    throw new BeemApiError(122, `Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

// ============================================================
// Add SMS Template
// ============================================================
export async function addSmsTemplate(smsTitle: string, message: string): Promise<CreateTemplateResponse> {
  const config = getConfig();
  if (!config) {
    return { data: { id: Date.now(), sms_title: smsTitle, message } };
  }

  try {
    const response = await fetch('https://apisms.beem.africa/public/v1/sms-templates', {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sms_title: smsTitle, message }),
    });

    if (!response.ok) {
      throw new BeemApiError(120, 'Failed to create SMS template');
    }

    return await response.json() as CreateTemplateResponse;
  } catch (error) {
    if (error instanceof BeemApiError) throw error;
    throw new BeemApiError(122, `Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

// ============================================================
// Edit SMS Template
// ============================================================
export async function editSmsTemplate(templateId: number, smsTitle: string, message: string): Promise<EditTemplateResponse> {
  const config = getConfig();
  if (!config) {
    return { data: { successful: true, args: { sms_title: smsTitle, message } } };
  }

  try {
    const response = await fetch(`https://apisms.beem.africa/public/v1/sms-templates/${templateId}`, {
      method: 'PUT',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sms_title: smsTitle, message }),
    });

    if (!response.ok) {
      throw new BeemApiError(120, 'Failed to edit SMS template');
    }

    return await response.json() as EditTemplateResponse;
  } catch (error) {
    if (error instanceof BeemApiError) throw error;
    throw new BeemApiError(122, `Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

// ============================================================
// Delete SMS Template
// ============================================================
export async function deleteSmsTemplate(templateId: number): Promise<DeleteTemplateResponse> {
  const config = getConfig();
  if (!config) {
    return { data: { code: 128, message: 'SMS Template Deleted Successfully' } };
  }

  try {
    const response = await fetch(`https://apisms.beem.africa/public/v1/sms-templates/${templateId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new BeemApiError(120, 'Failed to delete SMS template');
    }

    return await response.json() as DeleteTemplateResponse;
  } catch (error) {
    if (error instanceof BeemApiError) throw error;
    throw new BeemApiError(122, `Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

// ============================================================
// Check if Beem is configured
// ============================================================
export function isBeemConfigured(): boolean {
  return getConfig() !== null;
}

// ============================================================
// Mock Data Fallbacks
// ============================================================
function getMockSendSmsResponse(request: SendSmsRequest): SendSmsResponse {
  return {
    successful: true,
    request_id: Math.floor(Math.random() * 1000000),
    code: 100,
    message: 'Message sent successfully (demo mode)',
    valid: request.recipients.length,
    invalid: 0,
    duplicates: 0,
  };
}

function getMockDeliveryReports(_destAddr: string): DeliveryReportItem[] {
  return [
    { dest_addr: _destAddr, status: 'delivered', request_id: String(Math.floor(Math.random() * 1000000)) },
  ];
}

function getMockSenderNames(_q?: string, status?: string): SenderNamesResponse {
  const allNames: SenderName[] = [
    { id: 1, senderid: 'SDASMS', sample_content: 'Your verification code is 123456', status: 'active', created: '2024-01-15T10:00:00Z' },
    { id: 2, senderid: 'ACMECORP', sample_content: 'Order confirmed! Track at example.com', status: 'active', created: '2024-02-20T10:00:00Z' },
    { id: 3, senderid: 'GLOBALTECH', sample_content: 'Meeting reminder: Team standup at 10 AM', status: 'active', created: '2024-03-10T10:00:00Z' },
    { id: 4, senderid: 'EUROMAIL', sample_content: 'Welcome to our service!', status: 'pending', created: '2024-04-01T10:00:00Z' },
    { id: 5, senderid: 'ASIATICK', sample_content: 'Your order has shipped!', status: 'active', created: '2024-05-15T10:00:00Z' },
  ];

  let filtered = allNames;
  if (status) {
    filtered = filtered.filter(n => n.status === status);
  }
  if (_q) {
    const query = _q.toLowerCase();
    filtered = filtered.filter(n => n.senderid.toLowerCase().includes(query));
  }

  return {
    data: filtered,
    pagination: {
      total: filtered.length,
      per_page: 20,
      current_page: 1,
      last_page: 1,
    },
  };
}

function getMockSmsTemplates(): SmsTemplatesResponse {
  return {
    data: [
      { id: 1, sms_title: 'OTP Verification', message: 'Your verification code is {{code}}. Valid for 5 minutes.', created: '2024-01-15T10:00:00Z' },
      { id: 2, sms_title: 'Order Confirmation', message: 'Your order #{{order_id}} has been confirmed! Track at {{url}}', created: '2024-02-20T10:00:00Z' },
      { id: 3, sms_title: 'Welcome Message', message: 'Welcome to SDASMS, {{name}}! Your account has been created successfully.', created: '2024-03-10T10:00:00Z' },
      { id: 4, sms_title: 'Balance Alert', message: 'Your SMS balance is low: {{balance}} credits remaining. Top up now!', created: '2024-04-01T10:00:00Z' },
    ],
    pagination: {
      total: 4,
      per_page: 20,
      current_page: 1,
      last_page: 1,
    },
  };
}
