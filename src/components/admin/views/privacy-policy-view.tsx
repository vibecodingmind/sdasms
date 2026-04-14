'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function PrivacyPolicyView() {
  const [content, setContent] = useState(`# Privacy Policy

## 1. Information Collection

We collect information you provide directly to us, including:
- Name, email address, phone number, and company details
- Payment and billing information
- Message content and recipient lists
- Usage data and analytics

## 2. Use of Information

We use the information we collect to:
- Provide, maintain, and improve our messaging services
- Process transactions and send related notifications
- Respond to comments, questions, and support requests
- Monitor and analyze trends, usage, and activities
- Detect, investigate, and prevent fraudulent or unauthorized activities

## 3. Data Security

We implement appropriate technical and organizational security measures including:
- Encryption of data in transit (TLS 1.3) and at rest (AES-256)
- Regular security audits and penetration testing
- Access controls and authentication mechanisms
- Secure data centers with physical security measures

## 4. Data Sharing

We do not sell your personal information. We may share data with:
- Telecommunications carriers to deliver your messages
- Payment processors for billing purposes
- Law enforcement when required by law
- Service providers who assist in our operations

## 5. Data Retention

- Account data is retained while your account is active
- Message logs are retained for 90 days after delivery
- You can request deletion of your data at any time

## 6. Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Export your data
- Object to data processing

## 7. Cookies

We use cookies and similar technologies for authentication, analytics, and improving user experience.

## 8. Contact Us

For privacy-related inquiries, contact us at privacy@smspro.com`);

  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mt-0.5">Edit your privacy policy page content</p>
      </div>
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Privacy Policy Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={24} className="font-mono text-sm" />
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
              Privacy policy updated successfully!
            </div>
          )}
          <div className="flex justify-end">
            <Button className="bg-[#D72444] hover:bg-[#C01E3A] text-white" onClick={() => setSaved(true)}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
