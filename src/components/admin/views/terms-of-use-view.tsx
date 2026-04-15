'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function TermsOfUseView() {
  const [content, setContent] = useState(`# Terms of Use

## 1. Acceptance of Terms

By accessing and using SDASMS ("the Service"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, you may not use the Service.

## 2. Service Description

SDASMS provides bulk SMS and multi-channel messaging services including but not limited to SMS, WhatsApp, Viber, and OTP delivery through our web platform and REST API.

## 3. User Responsibilities

- Users are responsible for maintaining the confidentiality of their account credentials
- Users must comply with all applicable laws and regulations regarding electronic communications
- Users must not send spam, fraudulent, or illegal content
- Users are responsible for obtaining consent from message recipients

## 4. Payment Terms

- Subscription fees are billed in advance on a monthly or annual basis
- Top-up credits are non-refundable once purchased
- All prices are in USD unless otherwise specified

## 5. Service Availability

- We strive for 99.9% uptime but do not guarantee uninterrupted service
- Scheduled maintenance will be announced in advance when possible
- We reserve the right to modify or discontinue features with notice

## 6. Termination

- Either party may terminate with 30 days written notice
- We may immediately terminate accounts that violate these Terms
- Upon termination, remaining credits expire and are non-refundable

## 7. Limitation of Liability

SDASMS shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of the Service.

## 8. Governing Law

These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States.`);

  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Terms of Use Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={24} className="font-mono text-sm" />
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
              Terms of use updated successfully!
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
