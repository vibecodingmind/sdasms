'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, BookOpen, MessageCircle, Eye, ThumbsUp, ThumbsDown,
  TrendingUp, ArrowRight, FileText, Send, Zap, Shield, Settings, Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useCustomer } from '../customer-context';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────
interface Article {
  id: number;
  title: string;
  category: string;
  views: number;
  excerpt: string;
  content: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  articles: number;
  color: string;
  icon: React.ReactNode;
}

// ─── Mock Data ────────────────────────────────────────────────────
const categories: Category[] = [
  { id: 1, name: 'Getting Started', description: 'Basic setup and quick start guides', articles: 8, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Zap className="h-6 w-6" /> },
  { id: 2, name: 'SMS Sending', description: 'How to send SMS, manage contacts, and track delivery', articles: 12, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <Send className="h-6 w-6" /> },
  { id: 3, name: 'Billing & Payments', description: 'Subscription plans, invoices, and payment methods', articles: 6, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: <Shield className="h-6 w-6" /> },
  { id: 4, name: 'API & Integrations', description: 'REST API documentation and third-party integrations', articles: 10, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: <Settings className="h-6 w-6" /> },
  { id: 5, name: 'Account Management', description: 'Profile settings, security, and team management', articles: 5, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', icon: <FileText className="h-6 w-6" /> },
  { id: 6, name: 'Troubleshooting', description: 'Common issues and their solutions', articles: 15, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <Wrench className="h-6 w-6" /> },
];

const articles: Article[] = [
  { id: 1, title: 'How to Send Your First SMS', category: 'Getting Started', views: 1250, excerpt: 'Learn how to compose and send your first SMS message using the SDASMS platform. This guide covers the basic steps from composing your message to selecting recipients.', content: '## Getting Started with SMS\n\nTo send your first SMS:\n\n1. Navigate to the **Compose SMS** page from the sidebar\n2. Select your Sender ID from the dropdown\n3. Add recipient phone numbers (you can type or paste them)\n4. Type your message in the text area\n5. Review the character count and estimated cost\n6. Click **Send** to dispatch your message\n\n### Tips\n- Each SMS segment supports up to 160 characters\n- Long messages will be split into multiple segments\n- You can schedule messages for future delivery\n\n### Need Help?\nIf you encounter any issues, please contact our support team.' },
  { id: 2, title: 'Understanding SMS Delivery Reports', category: 'SMS Sending', views: 890, excerpt: 'Learn about the different delivery statuses and how to track your message delivery in real-time.', content: '## SMS Delivery Reports\n\nDelivery reports show the status of your sent messages:\n\n### Status Types\n- **Delivered**: Message successfully reached the recipient\n- **Sent**: Message accepted by the gateway, awaiting delivery\n- **Failed**: Message could not be delivered\n- **Pending**: Message is queued for delivery\n\n### How to Check\nNavigate to **SMS History** to view all delivery reports.\n\n### Real-time Updates\nDelivery reports are updated in real-time. You can also set up webhooks for automated notifications.' },
  { id: 3, title: 'How to Register a Sender ID', category: 'SMS Sending', views: 2100, excerpt: 'Step-by-step guide to registering and verifying your Sender ID for SMS sending.', content: '## Registering a Sender ID\n\nA Sender ID is the name or number that appears as the sender of your SMS messages.\n\n### Requirements\n- Must be 3-11 alphanumeric characters\n- Cannot start with a number\n- Must comply with telecom regulations\n\n### Steps\n1. Go to **Sender IDs** in the sidebar\n2. Click **Request New Sender ID**\n3. Enter your desired Sender ID\n4. Select the target country\n5. Submit for verification\n\n### Verification Time\nTypically 1-3 business days depending on the country.' },
  { id: 4, title: 'Managing Your Subscription Plan', category: 'Billing & Payments', views: 650, excerpt: 'How to upgrade, downgrade, or cancel your subscription plan.', content: '## Subscription Management\n\n### Current Plans\n- **Starter**: $49.99/mo - 5,000 SMS\n- **Business**: $199.99/mo - 50,000 SMS\n- **Enterprise**: $499.99/mo - Unlimited SMS\n\n### Upgrade/Downgrade\nGo to **Billing** > **Current Plan** to change your plan. Changes take effect immediately.\n\n### Cancellation\nYou can cancel your subscription at any time from your billing settings. Your account will remain active until the end of the current billing period.' },
  { id: 5, title: 'REST API Authentication Guide', category: 'API & Integrations', views: 1800, excerpt: 'Learn how to authenticate with the SDASMS REST API using API keys.', content: '## API Authentication\n\n### Getting Your API Key\n1. Go to **Settings** > **API Key**\n2. Click **Generate New Key**\n3. Copy your key (shown only once)\n\n### Making Requests\nInclude your API key in the Authorization header:\n```\nAuthorization: Bearer YOUR_API_KEY\n```\n\n### Rate Limits\n- Starter: 100 requests/minute\n- Business: 500 requests/minute\n- Enterprise: 1000 requests/minute' },
  { id: 6, title: 'Setting Up Webhooks for Delivery Reports', category: 'API & Integrations', views: 560, excerpt: 'Configure webhook endpoints to receive real-time delivery report notifications.', content: '## Webhook Setup\n\n### Configure Your Endpoint\n1. Go to **Settings** > **Webhooks**\n2. Enter your callback URL\n3. Select event types (delivery reports, opt-outs)\n4. Save configuration\n\n### Payload Format\nDelivery report webhooks send a POST request with JSON payload.\n\n### Security\nWebhook requests include an HMAC signature header for verification.' },
  { id: 7, title: 'How to Import Contacts from CSV', category: 'Getting Started', views: 980, excerpt: 'Import your existing contacts into SDASMS using a CSV file.', content: '## CSV Import Guide\n\n### File Format\nYour CSV should have columns: name, phone, email, group\n\n### Steps\n1. Go to **Contacts**\n2. Click **Import** button\n3. Upload your CSV file\n4. Map columns to fields\n5. Review and confirm import\n\n### Tips\n- Maximum file size: 10MB\n- Supported encodings: UTF-8\n- Maximum contacts per import: 50,000' },
  { id: 8, title: 'Two-Factor Authentication Setup', category: 'Account Management', views: 430, excerpt: 'Secure your account with two-factor authentication.', content: '## 2FA Setup\n\n1. Go to **Settings** > **Security**\n2. Click **Enable 2FA**\n3. Scan QR code with authenticator app\n4. Enter verification code\n5. Save backup codes\n\n### Supported Apps\n- Google Authenticator\n- Authy\n- Microsoft Authenticator\n\n### Lost Your Device?\nUse one of the backup codes to log in, then disable and re-enable 2FA.' },
  { id: 9, title: 'SMS Not Delivering? Common Causes', category: 'Troubleshooting', views: 3200, excerpt: 'Find solutions for the most common SMS delivery issues.', content: '## Common SMS Delivery Issues\n\n### 1. Invalid Phone Number\nEnsure numbers include the country code (e.g., +255 for Tanzania).\n\n### 2. Sender ID Not Verified\nCheck your Sender ID status. Unverified IDs cannot send messages.\n\n### 3. Insufficient Balance\nTop up your SMS balance in the Billing section.\n\n### 4. Number on DND List\nRecipients who have activated DND (Do Not Disturb) will not receive messages.\n\n### 5. Gateway Issues\nCheck the gateway status page for any ongoing outages.\n\n### Still Need Help?\nContact our support team for assistance.' },
  { id: 10, title: 'Payment Methods Explained', category: 'Billing & Payments', views: 720, excerpt: 'Overview of all supported payment methods and how to use them.', content: '## Supported Payment Methods\n\n### Pesapal\nSupports M-Pesa, Airtel Money, Visa, Mastercard.\n\n### PayPal\nPay with PayPal balance, cards, or bank transfer.\n\n### Stripe\nAccepts all major credit and debit cards.\n\n### Manual Payment\nBank transfer, check, or cash deposit.\n\n### Managing Payment Methods\nGo to **Billing** > **Payment Methods** to add, update, or remove payment methods.' },
];

// ─── Component ────────────────────────────────────────────────────
export function HelpCenterCustomerView() {
  const { setCurrentView } = useCustomer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null);

  // Popular articles (top 4 by views)
  const popularArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.views - a.views).slice(0, 4);
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch = !searchQuery ||
        `${a.title} ${a.category} ${a.excerpt} ${a.content}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = !selectedCategory || a.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categoryColorMap: Record<string, string> = {
    'Getting Started': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'SMS Sending': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Billing & Payments': 'bg-purple-100 text-purple-700 dark:text-purple-400',
    'API & Integrations': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Account Management': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'Troubleshooting': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D72444]/10 text-[#D72444] mb-4">
              <BookOpen className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">How can we help you?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Search our knowledge base or browse categories below</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles, FAQs, tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Articles */}
      {!selectedCategory && !searchQuery && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#D72444]" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular Articles</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularArticles.map((article) => (
              <Card
                key={article.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => { setSelectedArticle(article); setHelpful(null); }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Badge className={cn('text-[10px] hover:bg-transparent mb-2', categoryColorMap[article.category])}>
                        {article.category}
                      </Badge>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[#D72444] dark:group-hover:text-rose-400 transition-colors leading-tight">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{article.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 shrink-0 mt-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span className="text-xs">{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category Cards */}
      {!selectedCategory && !searchQuery && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Browse by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setSelectedCategory(cat.name)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', cat.color)}>
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[#D72444] dark:group-hover:text-rose-400 transition-colors">
                          {cat.name}
                        </p>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#D72444] dark:group-hover:text-rose-400 transition-all group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{cat.articles} articles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category filter active */}
      {selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedCategory}</h3>
              <Badge className={cn('text-[10px] hover:bg-transparent', categoryColorMap[selectedCategory])}>
                {filteredArticles.length} articles
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setSelectedCategory(null)}
            >
              ← All Categories
            </Button>
          </div>
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => { setSelectedArticle(article); setHelpful(null); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#D72444] dark:group-hover:text-rose-400 transition-colors">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{article.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs">{article.views.toLocaleString()}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#D72444] transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredArticles.length === 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-gray-400">No articles found in this category</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Search results */}
      {searchQuery && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Search results for &ldquo;{searchQuery}&rdquo;
              </h3>
              <Badge variant="outline" className="text-xs">{filteredArticles.length}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </div>
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => { setSelectedArticle(article); setHelpful(null); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Badge className={cn('text-[10px] hover:bg-transparent mb-1.5', categoryColorMap[article.category])}>
                        {article.category}
                      </Badge>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#D72444] dark:group-hover:text-rose-400 transition-colors">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{article.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs">{article.views.toLocaleString()}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#D72444] transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredArticles.length === 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No articles found matching your search</p>
                  <p className="text-xs text-gray-400 mt-1">Try different keywords or browse categories</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Contact Support */}
      <Card className="border-0 shadow-sm bg-[#FEF2F2] dark:bg-[#D72444]/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D72444]/10 text-[#D72444] flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Still need help?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Our support team is available 24/7</p>
              </div>
            </div>
            <Button
              className="bg-[#D72444] hover:bg-[#B91E3A] text-white gap-2"
              onClick={() => setCurrentView('support')}
            >
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => { if (!open) setSelectedArticle(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <Badge className={cn('text-[10px] hover:bg-transparent w-fit', categoryColorMap[selectedArticle.category])}>
                  {selectedArticle.category}
                </Badge>
                <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                  {selectedArticle.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {selectedArticle.views.toLocaleString()} views
                  </span>
                </DialogDescription>
              </DialogHeader>

              <Separator />

              {/* Article content */}
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                {selectedArticle.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-base font-bold text-gray-800 dark:text-gray-100 mt-6 mb-2">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-4 mb-1.5">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('- **')) {
                    const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
                    if (match) {
                      return (
                        <div key={i} className="flex gap-2 ml-3 mb-1">
                          <span className="text-[#D72444] shrink-0">•</span>
                          <span><strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}</span>
                        </div>
                      );
                    }
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={i} className="flex gap-2 ml-3 mb-1">
                        <span className="text-[#D72444] shrink-0">•</span>
                        <span>{line.replace('- ', '')}</span>
                      </div>
                    );
                  }
                  if (line.match(/^\d+\./)) {
                    const match = line.match(/^(\d+)\.\s\*\*(.+?)\*\*\s*(.*)/);
                    if (match) {
                      return (
                        <div key={i} className="flex gap-2 ml-3 mb-1.5">
                          <span className="text-[#D72444] font-semibold shrink-0">{match[1]}.</span>
                          <span><strong>{match[2]}</strong> {match[3]}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="flex gap-2 ml-3 mb-1.5">
                        <span className="text-[#D72444] font-semibold shrink-0">{line.match(/^(\d+)\./)?.[1]}.</span>
                        <span>{line.replace(/^\d+\.\s/, '')}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('```')) {
                    return <pre key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-xs font-mono my-2 overflow-x-auto">{line.replace(/```/g, '')}</pre>;
                  }
                  if (line.trim() === '') {
                    return <div key={i} className="h-2" />;
                  }
                  return <p key={i} className="text-sm leading-relaxed mb-1">{line}</p>;
                })}
              </div>

              <Separator />

              {/* Was this helpful? */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Was this article helpful?</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={helpful === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'gap-1.5 text-xs',
                      helpful === 'yes' && 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                    )}
                    onClick={() => setHelpful('yes')}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Yes
                  </Button>
                  <Button
                    variant={helpful === 'no' ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'gap-1.5 text-xs',
                      helpful === 'no' && 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                    )}
                    onClick={() => setHelpful('no')}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    No
                  </Button>
                </div>
              </div>
              {helpful && (
                <p className="text-xs text-center text-gray-400">
                  {helpful === 'yes' ? 'Thank you for your feedback!' : 'Sorry to hear that. Consider contacting our support team for further assistance.'}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
