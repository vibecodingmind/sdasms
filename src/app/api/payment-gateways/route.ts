import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List payment gateways (settings-based, not in schema - return from settings)
export async function GET() {
  try {
    // Payment gateways are stored in settings, fetch them
    const gatewaySettings = await prisma.setting.findMany({
      where: { category: 'payment_gateway' },
    });

    if (gatewaySettings.length > 0) {
      // Parse gateways from settings
      const gateways = [];
      for (const s of gatewaySettings) {
        try {
          const config = JSON.parse(s.value);
          gateways.push({ id: s.key, ...config });
        } catch {
          gateways.push({ id: s.key, name: s.key, status: 'inactive' });
        }
      }
      return NextResponse.json({ success: true, data: gateways });
    }

    // Default gateways (no settings found)
    const defaultGateways = [
      { id: 'pesapal', name: 'Pesapal', status: 'active', description: 'East African payment gateway', supported_methods: ['M-Pesa', 'Airtel Money', 'Visa', 'Mastercard'] },
      { id: 'paypal', name: 'PayPal', status: 'active', description: 'Global payment platform', supported_methods: ['PayPal Balance', 'Credit Card', 'Bank Transfer'] },
      { id: 'stripe', name: 'Stripe', status: 'active', description: 'Online payment processing', supported_methods: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay'] },
      { id: 'manual', name: 'Manual Payment', status: 'active', description: 'Offline manual payments', supported_methods: ['Bank Transfer', 'Bank Deposit', 'Check', 'Cash'] },
    ];

    return NextResponse.json({ success: true, data: defaultGateways });
  } catch (error) {
    console.error('Failed to fetch payment gateways:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch payment gateways' }, { status: 500 });
  }
}

// POST: Update gateway settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gateway_id, name, status, api_key, secret_key, config } = body;

    const settingsData: Record<string, string> = {
      name: name || gateway_id,
      status: status || 'inactive',
      api_key: api_key || '',
      secret_key: secret_key || '',
      config: config ? JSON.stringify(config) : '{}',
      updated_at: new Date().toISOString(),
    };

    // Store as individual settings under payment_gateway category
    for (const [key, value] of Object.entries(settingsData)) {
      await prisma.setting.upsert({
        where: { key: `payment_gateway_${gateway_id}_${key}` },
        update: { value },
        create: { key: `payment_gateway_${gateway_id}_${key}`, value, category: 'payment_gateway' },
      });
    }

    return NextResponse.json({ success: true, message: 'Gateway updated' });
  } catch (error) {
    console.error('Failed to update payment gateway:', error);
    return NextResponse.json({ success: false, message: 'Failed to update payment gateway' }, { status: 500 });
  }
}
