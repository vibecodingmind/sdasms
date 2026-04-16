'use client';

import React, { useState } from 'react';
import {
  Copy, Check, RefreshCw, ExternalLink, Key, Shield, Globe,
  Info, BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// ==================== MOCK DATA ====================
const apiConfig = {
  oauthEndpoint: 'https://my.sdasms.com/api/v3/',
  httpEndpoint: 'https://my.sdasms.com/api/http/',
  apiToken: 'sdasms_demo_token_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
  tokenMasked: 'sdasms_••••••••••••••••••••••••••••••••q7r8s9t0',
};

export function DevelopersView() {
  const [tokenVisible, setTokenVisible] = useState(false);
  const [copied, setCopied] = useState<'token' | 'oauth' | 'http' | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const handleCopy = async (text: string, type: 'token' | 'oauth' | 'http') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleRegenerateToken = async () => {
    setRegenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('API token regenerated successfully!');
      setTokenVisible(false);
    } catch {
      toast.error('Failed to regenerate token');
    } finally {
      setRegenerating(false);
    }
  };

  const handleViewDocs = (type: 'oauth' | 'http') => {
    toast.info(`Opening ${type === 'oauth' ? 'OAuth 2.0' : 'HTTP API'} documentation...`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* ─── Info Banner ─── */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <p className="font-semibold">Developer API</p>
          <p className="text-xs opacity-80">
            Use these API endpoints to integrate SMS functionality into your applications. Keep your API token secure and never share it publicly.
          </p>
        </div>
      </div>

      {/* ─── OAuth 2.0 API Endpoint ─── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              OAuth 2.0 API Endpoint
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={apiConfig.oauthEndpoint}
              className="h-10 text-sm font-mono bg-gray-50 dark:bg-gray-900"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3 shrink-0"
              onClick={() => handleCopy(apiConfig.oauthEndpoint, 'oauth')}
            >
              {copied === 'oauth' ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Use this endpoint for OAuth 2.0 authenticated API requests. Supports Bearer token authentication.
          </p>
        </CardContent>
      </Card>

      {/* ─── HTTP API Endpoint ─── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              HTTP API Endpoint
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={apiConfig.httpEndpoint}
              className="h-10 text-sm font-mono bg-gray-50 dark:bg-gray-900"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3 shrink-0"
              onClick={() => handleCopy(apiConfig.httpEndpoint, 'http')}
            >
              {copied === 'http' ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Use this endpoint for simple HTTP API requests with token-based authentication.
          </p>
        </CardContent>
      </Card>

      {/* ─── API Token ─── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              API Token
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                readOnly
                type={tokenVisible ? 'text' : 'password'}
                value={tokenVisible ? apiConfig.apiToken : apiConfig.tokenMasked}
                className="h-10 text-sm font-mono bg-gray-50 dark:bg-gray-900 pr-20"
              />
              <button
                onClick={() => setTokenVisible(!tokenVisible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline px-2 py-1"
              >
                {tokenVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3 shrink-0"
              onClick={() => handleCopy(apiConfig.apiToken, 'token')}
            >
              {copied === 'token' ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRegenerateToken}
              disabled={regenerating}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              {regenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate Token
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleViewDocs('oauth')}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Read the Docs
            </Button>
            <Button
              variant="outline"
              onClick={() => handleViewDocs('http')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Read the HTTP Docs
            </Button>
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Warning:</span> Regenerating your API token will immediately invalidate the current token. All existing integrations using the old token will stop working. Make sure to update your applications with the new token.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
